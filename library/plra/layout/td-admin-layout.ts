import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { TdSidebar } from '@/app/lib/tissue/td-sidebar/td-sidebar';
import { SideBarObject } from '@/app/lib/tissue/td-sidebar/td-sidebar.model';

import { TdNavBarActionModel } from '@/app/lib/tissue/td-nav-bar-action/td-nav-bar-action.model';

import { OutputObject } from '@/app/lib/share';

import sidebarConfig from './admin-sidebar.json';
import navbarConfig from './admin-navbar.json';
import { TdNavBarAction } from '@/app/lib/tissue/td-nav-bar-action/td-nav-bar-action';

@Component({
  selector: 'td-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TdSidebar, TdNavBarAction],
  templateUrl: './td-admin-layout.html',
  styleUrls: ['./td-admin-layout.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TdAdminLayout {
  sidebar = new SideBarObject(sidebarConfig as any);
  navBarAction = new TdNavBarActionModel(navbarConfig as any);

  onSidebar(out: OutputObject): void {}
  onNavbar(out: OutputObject): void {}
}