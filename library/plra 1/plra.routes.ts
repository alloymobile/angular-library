import { Routes } from "@angular/router";

import { PlraDashboard } from "./pages/plra-dashboard/plra-dashboard";
import { TdAdminLayout } from "./layout/td-admin-layout";

export const PLRA_ROUTES: Routes = [
  {
    path: "",
    component: TdAdminLayout,
    children: [
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      { path: "dashboard", component: PlraDashboard },
    ],
  },
];
