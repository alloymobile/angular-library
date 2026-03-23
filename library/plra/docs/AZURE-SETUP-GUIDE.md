# PLRA — Azure Infrastructure Setup Guide (Beginner-Friendly)

> This guide walks you through setting up Azure from scratch.
> Every command is explained. Nothing is assumed.
> Estimated time: 45–60 minutes for first-time setup.

---

## TABLE OF CONTENTS

- [STEP 0: Prerequisites — What You Need Before Starting](#step-0)
- [STEP 1: Install Azure CLI](#step-1)
- [STEP 2: Login to Azure](#step-2)
- [STEP 3: Understand Azure Organization](#step-3)
- [STEP 4: Create a Resource Group](#step-4)
- [STEP 5: Create Azure SQL Server (the logical server)](#step-5)
- [STEP 6: Create the PLRA Database](#step-6)
- [STEP 7: Configure Firewall Rules](#step-7)
- [STEP 8: Connect and Verify (Azure Data Studio)](#step-8)
- [STEP 9: Run the Migration Scripts](#step-9)
- [STEP 10: Connect Spring Boot to Azure SQL](#step-10)
- [STEP 11: Verify End-to-End](#step-11)
- [COST BREAKDOWN: What This Will Cost You](#costs)
- [TROUBLESHOOTING: Common Errors](#troubleshooting)
- [CLEANUP: How to Delete Everything](#cleanup)

---

<a name="step-0"></a>
## STEP 0: Prerequisites — What You Need Before Starting

### 0.1 Azure Account

You need an Azure account. Two options:

**Option A: Free Trial (recommended for learning)**
- Go to: https://azure.microsoft.com/free/
- Sign up with any Microsoft account (Outlook, Hotmail, or create new)
- You get $200 USD free credit for 30 days
- Credit card required but NOT charged unless you upgrade
- This is enough to run our entire PLRA dev environment for a month

**Option B: TD Enterprise Account**
- If you have a TD Azure subscription, use that
- Ask your manager or cloud team for subscription access
- You'll need "Contributor" role on the subscription

### 0.2 Your Computer

You need either:
- **Windows 10/11** (any edition)
- **macOS** (any recent version)
- **Linux** (Ubuntu, CentOS, etc.)

### 0.3 Software to Install

| Software | Why You Need It | Download Link |
|----------|----------------|---------------|
| Azure CLI | Run Azure commands from terminal | Step 1 below |
| Azure Data Studio | Visual SQL client (like SSMS but cross-platform) | https://aka.ms/azuredatastudio |
| Java 17 JDK | Run Spring Boot | https://adoptium.net/ |
| Git | Version control | https://git-scm.com/ |

---

<a name="step-1"></a>
## STEP 1: Install Azure CLI

The Azure CLI (`az`) lets you manage Azure resources from your terminal.
Think of it as a command-line remote control for Azure.

### Windows

Open PowerShell **as Administrator** and run:
```powershell
# Download and install Azure CLI
winget install -e --id Microsoft.AzureCLI
```

Or download the installer: https://aka.ms/installazurecliwindows

### macOS

Open Terminal and run:
```bash
brew update && brew install azure-cli
```

If you don't have Homebrew: https://brew.sh/

### Linux (Ubuntu/Debian)

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
```

### Verify Installation

Close and reopen your terminal, then run:
```bash
az version
```

You should see something like:
```
{
  "azure-cli": "2.67.0",
  "azure-cli-core": "2.67.0",
  ...
}
```

**If you get "command not found"**: Close ALL terminal windows, open a fresh one, try again.

---

<a name="step-2"></a>
## STEP 2: Login to Azure

### 2.1 Login

Run this command — it will open your web browser:
```bash
az login
```

**What happens:**
1. Your browser opens to Microsoft login page
2. Enter your Azure account email and password
3. If prompted for MFA (multi-factor), complete it
4. Browser says "You have logged in" — you can close it
5. Terminal shows your subscription(s)

You'll see output like:
```json
[
  {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "name": "Azure subscription 1",
    "state": "Enabled",
    "isDefault": true
  }
]
```

**Save that `id` value** — that's your Subscription ID. You'll need it later.

### 2.2 If You Have Multiple Subscriptions

List them:
```bash
az account list --output table
```

Set the one you want to use:
```bash
az account set --subscription "YOUR_SUBSCRIPTION_NAME_OR_ID"
```

### 2.3 Verify You're Logged In

```bash
az account show --output table
```

This should show your active subscription.

---

<a name="step-3"></a>
## STEP 3: Understand Azure Organization

Before we create anything, let's understand how Azure is organized.
This is important so nothing confuses you later.

```
Azure Account (your login)
  └── Subscription (billing boundary — like a credit card)
        └── Resource Group (folder — groups related resources)
              ├── SQL Server (the "machine" that hosts databases)
              │     └── Database (the actual database with our tables)
              ├── App Service (where our Spring Boot app runs)
              ├── Key Vault (where passwords are stored)
              └── App Insights (monitoring/logging)
```

**Key concepts:**
- **Subscription** = who pays the bill. Everything costs money against a subscription.
- **Resource Group** = a folder. Put related things together. When you delete the group, EVERYTHING inside is deleted. This is your safety net.
- **Location/Region** = which data center. We'll use `canadacentral` (Toronto area). Pick the region closest to your users.

---

<a name="step-4"></a>
## STEP 4: Create a Resource Group

A Resource Group is like a folder for all PLRA resources.
If anything goes wrong, you can delete the entire group and start fresh.

### 4.1 Choose Your Names

First, let's set variables. Run these ONE AT A TIME:

**Windows PowerShell:**
```powershell
$RESOURCE_GROUP = "plra-dev-rg"
$LOCATION = "canadacentral"
$SQL_SERVER_NAME = "plra-dev-sqlsrv"
$DATABASE_NAME = "plra-dev-db"
$ADMIN_USER = "plra_admin"
$ADMIN_PASSWORD = "PLRAdev2026!Secure"
```

**macOS / Linux / Git Bash:**
```bash
RESOURCE_GROUP="plra-dev-rg"
LOCATION="canadacentral"
SQL_SERVER_NAME="plra-dev-sqlsrv"
DATABASE_NAME="plra-dev-db"
ADMIN_USER="plra_admin"
ADMIN_PASSWORD="PLRAdev2026!Secure"
```

**IMPORTANT about the password:**
Azure SQL requires a strong password:
- At least 8 characters
- Must contain: uppercase + lowercase + number + special character
- Cannot contain the username
- Cannot be a common password

### 4.2 Create the Resource Group

```bash
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --tags Project=PLRA Environment=dev Team=PLRAEngineering
```

**What this does:** Creates an empty folder named "plra-dev-rg" in the Canada Central data center.

**Expected output:**
```json
{
  "id": "/subscriptions/.../resourceGroups/plra-dev-rg",
  "location": "canadacentral",
  "name": "plra-dev-rg",
  "properties": {
    "provisioningState": "Succeeded"
  }
}
```

**"provisioningState": "Succeeded"** means it worked.

### 4.3 Verify It Exists

```bash
az group show --name $RESOURCE_GROUP --output table
```

You can also see it in the Azure Portal:
1. Go to https://portal.azure.com
2. Search "Resource groups" in the top search bar
3. You should see "plra-dev-rg" in the list

---

<a name="step-5"></a>
## STEP 5: Create Azure SQL Server (the logical server)

**IMPORTANT distinction:**
- **SQL Server** (the Azure resource) = a logical container that hosts databases. It's NOT a physical machine — it's Azure's management layer. Think of it as the "receptionist" that handles connections and authentication.
- **SQL Database** (Step 6) = the actual database with your tables and data.

### 5.1 Create the SQL Server

```bash
az sql server create \
  --name $SQL_SERVER_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --admin-user $ADMIN_USER \
  --admin-password $ADMIN_PASSWORD \
  --minimal-tls-version 1.2
```

**What each flag does:**
- `--name`: Globally unique name (becomes `plra-dev-sqlsrv.database.windows.net`)
- `--resource-group`: Put it in our folder
- `--location`: Same region as resource group
- `--admin-user`: The DBA login username
- `--admin-password`: The DBA login password
- `--minimal-tls-version`: Security — require encrypted connections

**This takes 1–2 minutes.** Wait for it to finish.

**If you get "name already taken":** SQL Server names are globally unique across ALL Azure customers. Add your initials or a random number:
```bash
SQL_SERVER_NAME="plra-dev-sqlsrv-abc123"
```

### 5.2 Verify the SQL Server

```bash
az sql server show \
  --name $SQL_SERVER_NAME \
  --resource-group $RESOURCE_GROUP \
  --output table
```

**Save this value — your server's full address:**
```
plra-dev-sqlsrv.database.windows.net
```

This is what you'll use to connect from Spring Boot and Azure Data Studio.

---

<a name="step-6"></a>
## STEP 6: Create the PLRA Database

Now we create the actual database inside the SQL Server.

### 6.1 Understand SKUs (pricing tiers)

| SKU | Monthly Cost (approx) | Best For | DTUs/vCores |
|-----|----------------------|----------|-------------|
| **Basic** | ~$5/mo | Learning/testing | 5 DTUs |
| **S0** | ~$15/mo | Dev environment | 10 DTUs |
| **S1** | ~$30/mo | UAT/staging | 20 DTUs |
| **GP_Gen5_2** | ~$200/mo | Production | 2 vCores |

**For learning, use Basic or S0.** You can upgrade later without losing data.

### 6.2 Create the Database

```bash
az sql db create \
  --name $DATABASE_NAME \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --service-objective S0 \
  --max-size 2GB \
  --backup-storage-redundancy Local
```

**What each flag does:**
- `--name`: Database name (this is what you'll put in the JDBC URL)
- `--server`: Which SQL Server to put it on
- `--service-objective S0`: The pricing/performance tier
- `--max-size 2GB`: Maximum storage (plenty for dev)
- `--backup-storage-redundancy Local`: Cheapest backup option for dev

**This takes 30–60 seconds.**

### 6.3 Verify the Database

```bash
az sql db show \
  --name $DATABASE_NAME \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --output table
```

**Your JDBC connection string is now:**
```
jdbc:sqlserver://plra-dev-sqlsrv.database.windows.net:1433;database=plra-dev-db;encrypt=true;trustServerCertificate=false;loginTimeout=30
```

---

<a name="step-7"></a>
## STEP 7: Configure Firewall Rules

By default, Azure SQL **blocks ALL connections** — even from you.
We need to tell it which IP addresses are allowed to connect.

### 7.1 Allow Your Current IP Address

This finds your IP and creates a firewall rule:

```bash
az sql server firewall-rule create \
  --name "AllowMyIP" \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --start-ip-address $(curl -s https://api.ipify.org) \
  --end-ip-address $(curl -s https://api.ipify.org)
```

**On Windows PowerShell** (the `curl` part is different):
```powershell
$MY_IP = (Invoke-RestMethod -Uri "https://api.ipify.org")
az sql server firewall-rule create `
  --name "AllowMyIP" `
  --resource-group $RESOURCE_GROUP `
  --server $SQL_SERVER_NAME `
  --start-ip-address $MY_IP `
  --end-ip-address $MY_IP
```

### 7.2 Allow Azure Services (needed for App Service later)

```bash
az sql server firewall-rule create \
  --name "AllowAzureServices" \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

**Note:** `0.0.0.0` to `0.0.0.0` is a special Azure-only rule. It allows other Azure services (like App Service) to connect, but NOT the general internet.

### 7.3 Verify Firewall Rules

```bash
az sql server firewall-rule list \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --output table
```

You should see two rules: `AllowMyIP` and `AllowAzureServices`.

**IMPORTANT:** If your IP changes (e.g., you go to a coffee shop, use VPN, or your ISP changes it), you'll need to update the firewall rule:
```bash
az sql server firewall-rule update \
  --name "AllowMyIP" \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --start-ip-address YOUR_NEW_IP \
  --end-ip-address YOUR_NEW_IP
```

---

<a name="step-8"></a>
## STEP 8: Connect and Verify (Azure Data Studio)

Now let's verify we can actually connect to the database.

### 8.1 Install Azure Data Studio

Download from: https://aka.ms/azuredatastudio

It's free, cross-platform (Windows/Mac/Linux), and works like SSMS.

### 8.2 Create a Connection

1. Open Azure Data Studio
2. Click **"New Connection"** (or press Ctrl+Shift+C)
3. Fill in:

| Field | Value |
|-------|-------|
| Connection type | Microsoft SQL Server |
| Server | `plra-dev-sqlsrv.database.windows.net` |
| Authentication type | SQL Login |
| User name | `plra_admin` |
| Password | `PLRAdev2026!Secure` (your password from Step 4) |
| Database | `plra-dev-db` |
| Encrypt | Mandatory |
| Trust server certificate | False |

4. Click **"Connect"**

### 8.3 If Connection Fails

**Error: "Client with IP address X.X.X.X is not allowed"**
→ Your IP changed. Go back to Step 7.1 and update the firewall rule.

**Error: "Login failed for user"**
→ Wrong password. Double-check the password from Step 4.

**Error: "Cannot open server"**
→ Server name is wrong. It should be `plra-dev-sqlsrv.database.windows.net` (with `.database.windows.net`).

**Error: "Connection timeout"**
→ Firewall is blocking you. Check Step 7.

### 8.4 Test Query

Once connected, open a new query window (Ctrl+N) and run:
```sql
SELECT @@VERSION AS ServerVersion;
SELECT DB_NAME() AS CurrentDatabase;
```

You should see:
```
Microsoft SQL Azure ... (RTM) ...
plra-dev-db
```

**If you see this, congratulations — your Azure SQL is working!**

---

<a name="step-9"></a>
## STEP 9: Run the Migration Scripts

Now we'll create the RATEMGMT schema with all 12 tables, 8 sequences, 20 foreign keys, and 140 indexes.

### 9.1 Option A: Via Azure Data Studio (Recommended for beginners)

1. In Azure Data Studio, make sure you're connected to `plra-dev-db`
2. Open each file in order (File → Open File):
   - `db/sqlserver/01_schema_sequences.sql`
   - `db/sqlserver/02_master_tables.sql`
   - `db/sqlserver/03_iloc_rate_tables.sql`
   - `db/sqlserver/04_uloc_rate_tables.sql`
   - `db/sqlserver/05_workflow_table.sql`
   - `db/sqlserver/06_foreign_keys.sql`
   - `db/sqlserver/07_indexes.sql`
   - `db/sqlserver/08_seed_data.sql`
3. For each file: Click **"Run"** (or press F5)
4. Wait for "Commands completed successfully" before opening the next file
5. **ORDER MATTERS** — do NOT skip ahead

### 9.2 Option B: Via sqlcmd (Command Line)

If you have `sqlcmd` installed (comes with SQL Server tools):

```bash
# Run each script in order
for SCRIPT in 01_schema_sequences 02_master_tables 03_iloc_rate_tables \
              04_uloc_rate_tables 05_workflow_table 06_foreign_keys \
              07_indexes 08_seed_data; do
  echo "Running ${SCRIPT}.sql ..."
  sqlcmd -S plra-dev-sqlsrv.database.windows.net \
         -d plra-dev-db \
         -U plra_admin \
         -P "PLRAdev2026!Secure" \
         -i "db/sqlserver/${SCRIPT}.sql" \
         -N -C
  echo "Done."
done
```

### 9.3 Verify the Installation

Run the verification script (from `00_MASTER_INSTALL.sql`) or just run these queries:

```sql
-- Should return 12 tables
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'RATEMGMT' AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Should return 8 sequences
SELECT name FROM sys.sequences
WHERE schema_id = SCHEMA_ID('RATEMGMT')
ORDER BY name;

-- Should return 20 foreign keys
SELECT COUNT(*) AS FK_COUNT
FROM sys.foreign_keys fk
JOIN sys.tables t ON fk.parent_object_id = t.object_id
WHERE SCHEMA_NAME(t.schema_id) = 'RATEMGMT';

-- Should show seed data (2 products)
SELECT * FROM RATEMGMT.PRODUCT;

-- Should show 9 amount tiers
SELECT * FROM RATEMGMT.AMOUNT_TIER;
```

**Expected results:**
- 12 tables ✓
- 8 sequences ✓
- 20 foreign keys ✓
- 2 products (ILOC, ULOC) ✓
- 9 amount tiers ✓

---

<a name="step-10"></a>
## STEP 10: Connect Spring Boot to Azure SQL

### 10.1 Update application.yml

Your `application.yml` already has the `azure` profile. You just need to set environment variables.

### 10.2 Set Environment Variables (for running locally against Azure SQL)

**Windows PowerShell:**
```powershell
$env:SPRING_PROFILES_ACTIVE = "azure"
$env:AZURE_SQL_URL = "jdbc:sqlserver://plra-dev-sqlsrv.database.windows.net:1433;database=plra-dev-db;encrypt=true;trustServerCertificate=false;loginTimeout=30"
$env:AZURE_SQL_USERNAME = "plra_admin"
$env:AZURE_SQL_PASSWORD = "PLRAdev2026!Secure"
```

**macOS / Linux:**
```bash
export SPRING_PROFILES_ACTIVE=azure
export AZURE_SQL_URL="jdbc:sqlserver://plra-dev-sqlsrv.database.windows.net:1433;database=plra-dev-db;encrypt=true;trustServerCertificate=false;loginTimeout=30"
export AZURE_SQL_USERNAME="plra_admin"
export AZURE_SQL_PASSWORD="PLRAdev2026!Secure"
```

### 10.3 Run Spring Boot Against Azure SQL

```bash
cd plra-api
mvn spring-boot:run
```

Or with inline properties:
```bash
mvn spring-boot:run \
  -Dspring-boot.run.profiles=azure \
  -Dspring-boot.run.arguments="--AZURE_SQL_URL=jdbc:sqlserver://plra-dev-sqlsrv.database.windows.net:1433;database=plra-dev-db;encrypt=true --AZURE_SQL_USERNAME=plra_admin --AZURE_SQL_PASSWORD=PLRAdev2026!Secure"
```

### 10.4 Verify in Logs

Look for these log lines:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
Started PlraApplication in X.XX seconds
```

If you see `HikariPool - Start completed`, Spring Boot successfully connected to Azure SQL.

---

<a name="step-11"></a>
## STEP 11: Verify End-to-End

### 11.1 Test the API

With Spring Boot running, open a browser or use curl:

```bash
# Health check
curl http://localhost:8080/plra/actuator/health

# Get all products (should return the 2 seed products)
curl http://localhost:8080/plra/api/v1/products

# Get amount tiers (should return 9 tiers)
curl http://localhost:8080/plra/api/v1/amount-tiers

# Swagger UI (visual API docs)
# Open in browser: http://localhost:8080/plra/swagger-ui.html
```

### 11.2 Expected Response

```json
{
  "success": true,
  "data": {
    "content": [
      { "id": 1, "name": "Investment Line of Credit", "type": "ILOC" },
      { "id": 2, "name": "Unsecured Line of Credit", "type": "ULOC" }
    ]
  }
}
```

**If you see this, your entire stack is working: Angular → Spring Boot → Azure SQL.**

---

<a name="costs"></a>
## COST BREAKDOWN: What This Will Cost

| Resource | SKU | Monthly Cost |
|----------|-----|-------------|
| SQL Server (logical) | Free | $0 |
| SQL Database | S0 (10 DTUs) | ~$15/mo |
| SQL Database | Basic (5 DTUs) | ~$5/mo |
| **Total (dev)** | | **$5–15/mo** |

**Free trial:** If you have the $200 free credit, this costs you nothing.

**To minimize costs:** Use Basic tier instead of S0:
```bash
az sql db update \
  --name $DATABASE_NAME \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --service-objective Basic
```

---

<a name="troubleshooting"></a>
## TROUBLESHOOTING: Common Errors

### "The subscription is not registered to use namespace Microsoft.Sql"
```bash
az provider register --namespace Microsoft.Sql
# Wait 2 minutes, then try again
```

### "The server name is already in use"
Add a random suffix to make it unique:
```bash
SQL_SERVER_NAME="plra-dev-sqlsrv-$(date +%s | tail -c 5)"
```

### "Passwords do not meet complexity requirements"
Your password needs: uppercase + lowercase + number + special character, 8+ chars.
Example: `PLRAdev2026!Secure`

### "Your client IP address does not have access"
Your IP changed. Update the firewall:
```bash
az sql server firewall-rule update \
  --name "AllowMyIP" \
  --resource-group $RESOURCE_GROUP \
  --server $SQL_SERVER_NAME \
  --start-ip-address $(curl -s https://api.ipify.org) \
  --end-ip-address $(curl -s https://api.ipify.org)
```

### "Cannot open database 'plra-dev-db' requested by the login"
The database doesn't exist yet. Go to Step 6.

### "Login failed for user 'plra_admin'"
Wrong password. To reset:
```bash
az sql server update \
  --name $SQL_SERVER_NAME \
  --resource-group $RESOURCE_GROUP \
  --admin-password "NewPassword2026!Here"
```

---

<a name="cleanup"></a>
## CLEANUP: How to Delete Everything

When you're done or want to start over, delete the entire resource group.
This deletes EVERYTHING inside it (SQL Server, database, all data).

```bash
az group delete --name plra-dev-rg --yes --no-wait
```

**This is permanent and cannot be undone.**

---

## NEXT STEPS

After completing this guide, you have:
- [x] Azure SQL Server running in Canada Central
- [x] PLRA database with RATEMGMT schema (12 tables, 140 indexes)
- [x] Seed data loaded (products, categories, tiers)
- [x] Spring Boot connecting to Azure SQL
- [x] API endpoints returning real data

Next phase: **Create Azure App Service** to deploy the JAR to the cloud.
