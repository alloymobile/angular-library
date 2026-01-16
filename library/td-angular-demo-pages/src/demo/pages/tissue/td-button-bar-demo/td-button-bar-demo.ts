// src/demo/pages/tissue/td-button-bar-demo/td-button-bar-demo.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdButtonBarComponent } from '../../../../lib/components/tissue/td-button-bar/td-button-bar';
import { ButtonBarObject } from '../../../../lib/components/tissue/td-button-bar/td-button-bar.model';

const RAW_TEXT: any = {
    type: "AlloyButton",
    className: "nav justify-content-center gap-2",
    buttonClass: "nav-item",
    selected: "active", // class name injected into the selected button's `active`
    title: {
      name: "Actions",
      className: "text-center fw-semibold mb-2",
    },
    buttons: [
      { id: "save", name: "Save", className: "btn btn-primary" },
      { id: "reset", name: "Reset", className: "btn btn-outline-secondary" },
      { id: "del", name: "Delete", className: "btn btn-danger" },
    ],
  };
const RAW_ICON: any = {
    type: "AlloyButtonIcon",
    className: "nav justify-content-center gap-2",
    buttonClass: "nav-item",
    selected: "active",
    title: {
      name: "Shortcuts",
      className: "text-center fw-semibold mb-2",
    },
    buttons: [
      {
        id: "homeI",
        name: "Home",
        icon: { iconClass: "fa-solid fa-house" },
        className: "btn btn-light",
      },
      {
        id: "codeI",
        name: "Code",
        icon: { iconClass: "fa-solid fa-code" },
        className: "btn btn-light",
      },
      {
        id: "userI",
        name: "Profile",
        icon: { iconClass: "fa-regular fa-user" },
        className: "btn btn-light",
      },
    ],
  };
const RAW_MIXED: any = {
    type: "AlloyButton",
    className: "nav justify-content-center gap-2",
    buttonClass: "nav-item",
    selected: "active",
    title: {
      name: "Actions + Dropdown",
      className: "text-center fw-semibold mb-2",
    },
    buttons: [
      { id: "save", name: "Save", className: "btn btn-primary" },
      {
        type: "dropdown",
        id: "userMenu",
        name: "",
        className: "btn btn-outline-secondary btn-sm dropdown-toggle",
        icon: { iconClass: "fa-regular fa-user" },
        linkBar: {
          type: "AlloyLinkIcon",
          className: "dropdown-menu dropdown-menu-end",
          linkClass: "dropdown-item d-flex align-items-center gap-2",
          selected: "active",
          links: [
            {
              id: "profile",
              href: "/private/member/profile",
              icon: { iconClass: "fa-regular fa-id-card" },
              name: "Profile",
            },
            {
              id: "signout",
              href: "#",
              icon: { iconClass: "fa-solid fa-arrow-right-from-bracket" },
              name: "Sign out",
            },
          ],
        },
      },
      { id: "del", name: "Delete", className: "btn btn-danger" },
    ],
  };

@Component({
  selector: 'td-demo-td-button-bar',
  standalone: true,
  imports: [CommonModule, TdButtonBarComponent],
  templateUrl: './td-button-bar-demo.html',
  styleUrls: ['./td-button-bar-demo.css']
})
export class TdButtonBarDemoComponent {
  activeTab: 'text' | 'icon' | 'mixed' = 'text';

  inputJson = JSON.stringify(RAW_TEXT, null, 2);
  parseError = '';
  outputJson = '// Click a button to see output here…';

  parsed: any = RAW_TEXT;

  get model(): ButtonBarObject {
    try {
      return new ButtonBarObject(this.parsed);
    } catch {
      return new ButtonBarObject({ type: 'TdButton', buttons: [{ id: 'fix', name: 'Fix JSON', className: 'btn btn-secondary', disabled: true }] } as any);
    }
  }

  private currentRaw(): any {
    if (this.activeTab === 'icon') return RAW_ICON;
    if (this.activeTab === 'mixed') return RAW_MIXED;
    return RAW_TEXT;
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
    const raw = this.currentRaw();
    this.parsed = raw;
    this.inputJson = JSON.stringify(raw, null, 2);
    this.parseError = '';
    this.outputJson = '// Click a button to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.parsed = obj;
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parseError = '';
    } catch {}
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }
}
