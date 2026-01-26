import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "plra" },
  
  {
    path: "plra",
    loadChildren: () => import("./plra/plra.routes").then((m) => m.PLRA_ROUTES),
  },

  {
    path: "admin",
    loadChildren: () =>
      import("./plra-admin/plra-admin.routes").then((m) => m.PLRA_ADMIN_ROUTES),
  },
  {
    path: "demo",
    loadChildren: () => import("./demo/demo.routes").then((m) => m.DEMO_ROUTES),
  },

  { path: "**", redirectTo: "plra" },
];
