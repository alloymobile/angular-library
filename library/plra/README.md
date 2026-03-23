# PLRA — Product Lending Rate Administration

> Rate management system for TD Bank's ULOC (Unsecured Line of Credit) and ILOC (Investment Line of Credit) products. Maker-checker workflow with role-based access control across four AD-group-based dashboards.

## Technology Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| Frontend | Angular 20 | Standalone components, lazy-loaded layouts, i18n (EN/FR) |
| Backend | Spring Boot 3.4 | Java 17, REST API, JPA, MapStruct, QueryDSL |
| Database | Azure SQL Server | RATEMGMT schema, 12 tables, UK FK pattern |
| Auth | PingFederate | OAuth2 JWT, AD group → role mapping |
| Infra | Azure (Terraform) | App Service, SQL Database, Key Vault, App Insights |
| Secrets | HashiCorp Vault | Spring Cloud Vault integration |
| CI/CD | GitHub Actions | Build → Test → SonarQube → Deploy (blue-green) |
| Quality | SonarQube + Veracode | Code coverage, SAST scanning |
| Build | Maven Multi-Module | Single `mvn package` produces unified JAR |

## Quick Start

### Option A: Local Dev (H2 in-memory, no dependencies)

```bash
# Backend — starts on :8080 with H2 database
cd plra-api && mvn spring-boot:run

# Frontend — starts on :4200, proxies API to :8080
cd plra-ui && npm install && npm start -- --proxy-config proxy.conf.json
```

Open http://localhost:4200 — auto-authenticated as Super Admin.

### Option B: Docker Compose (real SQL Server)

```bash
docker-compose up -d sqlserver vault    # Start SQL Server + Vault
sleep 15                                 # Wait for SQL Server
./db/init-docker-db.sh                   # Initialize schema + seed data
cd plra-api && mvn spring-boot:run -Dspring-boot.run.profiles=docker
cd plra-ui && npm start -- --proxy-config proxy.conf.json
```

### Option C: Full Build (single JAR)

```bash
mvn clean package                        # Builds Angular + Spring Boot → one JAR
java -jar plra-api/target/plra-api-1.0.0-SNAPSHOT.jar
```

Open http://localhost:8080/plra/

## Project Structure

```
plra/
├── pom.xml                              # Parent POM (multi-module)
├── Dockerfile                           # Multi-stage build (Angular → Java → slim JRE)
├── docker-compose.yml                   # SQL Server + Vault for local dev
├── sonar-project.properties             # SonarQube config
│
├── plra-ui/                             # ── ANGULAR 20 FRONTEND ──
│   ├── pom.xml                          # frontend-maven-plugin (Node + npm + ng build)
│   ├── proxy.conf.json                  # Dev proxy → Spring Boot
│   ├── src/
│   │   ├── styles.css                   # Design tokens (brand colors, typography)
│   │   ├── assets/i18n/{en,fr}.json     # Translations
│   │   ├── environments/                # Dev + Prod configs
│   │   └── app/
│   │       ├── app.routes.ts            # Root routes (4 lazy-loaded layouts)
│   │       ├── app.config.ts            # Providers (Router, HttpClient, Auth)
│   │       ├── core/
│   │       │   ├── models/api.models.ts # TypeScript API interfaces
│   │       │   ├── services/rate-api.service.ts  # HTTP client for all endpoints
│   │       │   └── i18n/translation.service.ts   # EN/FR translation engine
│   │       ├── shared/
│   │       │   ├── components/          # Reusable UI components
│   │       │   │   ├── top-bar/         # Global header + language dropdown
│   │       │   │   ├── kpi-card/        # Dashboard stat card
│   │       │   │   ├── status-badge/    # Color-coded status pill
│   │       │   │   ├── rate-filter-bar/ # Search + category + tier filters
│   │       │   │   └── rate-table/      # Grouped-header rate grid
│   │       │   ├── services/auth.service.ts      # JWT auth + role management
│   │       │   ├── guards/role.guard.ts           # Route protection by AD group
│   │       │   └── interceptors/auth.interceptor.ts # Bearer token injection
│   │       └── layouts/                 # 4 lazy-loaded dashboards
│   │           ├── viewer-layout/       # Level 1 — read-only rates
│   │           ├── reviewer-layout/     # Level 2 — approve/reject queue
│   │           ├── admin-layout/        # Level 3 — full CRUD + workflow
│   │           └── super-admin-layout/  # Level 4 — master data + system
│
├── plra-api/                            # ── SPRING BOOT BACKEND ──
│   ├── pom.xml                          # Unpacks Angular dist → resources/static
│   └── src/main/
│       ├── resources/
│       │   ├── application.yml          # Profiles: default, azure, docker, test
│       │   ├── application-security.yml # Auth claim mapping config
│       │   └── bootstrap-vault.yml      # HashiCorp Vault connection
│       └── java/com/td/plra/
│           ├── config/
│           │   ├── security/SecurityConfig.java    # OAuth2 + RBAC (2 profiles)
│           │   ├── JpaAuditingConfig.java          # Auto-populates createdBy/updatedBy
│           │   ├── SpaForwardingController.java    # Angular route forwarding
│           │   └── WebConfig.java                  # CORS, caching, pagination
│           └── security/
│               ├── model/PlraRole.java             # AD group → role enum
│               ├── model/PlraUserPrincipal.java    # Authenticated user DTO
│               ├── service/PingFederateJwtConverter.java  # JWT claim extraction
│               ├── service/SecurityContextService.java    # Get current user anywhere
│               ├── service/AuthInfoResource.java          # GET /api/auth/me
│               └── mock/MockTokenEndpoint.java            # Dev token generator
│
├── db/sqlserver/                        # ── SQL SERVER SCRIPTS ──
│   ├── 00_MASTER_INSTALL.sql            # Verification queries
│   ├── 01-07_*.sql                      # Schema, tables, FKs, indexes (140)
│   ├── 08_seed_data.sql                 # Dev sample data
│   ├── 99_ROLLBACK_DROP_ALL.sql         # Drop everything
│   └── init-docker-db.sh               # Docker container initialization
│
├── infra/                               # ── TERRAFORM (AZURE) ──
│   ├── main.tf                          # Root orchestration
│   ├── modules/
│   │   ├── app-service/                 # Linux Java 17 + staging slot
│   │   ├── sql-database/                # Azure SQL + private endpoint
│   │   ├── key-vault/                   # Secrets storage
│   │   ├── monitoring/                  # App Insights + alerts
│   │   └── networking/                  # VNet, subnets, NSGs
│   ├── environments/{dev,uat,prod}/     # Per-env tfvars
│   ├── bootstrap-tfstate.sh             # One-time state storage setup
│   └── vault-dev-setup.sh              # Local Vault server setup
│
└── .github/workflows/                   # ── CI/CD PIPELINES ──
    ├── app-ci-cd.yml                    # Build → Test → Deploy (blue-green)
    └── infra-deploy.yml                 # Terraform plan/apply
```

## Access Levels

| Level | AD Group | Route | Dashboard | Capabilities |
|-------|---------|-------|-----------|-------------|
| 1 | `TD-APP-PLRA-VIEWER` | `/view/**` | Viewer | Read-only rate grid with filters |
| 2 | `TD-APP-PLRA-REVIEWER` | `/review/**` | Reviewer | Approve/reject pending rates |
| 3 | `TD-APP-PLRA-ADMIN` | `/admin/**` | Admin | Create/edit/submit drafts + workflow |
| 4 | `TD-APP-PLRA-SUPER-ADMIN` | `/super-admin/**` | Super Admin | Master data + system config |

Each layout is **lazy-loaded** — the browser only downloads code for the user's access level.

### Switch Role (Dev Only)

In browser console or via API:
```bash
# Via mock token endpoint
curl http://localhost:8080/plra/api/auth/mock-token/viewer
curl http://localhost:8080/plra/api/auth/mock-token/reviewer
curl http://localhost:8080/plra/api/auth/mock-token/admin
curl http://localhost:8080/plra/api/auth/mock-token/super-admin
```

## Configuration Profiles

| Profile | DB | Auth | Vault | Usage |
|---------|-----|------|-------|-------|
| `default` | H2 in-memory | Permissive | Off | IDE development |
| `docker` | SQL Server (localhost:1433) | Permissive | Optional | Docker Compose dev |
| `azure` | Azure SQL | PingFederate JWT | On | Deployed environments |
| `test` | H2 in-memory | Permissive | Off | Automated tests |

## Azure Deployment

```bash
# One-time: create state storage
./infra/bootstrap-tfstate.sh

# Deploy infrastructure
cd infra/
terraform init -backend-config="environments/dev/backend.tfvars"
terraform apply -var-file="environments/dev/terraform.tfvars"

# Deploy application (via GitHub Actions or manual)
mvn clean package
az webapp deploy --resource-group plra-dev-rg --name plra-dev-app \
  --src-path plra-api/target/plra-api-1.0.0-SNAPSHOT.jar --type jar
```

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | DONE | Project structure + unified Maven build |
| 2 | DONE | Database migration (DB2 → SQL Server, 9 scripts) |
| 3 | DONE | Azure infrastructure (Terraform, 5 modules, 3 environments) |
| 4 | DONE | PingFederate auth + AD group RBAC (JWT converter, mock tokens) |
| 5 | DONE | Angular layouts (4 dashboards converted from HTML prototypes) |
| 6 | DONE | i18n (EN/FR translation files + TranslationService + language dropdown) |
| 7 | DONE | HashiCorp Vault (Spring Cloud Vault config + dev setup script) |
| 8 | DONE | CI/CD (GitHub Actions: build → test → blue-green deploy) |
| 9 | DONE | SonarQube config + quality gate thresholds |
| 10 | DONE | Docker (multi-stage Dockerfile + docker-compose + SQL init) |
