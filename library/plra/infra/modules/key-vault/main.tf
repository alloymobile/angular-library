# =============================================================================
# Module: Key Vault — Secrets Management
# =============================================================================
#
# Stores database credentials, PingFederate endpoints, and API keys.
# Phase 7 will add HashiCorp Vault bridge integration.
#
# =============================================================================

variable "name_prefix" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "sku" { type = string }
variable "tags" { type = map(string) }
variable "secrets" {
  type      = map(string)
  sensitive = true
  default   = {}
}

data "azurerm_client_config" "current" {}

# --- Key Vault ---
resource "azurerm_key_vault" "main" {
  name                        = "${var.name_prefix}-kv"
  location                    = var.location
  resource_group_name         = var.resource_group_name
  sku_name                    = var.sku
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false  # Set true for prod
  enable_rbac_authorization   = false
  tags                        = var.tags

  # Access policy for Terraform service principal
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get", "List", "Set", "Delete", "Purge", "Recover"
    ]

    key_permissions = [
      "Get", "List", "Create"
    ]
  }
}

# --- Store secrets ---
resource "azurerm_key_vault_secret" "secrets" {
  for_each     = var.secrets
  name         = each.key
  value        = each.value
  key_vault_id = azurerm_key_vault.main.id
  tags         = var.tags

  depends_on = [azurerm_key_vault.main]
}

# --- Outputs ---
output "vault_id" {
  value = azurerm_key_vault.main.id
}

output "vault_uri" {
  value = azurerm_key_vault.main.vault_uri
}

output "vault_name" {
  value = azurerm_key_vault.main.name
}
