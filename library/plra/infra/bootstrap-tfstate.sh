#!/usr/bin/env bash
# =============================================================================
# PLRA — Terraform State Bootstrap Script
# =============================================================================
#
# Run this ONCE before your first `terraform init`.
# Creates the Azure Storage Account for remote state with locking.
#
# Prerequisites:
#   - Azure CLI installed and logged in (az login)
#   - Subscription access
#
# Usage:
#   chmod +x bootstrap-tfstate.sh
#   ./bootstrap-tfstate.sh
#
# =============================================================================

set -euo pipefail

RESOURCE_GROUP="plra-tfstate-rg"
LOCATION="canadacentral"
STORAGE_ACCOUNT="plratfstate"
CONTAINER="tfstate"

echo "========================================"
echo " PLRA — Terraform State Bootstrap"
echo "========================================"

# Step 1: Resource Group
echo ""
echo "[1/3] Creating Resource Group: ${RESOURCE_GROUP}"
az group create \
  --name "${RESOURCE_GROUP}" \
  --location "${LOCATION}" \
  --tags Project=plra Purpose=terraform-state \
  --output none

# Step 2: Storage Account (LRS is sufficient for state files)
echo "[2/3] Creating Storage Account: ${STORAGE_ACCOUNT}"
az storage account create \
  --name "${STORAGE_ACCOUNT}" \
  --resource-group "${RESOURCE_GROUP}" \
  --location "${LOCATION}" \
  --sku Standard_LRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false \
  --tags Project=plra Purpose=terraform-state \
  --output none

# Step 3: Blob Container
echo "[3/3] Creating Container: ${CONTAINER}"
az storage container create \
  --name "${CONTAINER}" \
  --account-name "${STORAGE_ACCOUNT}" \
  --auth-mode login \
  --output none

echo ""
echo "========================================"
echo " Bootstrap Complete!"
echo "========================================"
echo ""
echo " State backend configuration:"
echo "   resource_group_name  = \"${RESOURCE_GROUP}\""
echo "   storage_account_name = \"${STORAGE_ACCOUNT}\""
echo "   container_name       = \"${CONTAINER}\""
echo ""
echo " Next steps:"
echo "   cd infra/"
echo "   terraform init -backend-config=\"environments/dev/backend.tfvars\""
echo "   terraform plan -var-file=\"environments/dev/terraform.tfvars\""
echo ""
