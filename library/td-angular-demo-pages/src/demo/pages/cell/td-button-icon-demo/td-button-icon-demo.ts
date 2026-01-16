// src/demo/pages/tdbuttonicon/tdbuttonicon.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdButtonIconComponent } from '../../../../lib/components/cell/td-button-icon/td-button-icon';
import { ButtonIconObject } from '../../../../lib/components/cell/td-button-icon/td-button-icon.model';

const DEFAULT_RAW: any = {
  id: "tdBtnIcon01", // optional; stable via useDomId() if omitted
  name: "Sync", // remove this to see icon-only (event will use `title`)
  title: "Sync", // used as fallback event name when `name` is missing (also tooltip)
  className: "btn btn-primary",
  active: "active",
  disabled: false,
  ariaLabel: "Sync now",
  tabIndex: 0,

  // ButtonIcon -> AlloyIcon (icon wrapper styling supported)
  icon: {
    iconClass: "fa-solid fa-rotate",
    className:
      "d-inline-flex align-items-center justify-content-center bg-light rounded-circle p-2",
  },
};
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-button-icon',
  standalone: true,
  imports: [CommonModule, TdButtonIconComponent],
  templateUrl: './td-button-icon-demo.html',
  styleUrls: ['./td-button-icon-demo.css']
})
export class TdButtonIconDemoComponent {
  title = 'TdButtonIcon';
  usageSnippet = `<td-button-icon [buttonIcon]="model" (output)="handleOutput($event)"></td-button-icon>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): ButtonIconObject {
    try {
      return new ButtonIconObject(this.parsed);
    } catch (e: any) {
      return new ButtonIconObject({ name: 'Invalid', className: 'btn btn-secondary', icon: { iconClass: 'fa-solid fa-wrench' } });
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

}

function to_pascal(s: string): string {
  return s.split('-').map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '').join('');
}
