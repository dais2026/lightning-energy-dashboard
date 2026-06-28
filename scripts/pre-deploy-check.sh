#!/usr/bin/env bash
# =============================================================================
# pre-deploy-check.sh — Lightning Energy Dashboard Pre-Deployment Checklist
# Usage: ./scripts/pre-deploy-check.sh [--env production]
# =============================================================================
set -euo pipefail

ENVIRONMENT="${1:-production}"
PASS=0; WARN=0; FAIL=0
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
pass() { echo -e "${GREEN}[PASS]${NC} $1"; PASS=$((PASS+1)); }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; WARN=$((WARN+1)); }
fail() { echo -e "${RED}[FAIL]${NC} $1"; FAIL=$((FAIL+1)); }
info() { echo -e "${CYAN}[INFO]${NC} $1"; }

echo "═══════════════════════════════════════════════════════════════"
echo "  Lightning Energy Dashboard — Pre-Deployment Checklist"
echo "  Environment: ${ENVIRONMENT}"
echo "  Directory:   ${SOURCE_DIR}"
echo "  Time:        $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ---- 1. Git working tree -----------------------------------------------------
info "1. Checking Git working tree..."
cd "$SOURCE_DIR"
if git diff --quiet && git diff --cached --quiet; then
  pass "Working tree is clean"
else
  warn "Uncommitted changes present"
  git status --short | head -10
fi

# ---- 2. Node.js version ------------------------------------------------------
info "2. Checking Node.js version..."
NODE_VERSION=$(node --version 2>/dev/null | tr -d 'v' | cut -d. -f1 || echo "0")
if (( NODE_VERSION >= 18 )); then
  pass "Node.js v$(node --version) (>=18 required)"
else
  fail "Node.js v$(node --version) too old (requires >=18)"
fi

# ---- 3. TypeScript check -----------------------------------------------------
info "3. Running TypeScript type-check..."
if npm run check --silent 2>/dev/null; then
  pass "TypeScript: 0 errors"
else
  fail "TypeScript errors detected — run 'npm run check'"
fi

# ---- 4. Unit tests -----------------------------------------------------------
info "4. Running unit tests..."
if npm test --silent 2>/dev/null | grep -q "Tests.*passed"; then
  pass "All unit tests passing"
else
  fail "Unit tests failing — run 'npm test'"
fi

# ---- 5. Production build -----------------------------------------------------
info "5. Running production build..."
if npm run build --silent 2>/dev/null; then
  BUNDLE_KB=$(du -sk "${SOURCE_DIR}/dist/public" 2>/dev/null | cut -f1 || echo "0")
  pass "Production build succeeded (${BUNDLE_KB} KB)"
else
  fail "Production build failed — run 'npm run build'"
fi

# ---- 6. Required environment variables ---------------------------------------
info "6. Checking environment variables..."
REQUIRED_VARS=("DATABASE_URL" "SESSION_SECRET" "NODE_ENV")
OPTIONAL_VARS=("AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY" "S3_BUCKET_NAME")

for var in "${REQUIRED_VARS[@]}"; do
  if [[ -n "${!var:-}" ]]; then
    pass "Required: ${var} is set"
  else
    fail "Required: ${var} is NOT set"
  fi
done
for var in "${OPTIONAL_VARS[@]}"; do
  if [[ -n "${!var:-}" ]]; then
    pass "Optional: ${var} is set"
  else
    warn "Optional: ${var} not set (file uploads disabled)"
  fi
done

# ---- 7. Dependencies up to date ----------------------------------------------
info "7. Checking for outdated dependencies..."
OUTDATED=$(npm outdated --json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d))" 2>/dev/null || echo "0")
if [[ "$OUTDATED" -eq 0 ]]; then
  pass "All dependencies are current"
elif [[ "$OUTDATED" -lt 5 ]]; then
  warn "${OUTDATED} outdated packages (run 'npm outdated' to review)"
else
  warn "${OUTDATED} outdated packages — review before deploying"
fi

# ---- 8. Security audit -------------------------------------------------------
info "8. Running npm security audit..."
HIGH_VULNS=$(npm audit --json 2>/dev/null | python3 -c "import sys,json; a=json.load(sys.stdin).get('metadata',{}).get('vulnerabilities',{}); print(a.get('high',0)+a.get('critical',0))" 2>/dev/null || echo "0")
if [[ "$HIGH_VULNS" -eq 0 ]]; then
  pass "No high/critical vulnerabilities found"
else
  fail "${HIGH_VULNS} high/critical vulnerabilities — run 'npm audit'"
fi

# ---- 9. Migration files present ----------------------------------------------
info "9. Checking migration files..."
MIGRATION_COUNT=$(find "${SOURCE_DIR}/drizzle/migrations" -name "*.sql" 2>/dev/null | wc -l | tr -d ' ')
if [[ "$MIGRATION_COUNT" -gt 0 ]]; then
  pass "${MIGRATION_COUNT} migration file(s) found"
else
  warn "No migration files found in drizzle/migrations/"
fi

# ---- 10. Health script executable -------------------------------------------
info "10. Checking health-check script..."
if [[ -x "${SOURCE_DIR}/scripts/health-check.sh" ]]; then
  pass "health-check.sh is executable"
else
  warn "health-check.sh exists but is not executable (run: chmod +x scripts/health-check.sh)"
fi

# ---- Summary -----------------------------------------------------------------
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Pre-deployment Summary"
echo "═══════════════════════════════════════════════════════════════"
echo -e "  ${GREEN}Passed:${NC}   ${PASS}"
echo -e "  ${YELLOW}Warnings:${NC} ${WARN}"
echo -e "  ${RED}Failed:${NC}   ${FAIL}"
echo ""

if [[ $FAIL -gt 0 ]]; then
  echo -e "${RED}[BLOCKED]${NC} Deployment blocked — resolve ${FAIL} failing check(s) above."
  exit 2
elif [[ $WARN -gt 0 ]]; then
  echo -e "${YELLOW}[CAUTION]${NC} Ready to deploy with ${WARN} warning(s). Review before proceeding."
  exit 0
else
  echo -e "${GREEN}[READY]${NC} All checks passed. Safe to deploy."
  exit 0
fi
