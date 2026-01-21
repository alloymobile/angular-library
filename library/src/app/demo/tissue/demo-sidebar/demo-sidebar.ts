import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdSidebar } from '../../../lib/tissue/td-sidebar/td-sidebar';
import { SideBarObject } from '../../../lib/tissue/td-sidebar/td-sidebar.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const DEFAULT_SIDEBAR = JSON.stringify(
  {
    id: 'mainSidebar',
    close: 'mobileSidebarOffcanvas',
    categories: [
      {
        id: 'mainCategory',
        title: {
          name: 'Main',
          className: 'text-muted small text-uppercase fw-semibold px-3 mb-2',
        },
        className: 'nav flex-column',
        linkClass: 'nav-item',
        selected: 'active',
        links: [
          {
            type: 'TdLinkIcon',
            id: 'dashboard',
            name: 'Dashboard',
            href: '/dashboard',
            icon: { iconClass: 'fa-solid fa-gauge-high' },
            className: 'nav-link d-flex align-items-center gap-2 px-3 py-2',
          },
          {
            type: 'TdLinkIcon',
            id: 'analytics',
            name: 'Analytics',
            href: '/analytics',
            icon: { iconClass: 'fa-solid fa-chart-line' },
            className: 'nav-link d-flex align-items-center gap-2 px-3 py-2',
          },
          {
            type: 'TdLinkIcon',
            id: 'reports',
            name: 'Reports',
            href: '/reports',
            icon: { iconClass: 'fa-solid fa-file-lines' },
            className: 'nav-link d-flex align-items-center gap-2 px-3 py-2',
          },
        ],
      },
      {
        id: 'managementCategory',
        title: {
          name: 'Management',
          className: 'text-muted small text-uppercase fw-semibold px-3 mb-2 mt-3',
        },
        className: 'nav flex-column',
        linkClass: 'nav-item',
        selected: 'active',
        links: [
          {
            type: 'TdLinkIcon',
            id: 'users',
            name: 'Users',
            href: '/users',
            icon: { iconClass: 'fa-solid fa-users' },
            className: 'nav-link d-flex align-items-center gap-2 px-3 py-2',
          },
          {
            type: 'TdLinkIcon',
            id: 'roles',
            name: 'Roles',
            href: '/roles',
            icon: { iconClass: 'fa-solid fa-user-shield' },
            className: 'nav-link d-flex align-items-center gap-2 px-3 py-2',
          },
          {
            type: 'TdLinkIcon',
            id: 'settings',
            name: 'Settings',
            href: '/settings',
            icon: { iconClass: 'fa-solid fa-gear' },
            className: 'nav-link d-flex align-items-center gap-2 px-3 py-2',
          },
        ],
      },
    ],
  },
  null,
  2
);

const DEFAULT_SIDEBAR_SIMPLE = JSON.stringify(
  {
    id: 'simpleSidebar',
    close: 'mobileSimpleSidebar',
    categories: [
      {
        id: 'navCategory',
        title: {
          name: 'Menu',
          className: 'text-white small text-uppercase fw-semibold px-3 mb-2',
        },
        className: 'nav flex-column py-3 bg-primary',
        linkClass: 'nav-item',
        selected: 'active bg-white text-primary',
        links: [
          {
            type: 'TdLinkIcon',
            id: 'home',
            name: 'Home',
            href: '/',
            icon: { iconClass: 'fa-solid fa-house' },
            className: 'nav-link text-white d-flex align-items-center gap-2 px-3 py-2',
          },
          {
            type: 'TdLinkIcon',
            id: 'products',
            name: 'Products',
            href: '/products',
            icon: { iconClass: 'fa-solid fa-box' },
            className: 'nav-link text-white d-flex align-items-center gap-2 px-3 py-2',
          },
          {
            type: 'TdLinkIcon',
            id: 'orders',
            name: 'Orders',
            href: '/orders',
            icon: { iconClass: 'fa-solid fa-shopping-cart' },
            className: 'nav-link text-white d-flex align-items-center gap-2 px-3 py-2',
          },
          {
            type: 'TdLinkIcon',
            id: 'customers',
            name: 'Customers',
            href: '/customers',
            icon: { iconClass: 'fa-solid fa-address-book' },
            className: 'nav-link text-white d-flex align-items-center gap-2 px-3 py-2',
          },
        ],
      },
    ],
  },
  null,
  2
);


type TabKey = 'categorized' | 'simple';

interface TabConfig {
  key: TabKey;
  label: string;
  defaultJson: string;
}

interface TabState {
  json: string;
  output: string;
  parseError: string;
}

@Component({
  selector: 'demo-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, TdSidebar],
  templateUrl: './demo-sidebar.html',
  styleUrls: ['./demo-sidebar.css'],
})
export class DemoSidebar {
  tagSnippet = `<td-sidebar [sidebar]="sidebarModel" (output)="handleOutput($event)"></td-sidebar>`;

  TABS: TabConfig[] = [
    { key: 'categorized', label: 'Categorized', defaultJson: DEFAULT_SIDEBAR },
    { key: 'simple', label: 'Simple', defaultJson: DEFAULT_SIDEBAR_SIMPLE },
  ];

  activeTab: TabKey = 'categorized';
  defaultOutputMsg = '// Click sidebar links to see OutputObject here';

  tabStates: Record<TabKey, TabState> = {
    categorized: { json: DEFAULT_SIDEBAR, output: this.defaultOutputMsg, parseError: '' },
    simple: { json: DEFAULT_SIDEBAR_SIMPLE, output: this.defaultOutputMsg, parseError: '' },
  };

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find((t) => t.key === this.activeTab)!;
  }

  get sidebarModel(): SideBarObject {
    try {
      this.tabStates[this.activeTab].parseError = '';
      const cfg = JSON.parse(this.currentTab.json || '{}');
      return new SideBarObject(cfg);
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return new SideBarObject({
        id: 'errorSidebar',
        close: 'errorSidebarOffcanvas',
        categories: [],
      });
    }
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  onJsonChange(value: string): void {
    this.tabStates[this.activeTab].json = value;
  }

  handleOutput(out: OutputObject): void {
    const payload =
      out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabStates[this.activeTab].output = JSON.stringify(payload, null, 2);
  }

  resetJson(): void {
    const config = this.currentTabConfig;
    this.tabStates[this.activeTab].json = config.defaultJson;
    this.tabStates[this.activeTab].parseError = '';
    this.tabStates[this.activeTab].output = this.defaultOutputMsg;
  }

  clearOutput(): void {
    this.tabStates[this.activeTab].output = '// cleared';
  }
}
