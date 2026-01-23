import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdNavBarAction } from '../../../lib/tissue/td-nav-bar-action/td-nav-bar-action';
import { TdNavBarActionModel } from '../../../lib/tissue/td-nav-bar-action/td-nav-bar-action.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */
/* NOTE:
 * - TdNavBarActionModel hydrates:
 *   - logo: TdLinkLogoModel (logo is an object)
 *   - linkBar: TdLinkBarModel (hydrates items by item.type)
 *   - buttonBar: ButtonBarObject (hydrates buttons)
 */

const DEFAULT_NAVBAR_ACTION_BASIC = JSON.stringify(
  {
    id: 'appNavBarActionBasic',
    className: 'navbar navbar-expand-lg navbar-light bg-white border-bottom',
    containerClass: 'container-fluid',

    logo: {
      type: 'TdLinkLogo',
      id: 'appLogo',
      name: 'MyApp',
      href: '/',
      className: 'navbar-brand d-flex align-items-center gap-2',
      logo: {
        imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg',
        alt: 'MyApp',
        width: 32,
        height: 32,
      },
    },

    linkBar: {
      type: 'TdLinkBar',
      className: 'navbar-nav me-auto mb-2 mb-lg-0',
      linkClass: 'nav-item',
      selected: 'active',
      links: [
        { type: 'TdLink', id: 'home', name: 'Home', href: '/', className: 'nav-link' },
        { type: 'TdLink', id: 'features', name: 'Features', href: '/features', className: 'nav-link' },
        { type: 'TdLink', id: 'pricing', name: 'Pricing', href: '/pricing', className: 'nav-link' },
      ],
    },

    buttonBar: {
      type: 'TdButtonBar',
      className: 'd-flex gap-2',
      buttons: [
        { type: 'TdButton', id: 'login', name: 'Log In', className: 'btn btn-outline-primary' },
        { type: 'TdButton', id: 'signup', name: 'Sign Up', className: 'btn btn-primary' },
      ],
    },
  },
  null,
  2
);

const DEFAULT_NAVBAR_ACTION_ICON = JSON.stringify(
  {
    id: 'appNavBarActionIcon',
    className: 'navbar navbar-expand-lg navbar-dark bg-primary',
    containerClass: 'container-fluid',

    logo: {
      type: 'TdLinkLogo',
      id: 'dashLogo',
      name: 'Dashboard',
      href: '/dashboard',
      className: 'navbar-brand d-flex align-items-center gap-2 text-white',
      logo: {
        imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg',
        alt: 'Dashboard',
        width: 32,
        height: 32,
      },
    },

    linkBar: {
      type: 'TdLinkBar',
      className: 'navbar-nav me-auto mb-2 mb-lg-0',
      linkClass: 'nav-item',
      selected: 'active',
      links: [
        {
          type: 'TdLinkIcon',
          id: 'overview',
          name: 'Overview',
          href: '/dashboard',
          icon: { iconClass: 'fa-solid fa-gauge-high' },
          className: 'nav-link text-white',
        },
        {
          type: 'TdLinkIcon',
          id: 'reports',
          name: 'Reports',
          href: '/reports',
          icon: { iconClass: 'fa-solid fa-chart-bar' },
          className: 'nav-link text-white',
        },
      ],
    },

    buttonBar: {
      type: 'TdButtonBar',
      className: 'd-flex gap-2',
      buttons: [
        { type: 'TdButtonIcon', id: 'bell', name: '', icon: { iconClass: 'fa-regular fa-bell' }, className: 'btn btn-light' },
        { type: 'TdButtonIcon', id: 'profile', name: 'Profile', icon: { iconClass: 'fa-regular fa-user' }, className: 'btn btn-light' },
        { type: 'TdButton', id: 'logout', name: 'Logout', className: 'btn btn-outline-light' },
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
  selector: 'demo-nav-bar-action',
  standalone: true,
  imports: [CommonModule, FormsModule, TdNavBarAction],
  templateUrl: './demo-nav-bar-action.html',
  styleUrls: ['./demo-nav-bar-action.css'],
})
export class DemoNavBarAction {
  tagSnippet =
    `<td-nav-bar-action [navBarAction]="navBarActionModel" (output)="handleOutput($event)"></td-nav-bar-action>`;

  TABS: TabConfig[] = [
    { key: 'basic', label: 'Basic', defaultJson: DEFAULT_NAVBAR_ACTION_BASIC },
    { key: 'icon', label: 'Icon', defaultJson: DEFAULT_NAVBAR_ACTION_ICON },
  ];

  activeTab: TabKey = 'basic';
  defaultOutputMsg = '// Click links/buttons to see OutputObject here';

  tabStates: Record<TabKey, TabState> = {
    basic: { json: DEFAULT_NAVBAR_ACTION_BASIC, output: this.defaultOutputMsg, parseError: '' },
    icon: { json: DEFAULT_NAVBAR_ACTION_ICON, output: this.defaultOutputMsg, parseError: '' },
  };

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find(t => t.key === this.activeTab)!;
  }

  get navBarActionModel(): TdNavBarActionModel {
    try {
      this.tabStates[this.activeTab].parseError = '';
      return new TdNavBarActionModel(JSON.parse(this.currentTab.json || '{}'));
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return new TdNavBarActionModel({
        id: 'errorNavBarAction',
        className: 'navbar navbar-light bg-light',
        containerClass: 'container-fluid',
        logo: { href: '/', logo: { imageUrl: '' }, name: 'Error' },
        linkBar: { type: 'TdLinkBar', links: [] },
        buttonBar: { type: 'TdButtonBar', buttons: [] },
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
      out && typeof (out as any).toJSON === 'function'
        ? (out as any).toJSON()
        : out;

    this.tabStates[this.activeTab].output = JSON.stringify(payload, null, 2);
  }

  resetJson(): void {
    const cfg = this.currentTabConfig;
    this.tabStates[this.activeTab].json = cfg.defaultJson;
    this.tabStates[this.activeTab].parseError = '';
    this.tabStates[this.activeTab].output = this.defaultOutputMsg;
  }

  clearOutput(): void {
    this.tabStates[this.activeTab].output = '// cleared';
  }
}
