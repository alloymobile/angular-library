#!/usr/bin/env bash
# =============================================================================
# PLRA — Azure SQL Server Automated Setup
# =============================================================================
#
# This script automates Steps 4–9 of the Azure Setup Guide.
# It creates the Resource Group, SQL Server, Database, Firewall Rules,
# and runs all migration scripts.
#
# Prerequisites:
#   - Azure CLI installed (az --version)
#   - Logged in (az login)
#   - sqlcmd installed (optional — falls back to az sql query)
#
# Usage:
#   chmod +x setup-azure-sql.sh
#   ./setup-azure-sql.sh              # Uses defaults (dev environment)
#   ./setup-azure-sql.sh uat          # UAT environment
#   ./setup-azure-sql.sh prod         # Production environment
#
# =============================================================================

set -euo pipefail

# ─────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────
ENV="${1:-dev}"
PROJECT="plra"

RESOURCE_GROUP="${PROJECT}-${ENV}-rg"
LOCATION="canadacentral"
SQL_SERVER_NAME="${PROJECT}-${ENV}-sqlsrv"
DATABASE_NAME="${PROJECT}-${ENV}-db"
ADMIN_USER="plra_admin"

# Script directory (where SQL files are)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)/db/sqlserver"

# SKU per environment
case "$ENV" in
  dev)  SKU="S0"; MAX_SIZE="2"; ;;
  uat)  SKU="S1"; MAX_SIZE="5"; ;;
  prod) SKU="GP_Gen5_2"; MAX_SIZE="32"; ;;
  *)    echo "ERROR: Unknown environment '$ENV'. Use: dev, uat, or prod."; exit 1; ;;
esac

# ─────────────────────────────────────────────
# PASSWORD
# ─────────────────────────────────────────────
if [ -z "${ADMIN_PASSWORD:-}" ]; then
  echo ""
  echo "Enter the SQL admin password for '${ADMIN_USER}':"
  echo "(Requirements: 8+ chars, uppercase + lowercase + number + special char)"
  read -s -p "Password: " ADMIN_PASSWORD
  echo ""
  read -s -p "Confirm:  " ADMIN_PASSWORD_CONFIRM
  echo ""
  
  if [ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]; then
    echo "ERROR: Passwords do not match."
    exit 1
  fi
fi

# ─────────────────────────────────────────────
# DISPLAY PLAN
# ─────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  PLRA — Azure SQL Setup                             ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Environment:    ${ENV}"
echo "║  Resource Group: ${RESOURCE_GROUP}"
echo "║  Location:       ${LOCATION}"
echo "║  SQL Server:     ${SQL_SERVER_NAME}.database.windows.net"
echo "║  Database:       ${DATABASE_NAME}"
echo "║  SKU:            ${SKU} (max ${MAX_SIZE}GB)"
echo "║  Admin User:     ${ADMIN_USER}"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
read -p "Proceed? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Cancelled."
  exit 0
fi

# ─────────────────────────────────────────────
# STEP 1: Verify Azure Login
# ─────────────────────────────────────────────
echo ""
echo "━━━ [1/8] Verifying Azure login... ━━━"
ACCOUNT=$(az account show --query name -o tsv 2>/dev/null || true)
if [ -z "$ACCOUNT" ]; then
  echo "ERROR: Not logged in. Run 'az login' first."
  exit 1
fi
echo "  ✓ Logged in as: $ACCOUNT"

# Register SQL provider (in case it's not registered)
echo "  Registering Microsoft.Sql provider..."
az provider register --namespace Microsoft.Sql --wait 2>/dev/null || true

# ─────────────────────────────────────────────
# STEP 2: Create Resource Group
# ─────────────────────────────────────────────
echo ""
echo "━━━ [2/8] Creating Resource Group: ${RESOURCE_GROUP} ━━━"
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --tags Project=PLRA Environment="$ENV" ManagedBy=script \
  --output none
echo "  ✓ Resource Group created"

# ─────────────────────────────────────────────
# STEP 3: Create SQL Server
# ─────────────────────────────────────────────
echo ""
echo "━━━ [3/8] Creating SQL Server: ${SQL_SERVER_NAME} ━━━"
echo "  (This takes 1-2 minutes...)"
az sql server create \
  --name "$SQL_SERVER_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --admin-user "$ADMIN_USER" \
  --admin-password "$ADMIN_PASSWORD" \
  --minimal-tls-version 1.2 \
  --output none
echo "  ✓ SQL Server created: ${SQL_SERVER_NAME}.database.windows.net"

# ─────────────────────────────────────────────
# STEP 4: Configure Firewall
# ─────────────────────────────────────────────
echo ""
echo "━━━ [4/8] Configuring firewall rules ━━━"

# Allow Azure Services
az sql server firewall-rule create \
  --name "AllowAzureServices" \
  --resource-group "$RESOURCE_GROUP" \
  --server "$SQL_SERVER_NAME" \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0 \
  --output none
echo "  ✓ Azure Services allowed"

# Allow current IP
MY_IP=$(curl -s https://api.ipify.org 2>/dev/null || echo "")
if [ -n "$MY_IP" ]; then
  az sql server firewall-rule create \
    --name "AllowMyIP-$(date +%Y%m%d)" \
    --resource-group "$RESOURCE_GROUP" \
    --server "$SQL_SERVER_NAME" \
    --start-ip-address "$MY_IP" \
    --end-ip-address "$MY_IP" \
    --output none
  echo "  ✓ Your IP allowed: ${MY_IP}"
else
  echo "  ⚠ Could not detect your IP. Add it manually in Azure Portal."
fi

# ─────────────────────────────────────────────
# STEP 5: Create Database
# ─────────────────────────────────────────────
echo ""
echo "━━━ [5/8] Creating Database: ${DATABASE_NAME} (SKU: ${SKU}) ━━━"
az sql db create \
  --name "$DATABASE_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --server "$SQL_SERVER_NAME" \
  --service-objective "$SKU" \
  --max-size "${MAX_SIZE}GB" \
  --backup-storage-redundancy Local \
  --output none
echo "  ✓ Database created"

# ─────────────────────────────────────────────
# STEP 6: Run Migration Scripts
# ─────────────────────────────────────────────
echo ""
echo "━━━ [6/8] Running migration scripts ━━━"

FQDN="${SQL_SERVER_NAME}.database.windows.net"

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

# Check if sqlcmd is available
if command -v sqlcmd &> /dev/null; then
  for script in "${SCRIPTS[@]}"; do
    echo "  Running ${script}..."
    sqlcmd -S "$FQDN" -d "$DATABASE_NAME" -U "$ADMIN_USER" -P "$ADMIN_PASSWORD" \
           -i "${SCRIPT_DIR}/${script}" -N -C -b
  done
else
  echo "  ⚠ sqlcmd not found. Trying az sql query fallback..."
  echo ""
  echo "  The 'az sql' query method has limitations with GO batches."
  echo "  For best results, install sqlcmd or use Azure Data Studio."
  echo ""
  echo "  To install sqlcmd:"
  echo "    macOS:   brew install mssql-tools18"
  echo "    Ubuntu:  curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -"
  echo "             sudo apt-get install mssql-tools18"
  echo "    Windows: Download from https://aka.ms/sqlcmd"
  echo ""
  echo "  Then re-run this script, OR run scripts manually in Azure Data Studio."
  echo ""
  echo "  Skipping migration scripts for now."
  SCRIPTS=()
fi

if [ ${#SCRIPTS[@]} -gt 0 ]; then
  echo "  ✓ All 8 migration scripts completed"
fi

# ─────────────────────────────────────────────
# STEP 7: Verify
# ─────────────────────────────────────────────
echo ""
echo "━━━ [7/8] Verifying installation ━━━"

if command -v sqlcmd &> /dev/null; then
  TABLE_COUNT=$(sqlcmd -S "$FQDN" -d "$DATABASE_NAME" -U "$ADMIN_USER" -P "$ADMIN_PASSWORD" \
    -N -C -h -1 -Q "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='RATEMGMT' AND TABLE_TYPE='BASE TABLE'" 2>/dev/null | tr -d '[:space:]')
  echo "  Tables:     ${TABLE_COUNT} (expected: 12)"
  
  SEQ_COUNT=$(sqlcmd -S "$FQDN" -d "$DATABASE_NAME" -U "$ADMIN_USER" -P "$ADMIN_PASSWORD" \
    -N -C -h -1 -Q "SELECT COUNT(*) FROM sys.sequences WHERE schema_id=SCHEMA_ID('RATEMGMT')" 2>/dev/null | tr -d '[:space:]')
  echo "  Sequences:  ${SEQ_COUNT} (expected: 8)"
  
  FK_COUNT=$(sqlcmd -S "$FQDN" -d "$DATABASE_NAME" -U "$ADMIN_USER" -P "$ADMIN_PASSWORD" \
    -N -C -h -1 -Q "SELECT COUNT(*) FROM sys.foreign_keys fk JOIN sys.tables t ON fk.parent_object_id=t.object_id WHERE SCHEMA_NAME(t.schema_id)='RATEMGMT'" 2>/dev/null | tr -d '[:space:]')
  echo "  ForeignKeys: ${FK_COUNT} (expected: 20)"
else
  echo "  (Install sqlcmd to see verification counts)"
fi

# ─────────────────────────────────────────────
# STEP 8: Print Summary
# ─────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✓ SETUP COMPLETE                                   ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║"
echo "║  Server:    ${FQDN}"
echo "║  Database:  ${DATABASE_NAME}"
echo "║  User:      ${ADMIN_USER}"
echo "║  SKU:       ${SKU}"
echo "║"
echo "║  ── JDBC Connection String ──"
echo "║  jdbc:sqlserver://${FQDN}:1433;database=${DATABASE_NAME};encrypt=true;trustServerCertificate=false;loginTimeout=30"
echo "║"
echo "║  ── Spring Boot Environment Variables ──"
echo "║  export SPRING_PROFILES_ACTIVE=azure"
echo "║  export AZURE_SQL_URL=\"jdbc:sqlserver://${FQDN}:1433;database=${DATABASE_NAME};encrypt=true;trustServerCertificate=false;loginTimeout=30\""
echo "║  export AZURE_SQL_USERNAME=\"${ADMIN_USER}\""
echo "║  export AZURE_SQL_PASSWORD=\"<your-password>\""
echo "║"
echo "║  ── Azure Data Studio Connection ──"
echo "║  Server:   ${FQDN}"
echo "║  Auth:     SQL Login"
echo "║  User:     ${ADMIN_USER}"
echo "║  Database: ${DATABASE_NAME}"
echo "║"
echo "║  ── To Delete Everything ──"
echo "║  az group delete --name ${RESOURCE_GROUP} --yes"
echo "║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
