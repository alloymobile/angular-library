# =============================================================================
# PLRA Infrastructure — Input Variables
# =============================================================================

# --- General ---
variable "project" {
  description = "Project name prefix for all resources"
  type        = string
  default     = "plra"
}

variable "environment" {
  description = "Environment name (dev, uat, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "uat", "prod"], var.environment)
    error_message = "Environment must be dev, uat, or prod."
  }
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "canadacentral"
}

variable "tags" {
  description = "Common tags applied to all resources"
  type        = map(string)
  default     = {}
}

# --- App Service ---
variable "app_service_sku" {
  description = "App Service Plan SKU (e.g., B1, S1, P1v3)"
  type        = string
  default     = "B1"
}

variable "java_version" {
  description = "Java version for App Service runtime"
  type        = string
  default     = "17"
}

variable "app_always_on" {
  description = "Keep the app always loaded (requires Standard+ tier)"
  type        = bool
  default     = false
}

# --- SQL Database ---
variable "sql_admin_username" {
  description = "SQL Server administrator username"
  type        = string
  default     = "plra_admin"
  sensitive   = true
}

variable "sql_admin_password" {
  description = "SQL Server administrator password (use Vault in production)"
  type        = string
  sensitive   = true
}

variable "sql_sku" {
  description = "Azure SQL Database SKU (e.g., S0, S1, GP_Gen5_2)"
  type        = string
  default     = "S0"
}

variable "sql_max_size_gb" {
  description = "Maximum database size in GB"
  type        = number
  default     = 2
}

# --- Key Vault ---
variable "key_vault_sku" {
  description = "Key Vault SKU (standard or premium)"
  type        = string
  default     = "standard"
}

# --- PingFederate ---
variable "pingfed_jwks_uri" {
  description = "PingFederate JWKS endpoint URL"
  type        = string
  default     = "https://sso.td.com/pf/JWKS"
}

variable "pingfed_issuer_uri" {
  description = "PingFederate token issuer URI"
  type        = string
  default     = "https://sso.td.com"
}

# --- Networking ---
variable "vnet_address_space" {
  description = "Virtual network address space"
  type        = string
  default     = "10.0.0.0/16"
}

variable "allowed_ip_ranges" {
  description = "IP ranges allowed to access the SQL Server (CIDR notation)"
  type        = list(string)
  default     = []
}
