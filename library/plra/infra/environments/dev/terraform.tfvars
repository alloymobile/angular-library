# =============================================================================
# PLRA — Dev Environment Variables
# =============================================================================

environment = "dev"
location    = "canadacentral"

tags = {
  CostCenter = "PLRA-DEV"
  Owner      = "plra-engineering"
}

# App Service — Basic tier for dev (cost-effective)
app_service_sku = "B1"
java_version    = "17"
app_always_on   = false

# SQL Database — Standard S0 for dev
sql_admin_username = "plra_admin"
# sql_admin_password = set via TF_VAR_sql_admin_password or Vault
sql_sku        = "S0"
sql_max_size_gb = 2

# Key Vault
key_vault_sku = "standard"

# Networking
vnet_address_space = "10.1.0.0/16"
allowed_ip_ranges  = [
  # Add developer office IPs here
  # "203.0.113.0/24",
]

# PingFederate (dev/mock endpoints)
pingfed_jwks_uri   = "http://localhost:9000/.well-known/jwks.json"
pingfed_issuer_uri = "http://localhost:9000"
