import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdNavBarAction } from '../../../lib/tissue/td-nav-bar-action/td-nav-bar-action';
import { NavBarActionObject } from '../../../lib/tissue/td-nav-bar-action/td-nav-bar-action.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const DEFAULT_NAVBAR_GUEST = JSON.stringify(
  {
    id: 'appNavbarGuest',
    className: 'navbar navbar-expand-lg navbar-light bg-white border-bottom',
    sidebarId: 'mainSidebar',
    collapse: true,
    brand: {
      id: 'appBrand',
      name: 'MyApp',
      href: '/',
      logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
      width: 32,
      height: 32,
      className: 'navbar-brand d-flex align-items-center gap-2',
    },
    title: {
      name: 'Welcome',
      className: 'navbar-text d-none d-md-inline ms-2',
    },
    linkBar: {
      type: 'AlloyLink',
      className: 'navbar-nav me-auto mb-2 mb-lg-0',
      linkClass: 'nav-item',
      links: [
        { id: 'features', name: 'Features', href: '/features', className: 'nav-link' },
        { id: 'pricing', name: 'Pricing', href: '/pricing', className: 'nav-link' },
      ],
    },
    auth: {
      mode: 'guest',
      storageKey: 'auth_token',
    },
    guestActions: {
      type: 'AlloyButton',
      className: 'd-flex gap-2',
      buttons: [
        { id: 'login', name: 'Log In', className: 'btn btn-outline-primary' },
        { id: 'signup', name: 'Sign Up', className: 'btn btn-primary' },
      ],
    },
    userActions: {
      type: 'AlloyButtonIcon',
      className: 'd-flex gap-2',
      buttons: [
        { id: 'notifications', name: '', icon: { iconClass: 'fa-regular fa-bell' }, className: 'btn btn-light' },
        { id: 'profile', name: 'Profile', icon: { iconClass: 'fa-regular fa-user' }, className: 'btn btn-outline-secondary' },
        { id: 'logout', name: 'Logout', icon: { iconClass: 'fa-solid fa-right-from-bracket' }, className: 'btn btn-outline-danger' },
      ],
    },
  },
  null,
  2
);

const DEFAULT_NAVBAR_USER = JSON.stringify(
  {
    id: 'appNavbarUser',
    className: 'navbar navbar-expand-lg navbar-dark bg-primary',
    sidebarId: 'mainSidebar',
    collapse: true,
    brand: {
      id: 'appBrandUser',
      name: 'Dashboard',
      href: '/dashboard',
      logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
      width: 32,
      height: 32,
      className: 'navbar-brand d-flex align-items-center gap-2',
    },
    backButton: {
      id: 'backBtn',
      name: '',
      icon: { iconClass: 'fa-solid fa-arrow-left' },
      className: 'btn btn-link text-white p-0 me-2',
      ariaLabel: 'Go back',
    },
    title: {
      name: 'Dashboard',
      className: 'navbar-text text-white d-none d-md-inline',
    },
    linkBar: {
      type: 'AlloyLinkIcon',
      className: 'navbar-nav me-auto mb-2 mb-lg-0',
      linkClass: 'nav-item',
      links: [
        { id: 'overview', name: 'Overview', href: '/dashboard', icon: { iconClass: 'fa-solid fa-gauge-high' }, className: 'nav-link' },
        { id: 'reports', name: 'Reports', href: '/reports', icon: { iconClass: 'fa-solid fa-chart-bar' }, className: 'nav-link' },
      ],
    },
    auth: {
      mode: 'user',
      storageKey: 'auth_token',
    },
    guestActions: {
      type: 'AlloyButton',
      className: 'd-flex gap-2',
      buttons: [
        { id: 'login', name: 'Log In', className: 'btn btn-light' },
      ],
    },
    userActions: {
      type: 'AlloyButtonIcon',
      className: 'd-flex gap-2',
      buttons: [
        { id: 'notifications', name: '', icon: { iconClass: 'fa-regular fa-bell' }, className: 'btn btn-light' },
        { id: 'profile', name: '', icon: { iconClass: 'fa-regular fa-user' }, className: 'btn btn-light' },
        { id: 'logout', name: 'Logout', className: 'btn btn-outline-light' },
      ],
    },
  },
  null,
  2
);

type TabKey = 'guest' | 'user';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoNavBarAction {
  readonly tagSnippet = `<td-nav-bar-action [navBarAction]="navBarActionModel" (output)="handleOutput($event)"></td-nav-bar-action>`;

  readonly TABS: TabConfig[] = [
    { key: 'guest', label: 'Guest Mode', defaultJson: DEFAULT_NAVBAR_GUEST },
    { key: 'user', label: 'User Mode', defaultJson: DEFAULT_NAVBAR_USER },
  ];

  activeTab: TabKey = 'guest';
  defaultOutputMsg = '// Click buttons/links to see OutputObject here';

  tabStates: Record<TabKey, TabState> = {
    guest: { json: DEFAULT_NAVBAR_GUEST, output: this.defaultOutputMsg, parseError: '' },
    user: { json: DEFAULT_NAVBAR_USER, output: this.defaultOutputMsg, parseError: '' },
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find(t => t.key === this.activeTab)!;
  }

  get navBarActionModel(): NavBarActionObject {
    try {
      this.tabStates[this.activeTab].parseError = '';
      return new NavBarActionObject(JSON.parse(this.currentTab.json));
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return new NavBarActionObject({
        id: 'errorNavbar',
        className: 'navbar navbar-light bg-light',
        brand: { name: 'Error', href: '/' },
        auth: { mode: 'guest' },
        guestActions: { buttons: [] },
        userActions: { buttons: [] },
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
