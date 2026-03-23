# =============================================================================
# PLRA Infrastructure — Outputs
# =============================================================================

output "resource_group_name" {
  description = "Name of the Azure Resource Group"
  value       = azurerm_resource_group.main.name
}

output "app_service_url" {
  description = "URL of the PLRA application"
  value       = module.app_service.app_url
}

output "app_service_hostname" {
  description = "Default hostname of the App Service"
  value       = module.app_service.default_hostname
}

output "sql_server_fqdn" {
  description = "Fully qualified domain name of the SQL Server"
  value       = module.sql_database.server_fqdn
}

output "sql_database_name" {
  description = "Name of the SQL Database"
  value       = module.sql_database.database_name
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = module.key_vault.vault_uri
}

output "app_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = module.monitoring.app_insights_instrumentation_key
  sensitive   = true
}

output "swagger_ui_url" {
  description = "Swagger UI URL for API documentation"
  value       = "${module.app_service.app_url}/plra/swagger-ui.html"
}
