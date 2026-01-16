// src/demo/pages/tdbutton/tdbutton.ts

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdButtonComponent } from '../../../../lib/components/cell/td-button/td-button';
import { ButtonObject } from '../../../../lib/components/cell/td-button/td-button.model';

const DEFAULT_RAW: any = {
  id: "tdBtn01", // optional; stable via useDomId() if omitted
  name: "Primary",
  className: "btn btn-primary",
  active: "active",
  disabled: false,
  ariaLabel: "Primary action",
  tabIndex: 0,
};
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-button',
  standalone: true,
  imports: [CommonModule, TdButtonComponent],
  templateUrl: './td-button-demo.html',
  styleUrls: ['./td-button-demo.css']
})
export class TdButtonDemoComponent {
  title = 'TdButton';
  usageSnippet = `<td-button [button]="model" (output)="handleOutput($event)"></td-button>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  @ViewChild(TdButtonComponent) cmp?: TdButtonComponent;

  get model(): ButtonObject {
    try {
      return new ButtonObject(this.parsed);
    } catch (e: any) {
      return new ButtonObject({ name: "Invalid config", className: "btn btn-secondary", disabled: true });
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
    // programmatic click
    (this.cmp as any)?.onClick?.(new Event('click'));
  }

}

function to_pascal(s: string): string {
  return s.split('-').map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '').join('');
}
