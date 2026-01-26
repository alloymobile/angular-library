import { Routes } from "@angular/router";

import { PlraAdminLayout } from "./layout/plra-admin-layout/plra-admin-layout";
import { PlraAdminDashboard } from "./pages/plra-admin-dashboard/plra-admin-dashboard";

export const PLRA_ADMIN_ROUTES: Routes = [
  {
    path: "",
    component: PlraAdminLayout,
    children: [
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      { path: "dashboard", component: PlraAdminDashboard },
    ],
  },
];
