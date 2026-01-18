import { Routes } from "@angular/router";

import { Demo } from "./demo";

import { DemoCell } from "./pages/cell/cell";
import { DemoTissue } from "./pages/tissue/tissue";
import { DemoOrgan } from "./pages/organ/organ";
import { IconDemo } from "./pages/cell/icon-demo";
import { LinkDemo } from "./pages/cell/link-demo";
import { ButtonDemo } from "./pages/cell/button-demo";
import { LinkIconDemo } from "./pages/cell/link-icon-demo";
import { LinkLogoDemo } from "./pages/cell/link-logo-demo";
import { ButtonIconDemo } from "./pages/cell/button-icon-demo";
import { ButtonSubmitDemo } from "./pages/cell/button-submit-demo";
import { InputDemo } from "./pages/cell/input-demo";
import { InputIconDemo } from "./pages/cell/input-icon-demo";
import { InputFloatingDemo } from "./pages/cell/input-floating-demo";
import { SearchDemo } from "./pages/cell/search-demo";
import { LoadingDemo } from "./pages/cell/loading-demo";
import { DemoButtonBar } from "./pages/tissue/demo-button-bar/demo-button-bar";
import { DemoLinkBar } from "./pages/tissue/demo-link-bar/demo-link-bar";
import { DemoCard } from "./pages/tissue/demo-card/demo-card";
import { DemoCardAction } from "./pages/tissue/demo-card-action/demo-card-action";
import { DemoForm } from "./pages/tissue/demo-form/demo-form";
import { DemoModal } from "./pages/tissue/demo-modal/demo-modal";
import { DemoNavBar } from "./pages/tissue/demo-nav-bar/demo-nav-bar";
import { DemoNavBarAction } from "./pages/tissue/demo-nav-bar-action/demo-nav-bar-action";
import { DemoSidebar } from "./pages/tissue/demo-sidebar/demo-sidebar";
import { DemoTable } from "./pages/tissue/demo-table/demo-table";
import { DemoTableAction } from "./pages/tissue/demo-table-action/demo-table-action";
import { DemoPagination } from "./pages/tissue/demo-pagination/demo-pagination";

export const DEMO_ROUTES: Routes = [
  {
    path: "",
    component: Demo,
    children: [
      // /demo -> /demo/cell/icon
      { path: "", pathMatch: "full", redirectTo: "cell/icon" },

      {
        path: "cell",
        component: DemoCell,
        children: [
            { path: "", pathMatch: "full", redirectTo: "icon" },
            { path: "icon", component: IconDemo },
            { path: "link", component: LinkDemo },
            { path: "link-icon", component: LinkIconDemo },
            { path: "link-logo", component: LinkLogoDemo },
            { path: "button", component: ButtonDemo },
            { path: "button-icon", component: ButtonIconDemo },
            { path: "button-submit", component: ButtonSubmitDemo },    
            { path: "input", component: InputDemo },   
            { path: "input-icon", component: InputIconDemo },   
            { path: "input-floating", component: InputFloatingDemo },  
            { path: "loading", component: LoadingDemo },   
            { path: "search", component: SearchDemo },                             
        ],
      },

      {
        path: "tissue",
        component: DemoTissue,
        children: [
            { path: "", pathMatch: "full", redirectTo: "button-bar" },
            { path: "button-bar", component: DemoButtonBar },
            { path: "link-bar", component: DemoLinkBar },
            { path: "card", component: DemoCard },
            { path: "card-action", component: DemoCardAction },
            { path: "form", component: DemoForm },
            { path: "modal", component: DemoModal },
            { path: "navbar", component:  DemoNavBar},
            { path: "navbar-action", component: DemoNavBarAction },
            { path: "sidebar", component: DemoSidebar },
            { path: "table", component: DemoTable },
            { path: "table-action", component: DemoTableAction },
            { path: "pagination", component: DemoPagination }
        ],
      },

      {
        path: "organ",
        component: DemoOrgan,
        children: [
          
        ],
      },
    ],
  },
];
