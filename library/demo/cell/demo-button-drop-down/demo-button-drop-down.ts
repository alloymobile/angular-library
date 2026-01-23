// demo-button-drop-down.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdButtonDropDown } from '../../../lib/cell/td-button-drop-down/td-button-drop-down';
import { TdButtonDropDownModel } from '../../../lib/cell/td-button-drop-down/td-button-drop-down.model';
import { OutputObject } from '../../../lib/share';

const DEFAULT_DROPDOWN_NORMAL = JSON.stringify(
  {
    id: 'tdBtnDd01',
    name: 'Menu',
    className: 'btn btn-primary dropdown-toggle',
    icon: null,
    linkBar: {
      className: 'dropdown-menu',
      linkClass: 'dropdown-item',
      links: [
        { type: 'TdLink', id: 'profile', name: 'Profile', href: '/profile', className: 'dropdown-item' },
        { type: 'TdLink', id: 'settings', name: 'Settings', href: '/settings', className: 'dropdown-item' },
        { type: 'TdLink', id: 'logout', name: 'Logout', href: '/logout', className: 'dropdown-item' }
      ]
    }
  },
  null,
  2
);

const DEFAULT_DROPDOWN_BUTTON_ICON = JSON.stringify(
  {
    id: 'tdBtnDd02',
    name: 'Actions',
    className: 'btn btn-outline-secondary dropdown-toggle',
    icon: { iconClass: 'fa-solid fa-bolt' },
    linkBar: {
      className: 'dropdown-menu',
      linkClass: 'dropdown-item',
      links: [
        { type: 'TdLinkIcon', id: 'new', name: 'New', href: '/new', icon: { iconClass: 'fa-solid fa-plus' }, className: 'dropdown-item' },
        { type: 'TdLinkIcon', id: 'edit', name: 'Edit', href: '/edit', icon: { iconClass: 'fa-solid fa-pen' }, className: 'dropdown-item' },
        { type: 'TdLinkIcon', id: 'delete', name: 'Delete', href: '/delete', icon: { iconClass: 'fa-solid fa-trash' }, className: 'dropdown-item' }
      ]
    }
  },
  null,
  2
);

const DEFAULT_DROPDOWN_ICON_ONLY = JSON.stringify(
  {
    id: 'tdBtnDd03',
    name: '',
    className: 'btn btn-outline-primary dropdown-toggle',
    icon: { iconClass: 'fa-solid fa-ellipsis-vertical' },
    linkBar: {
      className: 'dropdown-menu dropdown-menu-end',
      linkClass: 'dropdown-item',
      links: [
        { type: 'TdLink', id: 'copy', name: 'Copy', href: '/copy', className: 'dropdown-item' },
        { type: 'TdLink', id: 'share', name: 'Share', href: '/share', className: 'dropdown-item' },
        { type: 'TdLink', id: 'archive', name: 'Archive', href: '/archive', className: 'dropdown-item' }
      ]
    }
  },
  null,
  2
);
const DEFAULT_DROPDOWN_MIXED = JSON.stringify(
  {
    id: 'tdBtnDd04',
    name: 'More',
    className: 'btn btn-success dropdown-toggle',
    icon: { iconClass: 'fa-solid fa-circle-chevron-down' },
    linkBar: {
      className: 'dropdown-menu',
      linkClass: 'dropdown-item',
      links: [
        { type: 'TdLink', id: 'help', name: 'Help', href: '/help', className: 'dropdown-item' },
        { type: 'TdLinkIcon', id: 'download', name: 'Download', href: '/download', icon: { iconClass: 'fa-solid fa-download' }, className: 'dropdown-item' },
        { type: 'TdLinkIcon', id: 'share', name: 'Share', href: '/share', icon: { iconClass: 'fa-solid fa-share-nodes' }, className: 'dropdown-item' }
      ]
    }
  },
  null,
  2
);


type TabKey = 'normal' | 'buttonIcon' | 'iconOnly' | 'mixed';

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
  selector: 'demo-button-drop-down',
  standalone: true,
  imports: [CommonModule, FormsModule, TdButtonDropDown],
  templateUrl: './demo-button-drop-down.html',
  styleUrls: ['./demo-button-drop-down.css'],
})
export class DemoButtonDropDown {
  tagSnippet = `<td-button-drop-down [model]="model" (output)="handleOutput($event)"></td-button-drop-down>`;

  TABS: TabConfig[] = [
    { key: 'normal', label: 'Normal Button', defaultJson: DEFAULT_DROPDOWN_NORMAL },
    { key: 'buttonIcon', label: 'Button + Icon', defaultJson: DEFAULT_DROPDOWN_BUTTON_ICON },
    { key: 'iconOnly', label: 'Icon Only', defaultJson: DEFAULT_DROPDOWN_ICON_ONLY },
    { key: 'mixed', label: 'Mixed Links', defaultJson: DEFAULT_DROPDOWN_MIXED },
  ];

  activeTab: TabKey = 'normal';

  defaultOutputMsg = '// Click dropdown items to see output here';

  tabStates: Record<TabKey, TabState> = {
    normal: { json: DEFAULT_DROPDOWN_NORMAL, output: this.defaultOutputMsg, parseError: '' },
    buttonIcon: { json: DEFAULT_DROPDOWN_BUTTON_ICON, output: this.defaultOutputMsg, parseError: '' },
    iconOnly: { json: DEFAULT_DROPDOWN_ICON_ONLY, output: this.defaultOutputMsg, parseError: '' },
    mixed: { json: DEFAULT_DROPDOWN_MIXED, output: this.defaultOutputMsg, parseError: '' },
  };

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get model(): TdButtonDropDownModel {
    try {
      this.tabStates[this.activeTab].parseError = '';
      const raw = JSON.parse(this.currentTab.json || '{}');
      return new TdButtonDropDownModel(raw);
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return new TdButtonDropDownModel({
        name: 'Invalid JSON',
        className: 'btn btn-secondary dropdown-toggle',
        icon: { iconClass: 'fa-solid fa-triangle-exclamation' },
        linkBar: {
          className: 'dropdown-menu',
          linkClass: 'dropdown-item',
          links: [
            { type: 'TdLink', id: 'invalid', name: 'Fix JSON to enable menu', href: '#', className: 'dropdown-item' },
          ],
        },
      });
    }
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  onJsonChange(value: string): void {
    this.tabStates[this.activeTab].json = value;
  }

  handleOutput(out: any): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabStates[this.activeTab].output = JSON.stringify(payload, null, 2);
  }

  resetJson(): void {
    const cfg = this.TABS.find((t) => t.key === this.activeTab)!;
    this.tabStates[this.activeTab].json = cfg.defaultJson;
    this.tabStates[this.activeTab].parseError = '';
    this.tabStates[this.activeTab].output = this.defaultOutputMsg;
  }

  formatJson(): void {
    try {
      const parsed = JSON.parse(this.currentTab.json);
      this.tabStates[this.activeTab].json = JSON.stringify(parsed, null, 2);
    } catch {
      // ignore
    }
  }

  clearOutput(): void {
    this.tabStates[this.activeTab].output = '// cleared';
  }
}
