# TD Angular demo pages (Cell + Tissue)

This folder contains **26 demo pages** (13 Cell + 13 Tissue) that mirror the React demo workflow:
- live preview
- editable JSON input
- output inspector
- tabs for multi-variant components (ButtonBar, LinkBar, NavBar, Form)

## Where to place this
Copy the `src/demo` folder into your Angular workspace **under `src/`** (same level as `src/lib`).

Expected structure:
- `src/lib/...` contains your TD component library
- `src/demo/...` contains these demo pages

## Wire routes
In your app routes, import and spread `TD_DEMO_ROUTES`:

```ts
import { TD_DEMO_ROUTES } from './demo/demo.routes';

export const routes: Routes = [
  ...TD_DEMO_ROUTES,
  // your other routes
];
```

Then navigate to `/demo`.

## Bootstrap + Font Awesome
These demos assume Bootstrap + Font Awesome are available (same as your React demos).
- Include Bootstrap CSS/JS and Font Awesome in your app (CDN or npm).
- `td-modal` and `td-modal-toast` require Bootstrap JS globals (`bootstrap.Modal`, `bootstrap.Toast`).
