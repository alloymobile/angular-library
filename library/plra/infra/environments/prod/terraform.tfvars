# =============================================================================
# PLRA — Production Environment Variables
# =============================================================================

environment = "prod"
location    = "canadacentral"

tags = {
  CostCenter  = "PLRA-PROD"
  Owner       = "plra-engineering"
  Compliance  = "PCI-internal"
}

# App Service — Premium tier for production
app_service_sku = "P1v3"
java_version    = "17"
app_always_on   = true

# SQL Database — General Purpose for production
sql_admin_username = "plra_admin"
sql_sku        = "GP_Gen5_2"
sql_max_size_gb = 32

# Key Vault — standard (premium adds HSM-backed keys if needed)
key_vault_sku = "standard"

# Networking
vnet_address_space = "10.3.0.0/16"
allowed_ip_ranges  = []

# PingFederate (Production SSO)
pingfed_jwks_uri   = "https://sso.td.com/pf/JWKS"
pingfed_issuer_uri = "https://sso.td.com"
