import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdNavBar } from '../../../lib/tissue/td-nav-bar/td-nav-bar';
import { TdNavBarModel } from '../../../lib/tissue/td-nav-bar/td-nav-bar.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Config ─────────────────────────── */
/* NOTE:
 * - TDNavBar model hydrates TdLinkLogoModel + TdLinkBarModel internally.
 * - TdLinkLogo requires `logo` as an object (TdLogoModel config).
 * - LinkBar hydrates items using item.type first (TdLink/TdLinkIcon/TdLinkLogo).
 */

const DEFAULT_NAVBAR = JSON.stringify(
  {
    id: 'mainNavbar',
    className: 'navbar navbar-expand-lg navbar-light bg-light',
    containerClass: 'container-fluid',

    logo: {
      type: 'TdLinkLogo',
      id: 'brand',
      name: 'MyApp',
      href: '/',
      className: 'navbar-brand d-flex align-items-center gap-2',
      logo: {
        imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg',
        alt: 'MyApp',
        width: 30,
        height: 30,
      },
    },

    linkBar: {
      type: 'TdLinkBar',
      id: 'navLinks',
      className: 'navbar-nav me-auto mb-2 mb-lg-0',
      linkClass: 'nav-item',
      selected: 'active',
      links: [
        { type: 'TdLink', id: 'home', name: 'Home', href: '/', className: 'nav-link' },
        { type: 'TdLink', id: 'features', name: 'Features', href: '/features', className: 'nav-link' },
        { type: 'TdLink', id: 'pricing', name: 'Pricing', href: '/pricing', className: 'nav-link' },
        { type: 'TdLink', id: 'about', name: 'About', href: '/about', className: 'nav-link' },
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
    containerClass: 'container-fluid',

    logo: {
      type: 'TdLinkLogo',
      id: 'brandIcon',
      name: 'Dashboard',
      href: '/dashboard',
      className: 'navbar-brand d-flex align-items-center gap-2',
      logo: {
        imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg',
        alt: 'Dashboard',
        width: 32,
        height: 32,
      },
    },

    linkBar: {
      type: 'TdLinkBar',
      id: 'iconNavLinks',
      className: 'navbar-nav me-auto mb-2 mb-lg-0',
      linkClass: 'nav-item',
      selected: 'active',
      links: [
        {
          type: 'TdLinkIcon',
          id: 'dashboard',
          name: 'Dashboard',
          href: '/dashboard',
          icon: { iconClass: 'fa-solid fa-gauge-high' },
          className: 'nav-link',
        },
        {
          type: 'TdLinkIcon',
          id: 'analytics',
          name: 'Analytics',
          href: '/analytics',
          icon: { iconClass: 'fa-solid fa-chart-line' },
          className: 'nav-link',
        },
        {
          type: 'TdLinkIcon',
          id: 'settings',
          name: 'Settings',
          href: '/settings',
          icon: { iconClass: 'fa-solid fa-gear' },
          className: 'nav-link',
        },
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
  readonly tagSnippet =
    `<td-nav-bar [navBar]="navBarModel" (output)="handleOutput($event)"></td-nav-bar>`;

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

  get navBarModel(): TdNavBarModel {
    try {
      this.tabStates[this.activeTab].parseError = '';
      return new TdNavBarModel(JSON.parse(this.currentTab.json || '{}'));
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return new TdNavBarModel({
        id: 'errorNavbar',
        className: 'navbar navbar-light bg-light',
        containerClass: 'container-fluid',
        logo: {
          type: 'TdLinkLogo',
          name: 'Error',
          href: '/',
          logo: { imageUrl: '', alt: 'Error' },
        },
        linkBar: { type: 'TdLinkBar', links: [] },
      } as any);
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
    const payload =
      out && typeof (out as any).toJSON === 'function'
        ? (out as any).toJSON()
        : out;

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
