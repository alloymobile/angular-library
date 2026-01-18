import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdNavBar } from '../../../../lib/tissue/td-nav-bar/td-nav-bar';
import { NavBarObject } from '../../../../lib/tissue/td-nav-bar/td-nav-bar.model';
import { OutputObject } from '../../../../lib/share';

/* ─────────────────────────── Default JSON Config ─────────────────────────── */

const DEFAULT_NAVBAR = JSON.stringify(
  {
    id: 'mainNavbar',
    className: 'navbar navbar-expand-lg navbar-light bg-light',
    logo: {
      id: 'brand',
      name: 'MyApp',
      href: '/',
      logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
      width: 30,
      height: 30,
      className: 'navbar-brand d-flex align-items-center gap-2',
    },
    linkBar: {
      id: 'navLinks',
      type: 'AlloyLink',
      className: 'navbar-nav me-auto mb-2 mb-lg-0',
      linkClass: 'nav-item',
      selected: 'active',
      links: [
        { id: 'home', name: 'Home', href: '/', className: 'nav-link' },
        { id: 'features', name: 'Features', href: '/features', className: 'nav-link' },
        { id: 'pricing', name: 'Pricing', href: '/pricing', className: 'nav-link' },
        { id: 'about', name: 'About', href: '/about', className: 'nav-link' },
      ],
    },
  },
  null,
  2
);

const DEFAULT_NAVBAR_ICON = JSON.stringify(
  {
    id: 'iconNavbar',
    className: 'navbar navbar-expand-lg navbar-dark bg-dark',
    logo: {
      id: 'brandIcon',
      name: 'Dashboard',
      href: '/dashboard',
      logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
      width: 32,
      height: 32,
      className: 'navbar-brand d-flex align-items-center gap-2',
    },
    linkBar: {
      id: 'iconNavLinks',
      type: 'AlloyLinkIcon',
      className: 'navbar-nav me-auto mb-2 mb-lg-0',
      linkClass: 'nav-item',
      selected: 'active',
      links: [
        { id: 'dashboard', name: 'Dashboard', href: '/dashboard', icon: { iconClass: 'fa-solid fa-gauge-high' }, className: 'nav-link' },
        { id: 'analytics', name: 'Analytics', href: '/analytics', icon: { iconClass: 'fa-solid fa-chart-line' }, className: 'nav-link' },
        { id: 'settings', name: 'Settings', href: '/settings', icon: { iconClass: 'fa-solid fa-gear' }, className: 'nav-link' },
      ],
    },
  },
  null,
  2
);

type TabKey = 'basic' | 'icon';

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
  selector: 'demo-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, TdNavBar],
  templateUrl: './demo-nav-bar.html',
  styleUrls: ['./demo-nav-bar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoNavBar {
  readonly tagSnippet = `<td-nav-bar [navBar]="navBarModel" (output)="handleOutput($event)"></td-nav-bar>`;

  readonly TABS: TabConfig[] = [
    { key: 'basic', label: 'Basic NavBar', defaultJson: DEFAULT_NAVBAR },
    { key: 'icon', label: 'Icon NavBar', defaultJson: DEFAULT_NAVBAR_ICON },
  ];

  activeTab: TabKey = 'basic';
  defaultOutputMsg = '// Click links to see OutputObject here';

  tabStates: Record<TabKey, TabState> = {
    basic: { json: DEFAULT_NAVBAR, output: this.defaultOutputMsg, parseError: '' },
    icon: { json: DEFAULT_NAVBAR_ICON, output: this.defaultOutputMsg, parseError: '' },
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find(t => t.key === this.activeTab)!;
  }

  get navBarModel(): NavBarObject {
    try {
      this.tabStates[this.activeTab].parseError = '';
      return new NavBarObject(JSON.parse(this.currentTab.json));
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return new NavBarObject({
        id: 'errorNavbar',
        className: 'navbar navbar-light bg-light',
        logo: { name: 'Error', href: '/' },
        linkBar: { links: [] },
      });
    }
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  onJsonChange(value: string): void {
    this.tabStates[this.activeTab].json = value;
    this.cdr.markForCheck();
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabStates[this.activeTab].output = JSON.stringify(payload, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(): void {
    const config = this.currentTabConfig;
    this.tabStates[this.activeTab].json = config.defaultJson;
    this.tabStates[this.activeTab].parseError = '';
    this.tabStates[this.activeTab].output = this.defaultOutputMsg;
    this.cdr.markForCheck();
  }

  clearOutput(): void {
    this.tabStates[this.activeTab].output = '// cleared';
    this.cdr.markForCheck();
  }
}
