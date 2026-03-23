# =============================================================================
# PLRA — UAT Environment Variables
# =============================================================================

environment = "uat"
location    = "canadacentral"

tags = {
  CostCenter = "PLRA-UAT"
  Owner      = "plra-engineering"
}

# App Service — Standard tier for UAT (always-on enabled)
app_service_sku = "S1"
java_version    = "17"
app_always_on   = true

# SQL Database — Standard S1 for UAT
sql_admin_username = "plra_admin"
sql_sku        = "S1"
sql_max_size_gb = 5

# Key Vault
key_vault_sku = "standard"

# Networking
vnet_address_space = "10.2.0.0/16"
allowed_ip_ranges  = []

# PingFederate (UAT SSO)
pingfed_jwks_uri   = "https://sso-uat.td.com/pf/JWKS"
pingfed_issuer_uri = "https://sso-uat.td.com"
