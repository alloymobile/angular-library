# PLRA — Azure SQL Quick Reference Card

> Keep this open while working. Copy-paste commands as needed.

## Your Environment Details (fill in after setup)

```
Server FQDN:      ________________________________.database.windows.net
Database Name:     ________________________________
Admin Username:    plra_admin
Admin Password:    (stored securely, not here)
Your IP Address:   run: curl https://api.ipify.org
```

## Most-Used Commands

### Check Current IP (for firewall updates)
```bash
curl https://api.ipify.org
```

### Update Firewall When IP Changes
```bash
az sql server firewall-rule update \
  --name "AllowMyIP" \
  --resource-group plra-dev-rg \
  --server plra-dev-sqlsrv \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

### Run Spring Boot Against Azure SQL
```bash
# Set these ONCE per terminal session
export SPRING_PROFILES_ACTIVE=azure
export AZURE_SQL_URL="jdbc:sqlserver://plra-dev-sqlsrv.database.windows.net:1433;database=plra-dev-db;encrypt=true;trustServerCertificate=false;loginTimeout=30"
export AZURE_SQL_USERNAME="plra_admin"
export AZURE_SQL_PASSWORD="YOUR_PASSWORD"

# Then run
cd plra-api && mvn spring-boot:run
```

### Run Spring Boot Against Local H2 (no Azure needed)
```bash
cd plra-api && mvn spring-boot:run
# Automatically uses H2 in-memory (default profile)
```

### Check What Resources Exist
```bash
# List everything in the resource group
az resource list --resource-group plra-dev-rg --output table

# Check SQL Server status
az sql server show --name plra-dev-sqlsrv --resource-group plra-dev-rg --output table

# Check database status
az sql db show --name plra-dev-db --server plra-dev-sqlsrv --resource-group plra-dev-rg --output table

# Check firewall rules
az sql server firewall-rule list --server plra-dev-sqlsrv --resource-group plra-dev-rg --output table
```

### Check Costs
```bash
# View cost so far this month
az consumption usage list --output table 2>/dev/null || echo "Use Azure Portal → Cost Management"
```

### Scale Database Up/Down
```bash
# Downgrade to Basic (cheapest, ~$5/mo)
az sql db update --name plra-dev-db --server plra-dev-sqlsrv \
  --resource-group plra-dev-rg --service-objective Basic

# Upgrade to S0 (better performance, ~$15/mo)
az sql db update --name plra-dev-db --server plra-dev-sqlsrv \
  --resource-group plra-dev-rg --service-objective S0
```

### Pause Database (stop paying when not using)
```bash
# Azure SQL Serverless can auto-pause — but only for GP_S_Gen5 SKUs
# For Basic/Standard, just delete and recreate when needed
# Or scale to Basic ($5/mo) as the minimum
```

### Emergency: Delete EVERYTHING
```bash
az group delete --name plra-dev-rg --yes --no-wait
# This deletes the resource group and ALL resources inside it
# Cannot be undone!
```

### Re-run Migration Scripts (if you need to reset the database)
```bash
# Option 1: Drop and recreate (fastest)
sqlcmd -S plra-dev-sqlsrv.database.windows.net -d plra-dev-db \
  -U plra_admin -P "YOUR_PASSWORD" -N -C \
  -i db/sqlserver/99_ROLLBACK_DROP_ALL.sql

# Then run all scripts again:
for s in 01 02 03 04 05 06 07 08; do
  sqlcmd -S plra-dev-sqlsrv.database.windows.net -d plra-dev-db \
    -U plra_admin -P "YOUR_PASSWORD" -N -C \
    -i "db/sqlserver/${s}_*.sql"
done

# Option 2: Drop and recreate the entire database
az sql db delete --name plra-dev-db --server plra-dev-sqlsrv \
  --resource-group plra-dev-rg --yes
az sql db create --name plra-dev-db --server plra-dev-sqlsrv \
  --resource-group plra-dev-rg --service-objective S0 --max-size 2GB \
  --backup-storage-redundancy Local
# Then run migration scripts again
```

## Azure Portal Shortcuts

| What | URL |
|------|-----|
| Portal Home | https://portal.azure.com |
| Your Resource Group | portal.azure.com → search "plra-dev-rg" |
| SQL Database | portal.azure.com → search "plra-dev-db" |
| Cost Management | portal.azure.com → search "Cost Management" |
| Firewall Rules | SQL Server → Networking → Firewall rules |
| Query Editor | SQL Database → Query editor (preview) |

## Status Codes When Things Go Wrong

| Error | Meaning | Fix |
|-------|---------|-----|
| "not allowed to access" | IP not in firewall | Update firewall rule |
| "Login failed" | Wrong password | Reset password with `az sql server update` |
| "Cannot open database" | DB doesn't exist | Create it or check the name |
| "resource not found" | Wrong name or not created yet | Check `az resource list` |
| "quota exceeded" | Free trial limit hit | Delete unused resources |
