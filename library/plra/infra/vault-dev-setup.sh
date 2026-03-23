#!/usr/bin/env bash
# =============================================================================
# PLRA — HashiCorp Vault Local Development Setup
# =============================================================================
#
# Starts a Vault dev server and seeds it with PLRA secrets.
# For LOCAL DEVELOPMENT ONLY — production uses enterprise Vault.
#
# Prerequisites:
#   - Docker installed (uses Vault container)
#   OR
#   - vault CLI installed (https://developer.hashicorp.com/vault/install)
#
# Usage:
#   chmod +x vault-dev-setup.sh
#   ./vault-dev-setup.sh
#
# =============================================================================

set -euo pipefail

VAULT_DEV_TOKEN="plra-dev-token"
VAULT_PORT="8200"

echo "========================================"
echo " PLRA — Vault Dev Server Setup"
echo "========================================"

# Check if Vault is already running
if curl -s "http://localhost:${VAULT_PORT}/v1/sys/health" > /dev/null 2>&1; then
    echo "Vault is already running at http://localhost:${VAULT_PORT}"
else
    echo "[1/3] Starting Vault dev server..."
    
    # Try Docker first, fall back to vault CLI
    if command -v docker &> /dev/null; then
        docker run -d \
            --name plra-vault \
            --cap-add=IPC_LOCK \
            -p ${VAULT_PORT}:8200 \
            -e "VAULT_DEV_ROOT_TOKEN_ID=${VAULT_DEV_TOKEN}" \
            -e "VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200" \
            hashicorp/vault:latest \
            server -dev
        echo "  Vault container started (Docker)"
    elif command -v vault &> /dev/null; then
        vault server -dev \
            -dev-root-token-id="${VAULT_DEV_TOKEN}" \
            -dev-listen-address="0.0.0.0:${VAULT_PORT}" &
        echo "  Vault dev server started (CLI)"
    else
        echo "ERROR: Neither Docker nor vault CLI found."
        echo "Install Docker: https://docs.docker.com/get-docker/"
        echo "Install Vault: https://developer.hashicorp.com/vault/install"
        exit 1
    fi
    
    # Wait for Vault to be ready
    echo "  Waiting for Vault to start..."
    sleep 3
fi

# Configure environment
export VAULT_ADDR="http://localhost:${VAULT_PORT}"
export VAULT_TOKEN="${VAULT_DEV_TOKEN}"

echo "[2/3] Seeding dev secrets..."

# Dev environment secrets
vault kv put secret/plra/dev \
    azure-sql-url="jdbc:h2:mem:plra;DB_CLOSE_DELAY=-1;MODE=MSSQLServer;INIT=CREATE SCHEMA IF NOT EXISTS RATEMGMT" \
    azure-sql-username="sa" \
    azure-sql-password="" \
    pingfed-jwks-uri="http://localhost:9000/.well-known/jwks.json" \
    pingfed-issuer-uri="http://localhost:9000" \
    app-insights-key="" 2>/dev/null || \
    echo "  (vault CLI not in PATH — skipping seed, use UI at http://localhost:${VAULT_PORT})"

# UAT environment secrets (placeholder)
vault kv put secret/plra/uat \
    azure-sql-url="jdbc:sqlserver://plra-uat.database.windows.net:1433;database=plra-uat-db" \
    azure-sql-username="plra_admin" \
    azure-sql-password="CHANGE_ME_IN_VAULT_UI" \
    pingfed-jwks-uri="https://sso-uat.td.com/pf/JWKS" \
    pingfed-issuer-uri="https://sso-uat.td.com" \
    app-insights-key="" 2>/dev/null || true

echo "[3/3] Verifying..."
vault kv get secret/plra/dev 2>/dev/null || echo "  Use Vault UI to verify"

echo ""
echo "========================================"
echo " Vault Dev Server Ready!"
echo "========================================"
echo ""
echo " Vault UI:  http://localhost:${VAULT_PORT}"
echo " Token:     ${VAULT_DEV_TOKEN}"
echo ""
echo " To use with Spring Boot:"
echo "   export VAULT_ADDR=http://localhost:${VAULT_PORT}"
echo "   export VAULT_TOKEN=${VAULT_DEV_TOKEN}"
echo "   export VAULT_ENABLED=true"
echo "   mvn spring-boot:run -pl plra-api"
echo ""
echo " Or set in application args:"
echo "   --spring.cloud.vault.enabled=true"
echo "   --spring.cloud.vault.token=${VAULT_DEV_TOKEN}"
echo ""
