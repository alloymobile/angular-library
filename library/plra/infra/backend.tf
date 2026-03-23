# =============================================================================
# PLRA Infrastructure — Remote State Backend
# =============================================================================
#
# State is stored in Azure Blob Storage with state locking via blob lease.
#
# PREREQUISITE: Create the storage account BEFORE running terraform init:
#
#   az group create -n plra-tfstate-rg -l canadacentral
#   az storage account create -n plratfstate -g plra-tfstate-rg -l canadacentral --sku Standard_LRS
#   az storage container create -n tfstate --account-name plratfstate
#
# Then initialize with:
#   cd infra/
#   terraform init -backend-config="environments/dev/backend.tfvars"
#
# =============================================================================

terraform {
  backend "azurerm" {
    # These values are overridden per-environment via backend.tfvars:
    #   resource_group_name  = "plra-tfstate-rg"
    #   storage_account_name = "plratfstate"
    #   container_name       = "tfstate"
    #   key                  = "plra-dev.tfstate"
  }
}
