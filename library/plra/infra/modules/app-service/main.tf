# =============================================================================
# Module: App Service — Java 17 Spring Boot + Angular SPA
# =============================================================================
#
# Architecture:
#   - Linux App Service Plan (Java 17 SE runtime)
#   - Web App with VNet integration for SQL Private Endpoint access
#   - Staging deployment slot for blue-green deployments
#   - Health check endpoint for load balancer probes
#   - HTTPS only with TLS 1.2 minimum
#
# =============================================================================

variable "name_prefix" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "sku" { type = string }
variable "java_version" { type = string }
variable "always_on" { type = bool }
variable "subnet_id" { type = string }
variable "tags" { type = map(string) }
variable "app_settings" { type = map(string) }
variable "key_vault_id" { type = string }
variable "app_insights_instrumentation_key" { type = string }
variable "app_insights_connection_string" { type = string }

# --- App Service Plan ---
resource "azurerm_service_plan" "main" {
  name                = "${var.name_prefix}-plan"
  location            = var.location
  resource_group_name = var.resource_group_name
  os_type             = "Linux"
  sku_name            = var.sku
  tags                = var.tags
}

# --- Web App ---
resource "azurerm_linux_web_app" "main" {
  name                = "${var.name_prefix}-app"
  location            = var.location
  resource_group_name = var.resource_group_name
  service_plan_id     = azurerm_service_plan.main.id
  https_only          = true
  tags                = var.tags

  # VNet Integration — allows access to SQL via Private Endpoint
  virtual_network_subnet_id = var.subnet_id

  site_config {
    always_on         = var.always_on
    minimum_tls_version = "1.2"
    http2_enabled     = true

    # Java 17 SE runtime (Spring Boot embedded Tomcat)
    application_stack {
      java_server         = "JAVA"
      java_server_version = "17"
      java_version        = "17"
    }

    # Health check — Azure probes this endpoint
    health_check_path = "/plra/actuator/health"

    # CORS for Angular dev server (redundant with Spring config, belt + suspenders)
    cors {
      allowed_origins = [
        "http://localhost:4200",
        "https://${var.name_prefix}-app.azurewebsites.net"
      ]
    }
  }

  # Application settings → Spring Boot environment variables
  app_settings = merge(var.app_settings, {
    "WEBSITE_RUN_FROM_PACKAGE"       = "1"
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = var.app_insights_connection_string
  })

  # Logging
  logs {
    application_logs {
      file_system_level = "Information"
    }
    http_logs {
      file_system {
        retention_in_days = 7
        retention_in_mb   = 35
      }
    }
  }

  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [
      # Ignore changes from manual deployments
      app_settings["WEBSITE_RUN_FROM_PACKAGE"],
    ]
  }
}

# --- Staging Deployment Slot (blue-green deployments) ---
resource "azurerm_linux_web_app_slot" "staging" {
  name           = "staging"
  app_service_id = azurerm_linux_web_app.main.id
  tags           = var.tags

  site_config {
    always_on         = false  # Save costs on staging
    minimum_tls_version = "1.2"

    application_stack {
      java_server         = "JAVA"
      java_server_version = "17"
      java_version        = "17"
    }

    health_check_path = "/plra/actuator/health"
  }

  app_settings = merge(var.app_settings, {
    "WEBSITE_RUN_FROM_PACKAGE" = "1"
    "SPRING_PROFILES_ACTIVE"   = "azure"
  })

  identity {
    type = "SystemAssigned"
  }
}

# --- Key Vault access for App Service managed identity ---
resource "azurerm_key_vault_access_policy" "app_service" {
  key_vault_id = var.key_vault_id
  tenant_id    = azurerm_linux_web_app.main.identity[0].tenant_id
  object_id    = azurerm_linux_web_app.main.identity[0].principal_id

  secret_permissions = ["Get", "List"]
}

# --- Key Vault access for staging slot ---
resource "azurerm_key_vault_access_policy" "staging" {
  key_vault_id = var.key_vault_id
  tenant_id    = azurerm_linux_web_app_slot.staging.identity[0].tenant_id
  object_id    = azurerm_linux_web_app_slot.staging.identity[0].principal_id

  secret_permissions = ["Get", "List"]
}

# --- Outputs ---
output "app_url" {
  value = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "default_hostname" {
  value = azurerm_linux_web_app.main.default_hostname
}

output "app_service_id" {
  value = azurerm_linux_web_app.main.id
}

output "staging_hostname" {
  value = azurerm_linux_web_app_slot.staging.default_hostname
}

output "app_identity_principal_id" {
  value = azurerm_linux_web_app.main.identity[0].principal_id
}
