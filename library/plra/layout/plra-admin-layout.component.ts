import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { TdNavBarActionModel } from "@/app/lib/tissue/td-nav-bar-action/td-nav-bar-action.model";
import { SideBarObject } from "@/app/lib/tissue/td-sidebar/td-sidebar.model";

import { PLRA_ADMIN_LAYOUT } from "./plra-admin-layout.config";
import { TdNavBarAction } from "@/app/lib/tissue/td-nav-bar-action/td-nav-bar-action";
import { TdSidebar } from "@/app/lib/tissue/td-sidebar/td-sidebar";

@Component({
  selector: "plra-admin-layout",
  standalone: true,
  imports: [CommonModule, RouterModule, TdNavBarAction, TdSidebar],
  templateUrl: "./plra-admin-layout.component.html",
  styleUrls: ["./plra-admin-layout.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlraAdminLayoutComponent {
  navBarAction = new TdNavBarActionModel(PLRA_ADMIN_LAYOUT.navBarAction as any);
  sideBar = new SideBarObject(PLRA_ADMIN_LAYOUT.sideBar as any);
}
