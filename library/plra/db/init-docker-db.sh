#!/usr/bin/env bash
# =============================================================================
# PLRA — SQL Server Docker Initialization
# =============================================================================
# Run this after docker-compose up to initialize the database.
# The SQL Server container needs ~15 seconds to start.
#
# Usage:
#   docker-compose up -d sqlserver
#   sleep 15
#   ./db/init-docker-db.sh
# =============================================================================

set -euo pipefail

SA_PASSWORD="Plra_Dev_2026!"
SERVER="localhost,1433"
DB_NAME="plra"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)/sqlserver"

echo "========================================"
echo " PLRA — SQL Server Database Setup"
echo "========================================"

# Step 1: Create database
echo "[1/9] Creating database '${DB_NAME}'..."
docker exec plra-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "${SA_PASSWORD}" -C \
  -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${DB_NAME}') CREATE DATABASE [${DB_NAME}]"

# Step 2-8: Run migration scripts in order
SCRIPTS=(
  "01_schema_sequences.sql"
  "02_master_tables.sql"
  "03_iloc_rate_tables.sql"
  "04_uloc_rate_tables.sql"
  "05_workflow_table.sql"
  "06_foreign_keys.sql"
  "07_indexes.sql"
  "08_seed_data.sql"
)

STEP=2
for script in "${SCRIPTS[@]}"; do
  echo "[${STEP}/9] Running ${script}..."
  docker exec -i plra-sqlserver /opt/mssql-tools18/bin/sqlcmd \
    -S localhost -U sa -P "${SA_PASSWORD}" -C \
    -d "${DB_NAME}" < "${SCRIPT_DIR}/${script}"
  STEP=$((STEP + 1))
done

# Step 9: Verify
echo "[9/9] Verifying installation..."
docker exec plra-sqlserver /opt/mssql-tools18/bin/sqlcmd \
  -S localhost -U sa -P "${SA_PASSWORD}" -C \
  -d "${DB_NAME}" \
  -Q "SELECT COUNT(*) AS TableCount FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'RATEMGMT' AND TABLE_TYPE = 'BASE TABLE'"

echo ""
echo "========================================"
echo " Database Ready!"
echo "========================================"
echo ""
echo " Connection details:"
echo "   Server:   localhost,1433"
echo "   Database: ${DB_NAME}"
echo "   User:     sa"
echo "   Password: ${SA_PASSWORD}"
echo ""
echo " JDBC URL:"
echo "   jdbc:sqlserver://localhost:1433;database=${DB_NAME};encrypt=false;trustServerCertificate=true"
echo ""
echo " Spring Boot profile for Docker SQL Server:"
echo "   --spring.profiles.active=docker"
echo ""
