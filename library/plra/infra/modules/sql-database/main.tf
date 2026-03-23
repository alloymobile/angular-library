# =============================================================================
# Module: SQL Database — Azure SQL Server + Database
# =============================================================================

variable "name_prefix" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "admin_username" { type = string }
variable "admin_password" { type = string }
variable "sku" { type = string }
variable "max_size_gb" { type = number }
variable "subnet_id" { type = string }
variable "allowed_ip_ranges" { type = list(string) }
variable "tags" { type = map(string) }

# --- SQL Server ---
resource "azurerm_mssql_server" "main" {
  name                         = "${var.name_prefix}-sqlsrv"
  location                     = var.location
  resource_group_name          = var.resource_group_name
  version                      = "12.0"
  administrator_login          = var.admin_username
  administrator_login_password = var.admin_password
  minimum_tls_version          = "1.2"
  tags                         = var.tags

  azuread_administrator {
    login_username = "plra-sql-admins"
    object_id      = data.azurerm_client_config.current.object_id
  }
}

data "azurerm_client_config" "current" {}

# --- SQL Database ---
resource "azurerm_mssql_database" "main" {
  name      = "${var.name_prefix}-db"
  server_id = azurerm_mssql_server.main.id
  sku_name  = var.sku
  max_size_gb = var.max_size_gb
  tags      = var.tags

  # Short-term backup retention
  short_term_retention_policy {
    retention_days = 7
  }

  # Enable threat detection
  threat_detection_policy {
    state = "Enabled"
  }
}

# --- Firewall: Allow Azure Services ---
resource "azurerm_mssql_firewall_rule" "allow_azure" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# --- Firewall: Allow specific IP ranges (dev/office) ---
resource "azurerm_mssql_firewall_rule" "allowed_ips" {
  count            = length(var.allowed_ip_ranges)
  name             = "AllowedIP-${count.index}"
  server_id        = azurerm_mssql_server.main.id
  start_ip_address = cidrhost(var.allowed_ip_ranges[count.index], 0)
  end_ip_address   = cidrhost(var.allowed_ip_ranges[count.index], -1)
}

# --- Private Endpoint for VNet access ---
resource "azurerm_private_endpoint" "sql" {
  name                = "${var.name_prefix}-sql-pe"
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = var.subnet_id
  tags                = var.tags

  private_service_connection {
    name                           = "${var.name_prefix}-sql-psc"
    private_connection_resource_id = azurerm_mssql_server.main.id
    is_manual_connection           = false
    subresource_names              = ["sqlServer"]
  }
}

# --- Outputs ---
output "server_fqdn" {
  value = azurerm_mssql_server.main.fully_qualified_domain_name
}

output "database_name" {
  value = azurerm_mssql_database.main.name
}

output "server_id" {
  value = azurerm_mssql_server.main.id
}

output "connection_string" {
  value     = "jdbc:sqlserver://${azurerm_mssql_server.main.fully_qualified_domain_name}:1433;database=${azurerm_mssql_database.main.name};encrypt=true;trustServerCertificate=false;loginTimeout=30"
  sensitive = true
}
