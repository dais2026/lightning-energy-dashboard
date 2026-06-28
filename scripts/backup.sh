#!/usr/bin/env bash
# =============================================================================
# backup.sh — Lightning Energy Dashboard Database Backup
# Usage: ./scripts/backup.sh [--output ./backups] [--no-compress]
# Requires: mysql client + mysqldump, or AWS CLI for RDS snapshots
# =============================================================================
set -euo pipefail

# ---- Config ------------------------------------------------------------------
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-lightning_energy}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-}"
COMPRESS=true
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/lightning_energy_${TIMESTAMP}.sql"

# ---- Parse args --------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case $1 in
    --output)      BACKUP_DIR="$2"; shift 2 ;;
    --no-compress) COMPRESS=false; shift ;;
    --retention)   RETENTION_DAYS="$2"; shift 2 ;;
    *)             echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ---- Setup -------------------------------------------------------------------
mkdir -p "$BACKUP_DIR"
echo "═══════════════════════════════════════════════════════"
echo "  Lightning Energy — Database Backup"
echo "  Database: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
echo "  Output:   ${BACKUP_DIR}"
echo "  Time:     $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "═══════════════════════════════════════════════════════"

# ---- Check mysqldump availability -------------------------------------------
if ! command -v mysqldump &>/dev/null; then
  echo "[ERROR] mysqldump not found. Install MySQL client tools."
  echo "  macOS:  brew install mysql-client"
  echo "  Ubuntu: sudo apt-get install mysql-client"
  exit 1
fi

# ---- Run backup --------------------------------------------------------------
echo "[INFO] Starting backup..."
MYSQL_PWD="${DB_PASS}" mysqldump \
  --host="${DB_HOST}" \
  --port="${DB_PORT}" \
  --user="${DB_USER}" \
  --single-transaction \
  --routines \
  --triggers \
  --set-gtid-purged=OFF \
  "${DB_NAME}" > "${BACKUP_FILE}"

BACKUP_SIZE=$(du -sh "${BACKUP_FILE}" | cut -f1)
echo "[INFO] Dump complete: ${BACKUP_FILE} (${BACKUP_SIZE})"

# ---- Compress ----------------------------------------------------------------
if [[ "$COMPRESS" == "true" ]]; then
  gzip -9 "${BACKUP_FILE}"
  BACKUP_FILE="${BACKUP_FILE}.gz"
  COMPRESSED_SIZE=$(du -sh "${BACKUP_FILE}" | cut -f1)
  echo "[INFO] Compressed: ${BACKUP_FILE} (${COMPRESSED_SIZE})"
fi

# ---- Rotate old backups ------------------------------------------------------
echo "[INFO] Rotating backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "lightning_energy_*.sql*" -mtime +${RETENTION_DAYS} -delete 2>/dev/null || true
REMAINING=$(find "${BACKUP_DIR}" -name "lightning_energy_*.sql*" | wc -l | tr -d ' ')
echo "[INFO] ${REMAINING} backup(s) retained"

echo ""
echo "[DONE] Backup completed successfully: ${BACKUP_FILE}"
