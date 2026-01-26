import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLinkBar } from '../../../lib/tissue/td-link-bar/td-link-bar';
import { TdLinkBarModel } from '../../../lib/tissue/td-link-bar/td-link-bar.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */
/* NOTE:
 * - LinkBar hydrates items based on item.type first, then shape (icon/logo).
 * - Use TD types: TdLink / TdLinkIcon / TdLinkLogo
 * - TdLinkLogo expects `logo` as an object (TdLogoModel config), not a string URL.
 */

const DEFAULT_JSON_LINK = JSON.stringify(
  {
    type: 'TdLinkBar',
    className: 'nav justify-content-center gap-3',
    linkClass: 'nav-item',
    title: {
      name: 'Navigation',
      className: 'text-center fw-semibold mb-2',
    },
    links: [
      { type: 'TdLink', id: 'home', name: 'Home', href: '/', className: 'nav-link' },
      { type: 'TdLink', id: 'about', name: 'About', href: '/about', className: 'nav-link' },
      { type: 'TdLink', id: 'contact', name: 'Contact', href: '/contact', className: 'nav-link' },
    ],
  },
  null,
  2
);

const DEFAULT_JSON_LINK_ICON = JSON.stringify(
  {
    type: 'TdLinkBar',
    className: 'nav justify-content-center gap-3',
    linkClass: 'nav-item',
    title: {
      name: 'Quick Links',
      className: 'text-center fw-semibold mb-2',
    },
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
        id: 'settings',
        name: 'Settings',
        href: '/settings',
        icon: { iconClass: 'fa-solid fa-gear' },
        className: 'nav-link',
      },
      {
        type: 'TdLinkIcon',
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
    type: 'TdLinkBar',
    className: 'nav justify-content-center gap-4',
    linkClass: 'nav-item',
    title: {
      name: 'Partners',
      className: 'text-center fw-semibold mb-2',
    },
    links: [
      {
        type: 'TdLinkLogo',
        id: 'angular',
        name: 'Angular',
        href: 'https://angular.io',
        logo: {
          imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg',
          alt: 'Angular',
          width: 40,
          height: 40,
        },
        className: 'nav-link d-flex align-items-center gap-2',
        target: '_blank',
      },
      {
        type: 'TdLinkLogo',
        id: 'bootstrap',
        name: 'Bootstrap',
        href: 'https://getbootstrap.com',
        logo: {
          imageUrl: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png',
          alt: 'Bootstrap',
          width: 40,
          height: 32,
        },
        className: 'nav-link d-flex align-items-center gap-2',
        target: '_blank',
      },
    ],
  },
  null,
  2
);

type TabType = 'TdLink' | 'TdLinkIcon' | 'TdLinkLogo';

interface TabState {
  json: string;
  output: string;
  parseError: string;
  linkBarModel: TdLinkBarModel;
}

@Component({
  selector: 'demo-link-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLinkBar],
  templateUrl: './demo-link-bar.html',
  styleUrls: ['./demo-link-bar.css'],
})
export class DemoLinkBar {
  activeTab: TabType = 'TdLink';

  tagSnippet = `<td-link-bar [linkBar]="linkBarModel" (output)="handleOutput($event)"></td-link-bar>`;

  tabs: Record<TabType, TabState> = {
    TdLink: this.createTabState(DEFAULT_JSON_LINK),
    TdLinkIcon: this.createTabState(DEFAULT_JSON_LINK_ICON),
    TdLinkLogo: this.createTabState(DEFAULT_JSON_LINK_LOGO),
  };

  private createTabState(json: string): TabState {
    return {
      json,
      output: '// Click a link to see events here…',
      parseError: '',
      linkBarModel: this.parseModel(json),
    };
  }

  private parseModel(json: string): TdLinkBarModel {
    try {
      return new TdLinkBarModel(JSON.parse(json));
    } catch (e: any) {
      return new TdLinkBarModel({
        type: 'TdLinkBar',
        className: 'nav justify-content-center gap-3',
        linkClass: 'nav-item',
        title: { name: 'Error', className: 'text-center fw-semibold mb-2' },
        links: [],
      });
    }
  }

  get currentTab(): TabState {
    return this.tabs[this.activeTab];
  }

  get linkBarModel(): TdLinkBarModel {
    return this.tabs[this.activeTab].linkBarModel;
  }

  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
  }

  onJsonChange(value: string): void {
    const tab = this.tabs[this.activeTab];
    tab.json = value;

    try {
      tab.parseError = '';
      tab.linkBarModel = new TdLinkBarModel(JSON.parse(value));
    } catch (e: any) {
      tab.parseError = e.message || String(e);
    }
  }

  handleOutput(out: OutputObject): void {
    const payload =
      out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabs[this.activeTab].output = JSON.stringify(payload, null, 2);
  }

  resetJson(): void {
    const defaults: Record<TabType, string> = {
      TdLink: DEFAULT_JSON_LINK,
      TdLinkIcon: DEFAULT_JSON_LINK_ICON,
      TdLinkLogo: DEFAULT_JSON_LINK_LOGO,
    };

    const tab = this.tabs[this.activeTab];
    tab.json = defaults[this.activeTab];
    tab.parseError = '';
    tab.output = '// Click a link to see events here…';
    tab.linkBarModel = this.parseModel(tab.json);
  }

  clearOutput(): void {
    this.tabs[this.activeTab].output = '// cleared';
  }

  getTabLabel(tab: TabType): string {
    switch (tab) {
      case 'TdLink':
        return 'TDLink';
      case 'TdLinkIcon':
        return 'TDLinkIcon';
      case 'TdLinkLogo':
        return 'TDLinkLogo';
    }
  }
}
