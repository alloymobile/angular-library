import { Routes } from "@angular/router";

import { PlraLayout } from "./layout/plra-layout/plra-layout";
import { PlraDashboard } from "./pages/plra-dashboard/plra-dashboard";

export const PLRA_ROUTES: Routes = [
  {
    path: "",
    component: PlraLayout,
    children: [
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      { path: "dashboard", component: PlraDashboard },
    ],
  },
];
