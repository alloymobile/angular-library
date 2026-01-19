import { Routes } from "@angular/router";

import { Demo } from "./demo";

import { DemoCell } from "./cell/cell";
import { DemoTissue } from "./tissue/tissue";
import { DemoOrgan } from "./organ/organ";
import { DemoButtonBar } from "./tissue/demo-button-bar/demo-button-bar";
import { DemoLinkBar } from "./tissue/demo-link-bar/demo-link-bar";
import { DemoCard } from "./tissue/demo-card/demo-card";
import { DemoCardAction } from "./tissue/demo-card-action/demo-card-action";
import { DemoForm } from "./tissue/demo-form/demo-form";
import { DemoModal } from "./tissue/demo-modal/demo-modal";
import { DemoNavBar } from "./tissue/demo-nav-bar/demo-nav-bar";
import { DemoNavBarAction } from "./tissue/demo-nav-bar-action/demo-nav-bar-action";
import { DemoSidebar } from "./tissue/demo-sidebar/demo-sidebar";
import { DemoTable } from "./tissue/demo-table/demo-table";
import { DemoTableAction } from "./tissue/demo-table-action/demo-table-action";
import { DemoPagination } from "./tissue/demo-pagination/demo-pagination";
import { DemoIcon } from "./cell/demo-icon/demo-icon";
import { DemoLink } from "./cell/demo-link/demo-link";
import { DemoLinkIcon } from "./cell/demo-link-icon/demo-link-icon";
import { DemoLinkLogo } from "./cell/demo-link-logo/demo-link-logo";
import { DemoButton } from "./cell/demo-button/demo-button";
import { DemoButtonIcon } from "./cell/demo-button-icon/demo-button-icon";
import { DemoButtonSubmit } from "./cell/demo-button-submit/demo-button-submit";
import { DemoLoading } from "./cell/demo-loading/demo-loading";
import { DemoSearch } from "./cell/demo-search/demo-search";
import { DemoInput } from "./cell/demo-input/demo-input";
import { DemoInputIcon } from "./cell/demo-input-icon/demo-input-icon";
import { DemoInputFloating } from "./cell/demo-input-floating/demo-input-floating";

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
            { path: "icon", component: DemoIcon },
            { path: "link", component: DemoLink },
            { path: "link-icon", component: DemoLinkIcon },
            { path: "link-logo", component: DemoLinkLogo },
            { path: "button", component: DemoButton },
            { path: "button-icon", component: DemoButtonIcon },
            { path: "button-submit", component: DemoButtonSubmit },    
            { path: "input", component: DemoInput },   
            { path: "input-icon", component: DemoInputIcon },   
            { path: "input-floating", component: DemoInputFloating },  
            { path: "loading", component: DemoLoading },   
            { path: "search", component: DemoSearch },                             
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
