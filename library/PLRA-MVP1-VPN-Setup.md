# PLRA MVP1 — VPN Deployment Guide

## Prerequisites
- Node.js and npm installed
- Angular CLI installed (`npm install -g @angular/cli`)
- Access to TD internal npm registry (`.npmrc` configured)

---

## Step 1: Copy Source Code

Copy the entire `src/` folder and `tsconfig.spec.json` from your local machine to the VPN machine.

```bash
# Replace src/ entirely (your local has all changes + previous code)
cp -r <from-local>/plra-ui/src/ ~/alloymobile/plra/plra-ui/src/

# Copy test config
cp <from-local>/plra-ui/tsconfig.spec.json ~/alloymobile/plra/plra-ui/tsconfig.spec.json
```

---

## Step 2: Install Dependencies

```bash
cd ~/alloymobile/plra/plra-ui

npm install --legacy-peer-deps

npm install --save-dev jest @types/jest jest-preset-angular jest-environment-jsdom ts-jest @angular-builders/jest --legacy-peer-deps
```

---

## Step 3: Update angular.json (add test target)

```bash
cd ~/alloymobile/plra/plra-ui

node -e "
const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('angular.json', 'utf8'));
cfg.projects['plra-ui'].architect.test = {
  builder: '@angular-builders/jest:run',
  options: { tsConfig: 'tsconfig.spec.json', coverage: true }
};
fs.writeFileSync('angular.json', JSON.stringify(cfg, null, 2));
console.log('angular.json updated with test target');
"
```

---

## Step 4: Update package.json (add test scripts)

```bash
cd ~/alloymobile/plra/plra-ui

node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.test = 'ng test';
pkg.scripts['test:coverage'] = 'ng test --coverage';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('package.json updated with test scripts');
"
```

---

## Step 5: Clean Up (remove old setup file if exists)

```bash
cd ~/alloymobile/plra/plra-ui

rm -f setup-jest.ts
rm -f jest.config.ts
```

---

## Step 6: Run Tests

```bash
cd ~/alloymobile/plra/plra-ui

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Open coverage report in browser
open coverage/index.html
```

### Expected Output

```
Test Suites: 21 passed, 21 total
Tests:       221 passed, 221 total
```

---

## Step 7: Verify Application Runs

```bash
cd ~/alloymobile/plra/plra-ui

ng serve
```

Open `http://localhost:4200` in browser.

---

## What Changed in MVP1

### Feature: Discretion BPS Validation
- Discretion entered in basis points (whole integers only)
- Floor auto-calculated: `Floor = New Rate − (Disc bps / 100)`
- Red/green validation borders on inputs
- Save button disabled when row has errors
- Column header: "Disc (bps)" / "Disc (pb)" for EN/FR

### Feature: TD Emerald Button Components
- All `<button>` elements replaced with `<td-button-icon>` across 10 page components
- Tabs, toolbar buttons, save/submit/approve all use `TdButtonIconModel`
- Only exception: Bootstrap alert dismiss `btn-close`

### Feature: Unit Test Suite (221 tests)
- Jest + `@angular-builders/jest` configured for Angular 20
- 21 test suites covering all components, services, guards, interceptors
- Mock data shared via `src/app/testing/mock-data.ts`

### Files Changed

| Category | Count | Files |
|----------|-------|-------|
| Translation | 2 | `en.json`, `fr.json` |
| Shared Component | 3 | `rate-matrix.ts`, `.html`, `.css` |
| Admin Pages | 4 | `admin-uloc-rates.ts/.html`, `admin-iloc-rates.ts/.html` |
| Super Admin Pages | 4 | `super-admin-uloc-rates.ts/.html`, `super-admin-iloc-rates.ts/.html` |
| Reviewer Pages | 4 | `reviewer-uloc.ts/.html`, `reviewer-iloc.ts/.html` |
| Test Mock Data | 1 | `testing/mock-data.ts` |
| Test Specs | 20 | All `.spec.ts` files |
| Config | 1 | `tsconfig.spec.json` |
| **Total** | **39** | |

---

## Troubleshooting

### Tests not running
Ensure `setup-jest.ts` and `jest.config.ts` are deleted — `@angular-builders/jest` handles everything.

### "Cannot find module" errors
Run `npm install --legacy-peer-deps` to ensure all dependencies are installed.

### Coverage too low
Run `npm run test:coverage` and check `coverage/index.html` for uncovered lines.
