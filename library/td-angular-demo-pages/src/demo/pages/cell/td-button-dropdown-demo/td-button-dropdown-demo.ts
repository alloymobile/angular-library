// src/demo/pages/tdbuttondropdown/tdbuttondropdown.ts

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdButtonDropDownComponent } from '../../../../lib/components/cell/td-button-dropdown/td-button-dropdown';
import { ButtonDropDownObject } from '../../../../lib/components/cell/td-button-dropdown/td-button-dropdown.model';

const DEFAULT_RAW: any = {
  id: "tdBtnDropdown01",
  name: "Alerts",
  type: "button",
  className: "btn btn-primary dropdown-toggle",
  active: "",

  icon: {
    iconClass: "fa-solid fa-bell",
  },

  badge: {
    name: "3",
    title: "Unread alerts",
    className: "badge bg-danger rounded-pill",
  },

  linkBar: {
    id: "alertsLinkBar",
    className: "dropdown-menu",
    linkClass: "dropdown-item",
    selected: "active",
    title: null,
    links: [
      {
        id: "alertLink1",
        name: "Server CPU high",
        href: "/private/alerts/1",
        icon: { iconClass: "fa-solid fa-triangle-exclamation" },
      },
      {
        id: "alertLink2",
        name: "New message from Admin",
        href: "/private/messages",
        icon: { iconClass: "fa-solid fa-envelope" },
      },
      {
        id: "alertLink3",
        name: "View all alerts",
        href: "/private/alerts",
        icon: { iconClass: "fa-solid fa-list" },
      },
    ],
  },
};
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-button-dropdown',
  standalone: true,
  imports: [CommonModule, TdButtonDropDownComponent],
  templateUrl: './td-button-dropdown-demo.html',
  styleUrls: ['./td-button-dropdown-demo.css']
})
export class TdButtonDropdownDemoComponent {
  title = 'TdButtonDropDown';
  usageSnippet = `<td-button-dropdown [buttonDropDown]="model" (output)="handleOutput($event)"></td-button-dropdown>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  @ViewChild(TdButtonDropDownComponent) cmp?: TdButtonDropDownComponent;

  get model(): ButtonDropDownObject {
    try {
      return new ButtonDropDownObject(this.parsed);
    } catch (e: any) {
      return new ButtonDropDownObject({ id: 'invalidDropdown', name: 'Invalid config', className: 'btn btn-secondary dropdown-toggle', linkBar: { className: 'dropdown-menu', linkClass: 'dropdown-item', links: [ { id: 'fix', name: 'Fix JSON to enable menu', href: '#'} ] } });
    }
  }

  onInputChange(val: string): void {
    this.inputJson = val;
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed = obj;
      this.parseError = '';
    } catch (e: any) {
      this.parseError = String(e?.message || e || 'Invalid JSON.');
    }
  }

  onReset(): void {
    this.inputJson = DEFAULT_JSON;
    this.parsed = DEFAULT_RAW;
    this.parseError = '';
    this.outputJson = '// Interact with the component to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parsed = obj;
      this.parseError = '';
    } catch {
      // ignore
    }
  }

  onClearOutput(): void {
    this.outputJson = '// cleared';
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }

  onTrigger(): void {
    const el = document.getElementById((this.model as any).id);
    el?.click();
  }

}

function to_pascal(s: string): string {
  return s.split('-').map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '').join('');
}
