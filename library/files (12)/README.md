# PLRA — Angular + Spring Boot Integration Guide

## How It Works (Build Flow)

```
mvn clean install          ← Run from /plra (root)
        │
        ├── 1. plra-ui (builds first — defined first in parent POM modules)
        │       │
        │       ├── install-node-and-npm    → Downloads Node v22 + NPM locally
        │       ├── npm install             → Installs node_modules
        │       └── ng build --prod         → Outputs to plra-ui/dist/plra-ui/browser/
        │                                          ├── index.html
        │                                          ├── main-[hash].js
        │                                          ├── styles-[hash].css
        │                                          └── ...
        │
        └── 2. plra-api (builds second)
                │
                ├── copy-angular-build      → Copies dist/plra-ui/browser/*
                │                              into target/classes/static/
                ├── compile Java sources
                ├── run tests
                └── spring-boot:repackage   → Creates executable JAR
                                               └── Contains: static/index.html
                                                             static/main-[hash].js
                                                             static/styles-[hash].css
                                                             + all Spring Boot classes
```

## Quick Start Commands

```bash
# ============================================================
#  FULL BUILD (UI + API together)
# ============================================================
cd plra
mvn clean install

# Run the JAR
java -jar plra-api/target/plra-api-2.0.0-SNAPSHOT.jar

# Open browser → http://localhost:8080
# Angular UI loads automatically!

# ============================================================
#  API-ONLY BUILD (skip Angular — for fast backend dev)
# ============================================================
cd plra
mvn clean install -P skip-ui

# ============================================================
#  DEVELOPMENT MODE (run separately for hot-reload)
# ============================================================

# Terminal 1: Spring Boot API (port 8080)
cd plra/plra-api
mvn spring-boot:run

# Terminal 2: Angular dev server (port 4200) with proxy to API
cd plra/plra-ui
ng serve --proxy-config proxy.conf.json
```

## Angular Proxy Config (for Development Mode)

Create `plra-ui/proxy.conf.json` for local development:

```json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug"
  }
}
```

Then run Angular with: `ng serve --proxy-config proxy.conf.json`

This proxies all `/api/*` calls from Angular (port 4200) to Spring Boot (port 8080).

## Troubleshooting

### 1. "Angular build output not found"
- Check `angular.json` → `outputPath` setting
- For Angular 20: output is in `dist/plra-ui/browser/`
- For Angular 17-19: output might be in `dist/plra-ui/`
- Update BOTH `plra-ui/pom.xml` and `plra-api/pom.xml` property to match

### 2. "404 on page refresh" (e.g., refreshing /admin/rates)
- Ensure `SpaForwardingController.java` is in your project
- Ensure it's inside a package that Spring Boot component-scans

### 3. "API calls return index.html instead of JSON"
- Ensure ALL REST controllers use `/api/` prefix
- The SPA controller excludes paths starting with `api` and `actuator`

### 4. "Node/NPM version mismatch"
- Update `node.version` and `npm.version` in parent `pom.xml`
- Run `node --version` and `npm --version` locally to check yours

### 5. "Build works locally but fails in CI/CD"
- The frontend-maven-plugin downloads Node during build
- Ensure your CI/CD has internet access or configure a Node mirror
- For Azure DevOps / GitHub Actions, you can also pre-install Node
  and set `<installDirectory>` to skip the download step

## Project Structure After Build

```
plra-api/target/classes/
├── static/                      ← Angular build output
│   ├── index.html
│   ├── main-abc123.js
│   ├── polyfills-def456.js
│   ├── styles-ghi789.css
│   ├── assets/
│   │   └── (images, fonts, etc.)
│   └── 3rdpartylicenses.txt
│
├── application.yml
└── com/td/plra/                 ← Spring Boot compiled classes
    ├── PlraApplication.class
    ├── config/
    │   └── SpaForwardingController.class
    ├── controller/
    ├── service/
    ├── model/
    └── repository/
```

## Key Points

1. **Module order in parent POM matters** — `plra-ui` MUST be listed before `plra-api`
2. **All REST APIs must use `/api/` prefix** — prevents conflict with Angular routes
3. **The SPA controller is essential** — forwards non-API routes to index.html
4. **One JAR to deploy** — `plra-api-2.0.0-SNAPSHOT.jar` contains everything
5. **For development**, run them separately with Angular proxy for hot-reload
