import { Routes } from "@angular/router";

export const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "demo" },
    {
    path: "demo",
    loadChildren: () => import("./demo/demo.routes").then((m) => m.DEMO_ROUTES),
    },
    { path: "**", redirectTo: "demo" },
];
