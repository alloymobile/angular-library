import { Component, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";

import { TdSidebar } from "../../../lib/tissue/td-sidebar/td-sidebar";
import { SideBarObject } from "../../../lib/tissue/td-sidebar/td-sidebar.model";

import { TdNavBarAction } from "../../../lib/tissue/td-nav-bar-action/td-nav-bar-action";
import { TdNavBarActionModel } from "../../../lib/tissue/td-nav-bar-action/td-nav-bar-action.model";

import { OutputObject } from "../../../lib/share";

import sidebarConfig from "../../config/plra-admin-sidebar.json";
import navbarConfig from "../../config/plra-admin-navbar.json";

@Component({
  selector: "plra-admin-layout",
  standalone: true,
  imports: [CommonModule, RouterOutlet, TdSidebar, TdNavBarAction],
  templateUrl: "./plra-admin-layout.html",
  styleUrls: ["./plra-admin-layout.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlraAdminLayout {
  sidebar = new SideBarObject(sidebarConfig as any);
  navBarAction = new TdNavBarActionModel(navbarConfig as any);

  onSidebar(out: OutputObject): void {}
  onNavbar(out: OutputObject): void {}
}
