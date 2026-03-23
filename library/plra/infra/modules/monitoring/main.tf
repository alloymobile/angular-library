# =============================================================================
# Module: Monitoring — Application Insights + Log Analytics
# =============================================================================

variable "name_prefix" { type = string }
variable "location" { type = string }
variable "resource_group_name" { type = string }
variable "tags" { type = map(string) }

# --- Log Analytics Workspace ---
resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.name_prefix}-law"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = var.tags
}

# --- Application Insights ---
resource "azurerm_application_insights" "main" {
  name                = "${var.name_prefix}-ai"
  location            = var.location
  resource_group_name = var.resource_group_name
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "java"
  tags                = var.tags
}

# --- Alert: High Error Rate (>5% of requests in 5 min) ---
resource "azurerm_monitor_metric_alert" "error_rate" {
  name                = "${var.name_prefix}-high-error-rate"
  resource_group_name = var.resource_group_name
  scopes              = [azurerm_application_insights.main.id]
  description         = "Alert when server error rate exceeds 5% in 5 minutes"
  severity            = 2
  frequency           = "PT5M"
  window_size         = "PT5M"
  tags                = var.tags

  criteria {
    metric_namespace = "microsoft.insights/components"
    metric_name      = "requests/failed"
    aggregation      = "Count"
    operator         = "GreaterThan"
    threshold        = 10
  }
}

# --- Alert: High Response Time (>2s average in 5 min) ---
resource "azurerm_monitor_metric_alert" "slow_response" {
  name                = "${var.name_prefix}-slow-response"
  resource_group_name = var.resource_group_name
  scopes              = [azurerm_application_insights.main.id]
  description         = "Alert when average response time exceeds 2 seconds"
  severity            = 3
  frequency           = "PT5M"
  window_size         = "PT5M"
  tags                = var.tags

  criteria {
    metric_namespace = "microsoft.insights/components"
    metric_name      = "requests/duration"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 2000  # milliseconds
  }
}

# --- Outputs ---
output "app_insights_instrumentation_key" {
  value     = azurerm_application_insights.main.instrumentation_key
  sensitive = true
}

output "app_insights_connection_string" {
  value     = azurerm_application_insights.main.connection_string
  sensitive = true
}

output "app_insights_id" {
  value = azurerm_application_insights.main.id
}

output "log_analytics_workspace_id" {
  value = azurerm_log_analytics_workspace.main.id
}
