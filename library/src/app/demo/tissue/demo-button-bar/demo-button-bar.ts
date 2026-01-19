import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdButtonBar } from '../../../lib/tissue/td-button-bar/td-button-bar';
import { ButtonBarObject } from '../../../lib/tissue/td-button-bar/td-button-bar.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const DEFAULT_JSON_BTN = JSON.stringify(
  {
    type: 'AlloyButton',
    className: 'nav justify-content-center gap-2',
    buttonClass: 'nav-item',
    selected: 'active',
    title: {
      name: 'Actions',
      className: 'text-center fw-semibold mb-2',
    },
    buttons: [
      { id: 'save', name: 'Save', className: 'btn btn-primary' },
      { id: 'reset', name: 'Reset', className: 'btn btn-outline-secondary' },
      { id: 'del', name: 'Delete', className: 'btn btn-danger' },
    ],
  },
  null,
  2
);

const DEFAULT_JSON_BTN_ICON = JSON.stringify(
  {
    type: 'AlloyButtonIcon',
    className: 'nav justify-content-center gap-2',
    buttonClass: 'nav-item',
    selected: 'active',
    title: {
      name: 'Shortcuts',
      className: 'text-center fw-semibold mb-2',
    },
    buttons: [
      {
        id: 'homeI',
        name: 'Home',
        icon: { iconClass: 'fa-solid fa-house' },
        className: 'btn btn-light',
      },
      {
        id: 'codeI',
        name: 'Code',
        icon: { iconClass: 'fa-solid fa-code' },
        className: 'btn btn-light',
      },
      {
        id: 'userI',
        name: 'Profile',
        icon: { iconClass: 'fa-regular fa-user' },
        className: 'btn btn-light',
      },
    ],
  },
  null,
  2
);

const DEFAULT_JSON_BTN_MIXED = JSON.stringify(
  {
    type: 'AlloyButton',
    className: 'nav justify-content-center gap-2',
    buttonClass: 'nav-item',
    selected: 'active',
    title: {
      name: 'Actions + Dropdown',
      className: 'text-center fw-semibold mb-2',
    },
    buttons: [
      { id: 'save', name: 'Save', className: 'btn btn-primary' },
      {
        type: 'dropdown',
        id: 'userMenu',
        name: '',
        className: 'btn btn-outline-secondary btn-sm dropdown-toggle',
        icon: { iconClass: 'fa-regular fa-user' },
        linkBar: {
          type: 'AlloyLinkIcon',
          className: 'dropdown-menu dropdown-menu-end',
          linkClass: 'dropdown-item d-flex align-items-center gap-2',
          selected: 'active',
          links: [
            {
              id: 'profile',
              href: '/private/member/profile',
              icon: { iconClass: 'fa-regular fa-id-card' },
              name: 'Profile',
            },
            {
              id: 'signout',
              href: '#',
              icon: { iconClass: 'fa-solid fa-arrow-right-from-bracket' },
              name: 'Sign out',
            },
          ],
        },
      },
      { id: 'del', name: 'Delete', className: 'btn btn-danger' },
    ],
  },
  null,
  2
);

type TabType = 'AlloyButton' | 'AlloyButtonIcon' | 'AlloyButtonMixed';

interface TabState {
  json: string;
  output: string;
  parseError: string;
  model: ButtonBarObject;
}

@Component({
  selector: 'demo-button-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, TdButtonBar],
  templateUrl: './demo-button-bar.html',
  styleUrls: ['./demo-button-bar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoButtonBar {
  activeTab: TabType = 'AlloyButton';

  readonly tagSnippet = `<td-button-bar [buttonBar]="buttonBarModel" (output)="handleOutput($event)"></td-button-bar>`;

  tabs: Record<TabType, TabState> = {
    AlloyButton: this.createTabState(DEFAULT_JSON_BTN, 'AlloyButton'),
    AlloyButtonIcon: this.createTabState(DEFAULT_JSON_BTN_ICON, 'AlloyButtonIcon'),
    AlloyButtonMixed: this.createTabState(DEFAULT_JSON_BTN_MIXED, 'AlloyButton'),
  };

  constructor(private cdr: ChangeDetectorRef) {}

  private createTabState(json: string, type: string): TabState {
    return {
      json,
      output: '// Interact with the bar to see events here…',
      parseError: '',
      model: this.parseModel(json, type),
    };
  }

  private parseModel(json: string, type: string): ButtonBarObject {
    try {
      const parsed = JSON.parse(json);
      return new ButtonBarObject(parsed);
    } catch (e) {
      return new ButtonBarObject({
        type: type === 'AlloyButtonIcon' ? 'AlloyButtonIcon' : 'AlloyButton',
        className: 'nav justify-content-center gap-2',
        buttonClass: 'nav-item',
        selected: 'active',
        title: { name: 'Error', className: 'text-center fw-semibold mb-2' },
        buttons: [],
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
      tab.model = new ButtonBarObject(JSON.parse(value));
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
      AlloyButton: DEFAULT_JSON_BTN,
      AlloyButtonIcon: DEFAULT_JSON_BTN_ICON,
      AlloyButtonMixed: DEFAULT_JSON_BTN_MIXED,
    };
    const tab = this.tabs[this.activeTab];
    tab.json = defaults[this.activeTab];
    tab.parseError = '';
    tab.output = '// Interact with the bar to see events here…';
    tab.model = this.parseModel(tab.json, this.activeTab);
    this.cdr.markForCheck();
  }

  clearOutput(): void {
    this.tabs[this.activeTab].output = '// cleared';
    this.cdr.markForCheck();
  }

  getTabLabel(tab: TabType): string {
    switch (tab) {
      case 'AlloyButton': return 'TDButton';
      case 'AlloyButtonIcon': return 'TDButtonIcon';
      case 'AlloyButtonMixed': return 'TDButton + Dropdown';
    }
  }
}
