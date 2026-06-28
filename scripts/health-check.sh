#!/usr/bin/env bash
# =============================================================================
# health-check.sh — Lightning Energy Dashboard Health Monitor
# Usage: ./scripts/health-check.sh [--url http://localhost:3001] [--json]
# =============================================================================
set -euo pipefail

# ---- Defaults ----------------------------------------------------------------
BASE_URL="${BASE_URL:-http://localhost:3001}"
JSON_OUTPUT=false
EXIT_CODE=0

# ---- Parse args --------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case $1 in
    --url)  BASE_URL="$2"; shift 2 ;;
    --json) JSON_OUTPUT=true; shift ;;
    *)      echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ---- Colours (disabled in JSON mode) -----------------------------------------
if [[ "$JSON_OUTPUT" == "false" ]]; then
  GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
else
  GREEN=''; YELLOW=''; RED=''; NC=''
fi

pass() { echo -e "${GREEN}[PASS]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; EXIT_CODE=1; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; EXIT_CODE=2; }

# ---- Check: /health endpoint -------------------------------------------------
check_health() {
  local response status
  response=$(curl -sf --max-time 10 "${BASE_URL}/health" 2>/dev/null) || { fail "/health endpoint not reachable at ${BASE_URL}"; return; }
  status=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('status','unknown'))" 2>/dev/null || echo "unknown")
  if [[ "$status" == "ok" ]]; then
    pass "/health → status: ok"
  else
    warn "/health returned status: ${status}"
  fi
}

# ---- Check: /metrics endpoint ------------------------------------------------
check_metrics() {
  local response
  response=$(curl -sf --max-time 10 "${BASE_URL}/metrics" 2>/dev/null) || { warn "/metrics endpoint not reachable"; return; }
  local heap_mb
  heap_mb=$(echo "$response" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('memory',{}).get('heapUsedMB',0))" 2>/dev/null || echo "0")
  if (( $(echo "$heap_mb > 800" | bc -l 2>/dev/null || echo 0) )); then
    warn "High heap usage: ${heap_mb} MB"
  else
    pass "/metrics → heap: ${heap_mb} MB"
  fi
}

# ---- Check: tRPC admin.getHealth ---------------------------------------------
check_trpc() {
  local response
  response=$(curl -sf --max-time 10 \
    "${BASE_URL}/trpc/admin.getHealth" \
    -H "Content-Type: application/json" 2>/dev/null) || { warn "tRPC admin.getHealth not reachable"; return; }
  local status
  status=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('result',{}).get('data',{}).get('status','unknown'))" 2>/dev/null || echo "unknown")
  if [[ "$status" == "ok" ]]; then
    pass "tRPC admin.getHealth → ok"
  else
    warn "tRPC admin.getHealth returned: ${status}"
  fi
}

# ---- Check: Static assets ---------------------------------------------------
check_static() {
  local http_code
  http_code=$(curl -so /dev/null -w "%{http_code}" --max-time 10 "${BASE_URL}/" 2>/dev/null || echo "000")
  if [[ "$http_code" == "200" ]]; then
    pass "Static assets → HTTP ${http_code}"
  else
    fail "Static assets → HTTP ${http_code} (expected 200)"
  fi
}

# ---- Run all checks ----------------------------------------------------------
echo "═══════════════════════════════════════════════════════"
echo "  Lightning Energy Dashboard — Health Check"
echo "  URL: ${BASE_URL}"
echo "  Time: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "═══════════════════════════════════════════════════════"

check_health
check_metrics
check_trpc
check_static

echo ""
if [[ $EXIT_CODE -eq 0 ]]; then
  echo -e "${GREEN}All checks passed ✓${NC}"
elif [[ $EXIT_CODE -eq 1 ]]; then
  echo -e "${YELLOW}Checks passed with warnings${NC}"
else
  echo -e "${RED}Health check FAILED${NC}"
fi

exit $EXIT_CODE
