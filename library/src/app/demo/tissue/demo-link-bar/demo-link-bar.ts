import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLinkBar } from '../../../lib/tissue/td-link-bar/td-link-bar';
import { LinkBarObject } from '../../../lib/tissue/td-link-bar/td-link-bar.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const DEFAULT_JSON_LINK = JSON.stringify(
  {
    type: 'AlloyLink',
    className: 'nav justify-content-center gap-3',
    linkClass: 'nav-item',
    selected: 'active',
    title: {
      name: 'Navigation',
      className: 'text-center fw-semibold mb-2',
    },
    links: [
      { id: 'home', name: 'Home', href: '/', className: 'nav-link' },
      { id: 'about', name: 'About', href: '/about', className: 'nav-link' },
      { id: 'contact', name: 'Contact', href: '/contact', className: 'nav-link' },
    ],
  },
  null,
  2
);

const DEFAULT_JSON_LINK_ICON = JSON.stringify(
  {
    type: 'AlloyLinkIcon',
    className: 'nav justify-content-center gap-3',
    linkClass: 'nav-item',
    selected: 'active',
    title: {
      name: 'Quick Links',
      className: 'text-center fw-semibold mb-2',
    },
    links: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        href: '/dashboard',
        icon: { iconClass: 'fa-solid fa-gauge-high' },
        className: 'nav-link',
      },
      {
        id: 'settings',
        name: 'Settings',
        href: '/settings',
        icon: { iconClass: 'fa-solid fa-gear' },
        className: 'nav-link',
      },
      {
        id: 'help',
        name: 'Help',
        href: '/help',
        icon: { iconClass: 'fa-solid fa-circle-question' },
        className: 'nav-link',
      },
    ],
  },
  null,
  2
);

const DEFAULT_JSON_LINK_LOGO = JSON.stringify(
  {
    type: 'AlloyLinkLogo',
    className: 'nav justify-content-center gap-4',
    linkClass: 'nav-item',
    selected: 'active',
    title: {
      name: 'Partners',
      className: 'text-center fw-semibold mb-2',
    },
    links: [
      {
        id: 'angular',
        name: 'Angular',
        href: 'https://angular.io',
        logo: 'https://angular.io/assets/images/logos/angular/angular.svg',
        width: 40,
        height: 40,
        className: 'nav-link d-flex align-items-center gap-2',
        target: '_blank',
      },
      {
        id: 'bootstrap',
        name: 'Bootstrap',
        href: 'https://getbootstrap.com',
        logo: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
        width: 40,
        height: 32,
        className: 'nav-link d-flex align-items-center gap-2',
        target: '_blank',
      },
    ],
  },
  null,
  2
);

type TabType = 'AlloyLink' | 'AlloyLinkIcon' | 'AlloyLinkLogo';

interface TabState {
  json: string;
  output: string;
  parseError: string;
  model: LinkBarObject;
}

@Component({
  selector: 'demo-link-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLinkBar],
  templateUrl: './demo-link-bar.html',
  styleUrls: ['./demo-link-bar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoLinkBar {
  activeTab: TabType = 'AlloyLink';

  readonly tagSnippet = `<td-link-bar [linkBar]="linkBarModel" (output)="handleOutput($event)"></td-link-bar>`;

  tabs: Record<TabType, TabState> = {
    AlloyLink: this.createTabState(DEFAULT_JSON_LINK, 'AlloyLink'),
    AlloyLinkIcon: this.createTabState(DEFAULT_JSON_LINK_ICON, 'AlloyLinkIcon'),
    AlloyLinkLogo: this.createTabState(DEFAULT_JSON_LINK_LOGO, 'AlloyLinkLogo'),
  };

  constructor(private cdr: ChangeDetectorRef) {}

  private createTabState(json: string, type: string): TabState {
    return {
      json,
      output: '// Click a link to see events here…',
      parseError: '',
      model: this.parseModel(json, type),
    };
  }

  private parseModel(json: string, type: string): LinkBarObject {
    try {
      const parsed = JSON.parse(json);
      return new LinkBarObject(parsed);
    } catch (e) {
      return new LinkBarObject({
        type,
        className: 'nav justify-content-center gap-3',
        linkClass: 'nav-item',
        selected: 'active',
        title: { name: 'Error', className: 'text-center fw-semibold mb-2' },
        links: [],
      });
    }
  }

  get currentTab(): TabState {
    return this.tabs[this.activeTab];
  }

  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  onJsonChange(value: string): void {
    const tab = this.tabs[this.activeTab];
    tab.json = value;
    try {
      tab.parseError = '';
      tab.model = new LinkBarObject(JSON.parse(value));
    } catch (e: any) {
      tab.parseError = e.message || String(e);
    }
    this.cdr.markForCheck();
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabs[this.activeTab].output = JSON.stringify(payload, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(): void {
    const defaults: Record<TabType, string> = {
      AlloyLink: DEFAULT_JSON_LINK,
      AlloyLinkIcon: DEFAULT_JSON_LINK_ICON,
      AlloyLinkLogo: DEFAULT_JSON_LINK_LOGO,
    };
    const tab = this.tabs[this.activeTab];
    tab.json = defaults[this.activeTab];
    tab.parseError = '';
    tab.output = '// Click a link to see events here…';
    tab.model = this.parseModel(tab.json, this.activeTab);
    this.cdr.markForCheck();
  }

  clearOutput(): void {
    this.tabs[this.activeTab].output = '// cleared';
    this.cdr.markForCheck();
  }

  getTabLabel(tab: TabType): string {
    switch (tab) {
      case 'AlloyLink': return 'TDLink';
      case 'AlloyLinkIcon': return 'TDLinkIcon';
      case 'AlloyLinkLogo': return 'TDLinkLogo';
    }
  }
}
