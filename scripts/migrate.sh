#!/usr/bin/env bash
# =============================================================================
# migrate.sh — Lightning Energy Dashboard Database Migration Runner
# Usage: ./scripts/migrate.sh [--dry-run] [--target 002]
# =============================================================================
set -euo pipefail

MIGRATIONS_DIR="${MIGRATIONS_DIR:-./drizzle/migrations}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-lightning_energy}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-}"
DRY_RUN=false
TARGET_VERSION=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    --target)  TARGET_VERSION="$2"; shift 2 ;;
    *)         echo "Unknown option: $1"; exit 1 ;;
  esac
done

mysql_cmd() {
  MYSQL_PWD="${DB_PASS}" mysql \
    --host="${DB_HOST}" \
    --port="${DB_PORT}" \
    --user="${DB_USER}" \
    "${DB_NAME}" "$@"
}

echo "═══════════════════════════════════════════════════════"
echo "  Lightning Energy — Database Migration"
echo "  Database: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
echo "  Migrations: ${MIGRATIONS_DIR}"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "  Mode: DRY RUN (no changes applied)"
fi
echo "═══════════════════════════════════════════════════════"

# Ensure schema_migrations table exists
mysql_cmd -e "
CREATE TABLE IF NOT EXISTS \`schema_migrations\` (
  \`version\`    VARCHAR(255) NOT NULL,
  \`applied_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`version\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
" 2>/dev/null

APPLIED=$(mysql_cmd -sNe "SELECT version FROM schema_migrations;" 2>/dev/null | sort)

APPLIED_COUNT=0
SKIPPED_COUNT=0

for SQL_FILE in "${MIGRATIONS_DIR}"/*.sql; do
  [[ -f "$SQL_FILE" ]] || continue
  VERSION=$(basename "$SQL_FILE" .sql)

  # Filter to target if specified
  if [[ -n "$TARGET_VERSION" && "$VERSION" != *"${TARGET_VERSION}"* ]]; then
    continue
  fi

  if echo "$APPLIED" | grep -qF "$VERSION"; then
    echo "[SKIP] ${VERSION} — already applied"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    continue
  fi

  echo "[RUN]  ${VERSION}..."
  if [[ "$DRY_RUN" == "false" ]]; then
    mysql_cmd < "$SQL_FILE"
    echo "[DONE] ${VERSION} applied"
  else
    echo "[DRYRUN] Would apply: ${SQL_FILE}"
  fi
  APPLIED_COUNT=$((APPLIED_COUNT + 1))
done

echo ""
echo "Migration complete: ${APPLIED_COUNT} applied, ${SKIPPED_COUNT} skipped"
