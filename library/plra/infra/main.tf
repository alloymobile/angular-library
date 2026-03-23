# =============================================================================
# PLRA Infrastructure — Main Orchestration
# =============================================================================
#
# Architecture:
#
#   ┌─────────────────────────────────────────────────────────┐
#   │  Azure Resource Group: plra-{env}-rg                    │
#   │                                                         │
#   │  ┌─────────────┐    ┌──────────────┐   ┌────────────┐  │
#   │  │ App Service  │───▶│ Azure SQL DB │   │ Key Vault  │  │
#   │  │ (Java 17)   │    │ (RATEMGMT)   │   │ (secrets)  │  │
#   │  │ + Angular   │    └──────────────┘   └────────────┘  │
#   │  └──────┬──────┘                                        │
#   │         │           ┌──────────────┐                    │
#   │         └──────────▶│ App Insights │                    │
#   │                     │ (monitoring) │                    │
#   │                     └──────────────┘                    │
#   └─────────────────────────────────────────────────────────┘
#
# =============================================================================

locals {
  name_prefix = "${var.project}-${var.environment}"

  common_tags = merge(var.tags, {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
    Team        = "PLRA Engineering"
  })
}

# =============================================================================
# RESOURCE GROUP
# =============================================================================
resource "azurerm_resource_group" "main" {
  name     = "${local.name_prefix}-rg"
  location = var.location
  tags     = local.common_tags
}

# =============================================================================
# NETWORKING — VNet, Subnets, NSGs
# =============================================================================
module "networking" {
  source = "./modules/networking"

  name_prefix        = local.name_prefix
  location           = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  vnet_address_space = var.vnet_address_space
  tags               = local.common_tags
}

# =============================================================================
# SQL DATABASE — Azure SQL Server + Database
# =============================================================================
module "sql_database" {
  source = "./modules/sql-database"

  name_prefix         = local.name_prefix
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  admin_username      = var.sql_admin_username
  admin_password      = var.sql_admin_password
  sku                 = var.sql_sku
  max_size_gb         = var.sql_max_size_gb
  subnet_id           = module.networking.sql_subnet_id
  allowed_ip_ranges   = var.allowed_ip_ranges
  tags                = local.common_tags
}

# =============================================================================
# KEY VAULT — Secrets management
# =============================================================================
module "key_vault" {
  source = "./modules/key-vault"

  name_prefix         = local.name_prefix
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = var.key_vault_sku
  tags                = local.common_tags

  # Store database connection details as secrets
  secrets = {
    "azure-sql-url"       = module.sql_database.connection_string
    "azure-sql-username"  = var.sql_admin_username
    "azure-sql-password"  = var.sql_admin_password
    "pingfed-jwks-uri"    = var.pingfed_jwks_uri
    "pingfed-issuer-uri"  = var.pingfed_issuer_uri
  }
}

# =============================================================================
# MONITORING — Application Insights + Log Analytics
# =============================================================================
module "monitoring" {
  source = "./modules/monitoring"

  name_prefix         = local.name_prefix
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tags                = local.common_tags
}

# =============================================================================
# APP SERVICE — Java 17 Spring Boot + Angular SPA
# =============================================================================
module "app_service" {
  source = "./modules/app-service"

  name_prefix         = local.name_prefix
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = var.app_service_sku
  java_version        = var.java_version
  always_on           = var.app_always_on
  subnet_id           = module.networking.app_subnet_id
  tags                = local.common_tags

  # Application settings (environment variables for Spring Boot)
  app_settings = {
    "SPRING_PROFILES_ACTIVE"           = "azure"
    "AZURE_SQL_URL"                    = module.sql_database.connection_string
    "AZURE_SQL_USERNAME"               = var.sql_admin_username
    "AZURE_SQL_PASSWORD"               = var.sql_admin_password
    "PINGFED_JWKS_URI"                 = var.pingfed_jwks_uri
    "PINGFED_ISSUER_URI"               = var.pingfed_issuer_uri
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = module.monitoring.app_insights_connection_string
    "JAVA_OPTS"                        = "-Xms256m -Xmx512m"
  }

  # Key Vault reference for secrets (Phase 7 enhancement)
  key_vault_id = module.key_vault.vault_id

  # Application Insights
  app_insights_instrumentation_key = module.monitoring.app_insights_instrumentation_key
  app_insights_connection_string   = module.monitoring.app_insights_connection_string
}
