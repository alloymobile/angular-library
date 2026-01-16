// src/demo/pages/tdbuttonsubmit/tdbuttonsubmit.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdButtonSubmitComponent } from '../../../../lib/components/cell/td-button-submit/td-button-submit';
import { ButtonSubmitObject } from '../../../../lib/components/cell/td-button-submit/td-button-submit.model';

const DEFAULT_RAW: any = {
  id: "btnSubmit01",
  name: "Save",
  className: "btn btn-success",
  disabled: false,
  loading: false,
  ariaLabel: "Submit form",
  tabIndex: 0,
  icon: {
    iconClass: "fa-solid fa-spinner fa-spin",
    // NEW: AlloyIcon now supports wrapper styling via icon.className (span wrapper)
    className: "d-inline-flex align-items-center justify-content-center",
  },
};
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-button-submit',
  standalone: true,
  imports: [CommonModule, TdButtonSubmitComponent],
  templateUrl: './td-button-submit-demo.html',
  styleUrls: ['./td-button-submit-demo.css']
})
export class TdButtonSubmitDemoComponent {
  title = 'TdButtonSubmit';
  usageSnippet = `<td-button-submit [buttonSubmit]="model" (output)="handleOutput($event)"></td-button-submit>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): ButtonSubmitObject {
    try {
      return new ButtonSubmitObject(this.parsed);
    } catch (e: any) {
      return new ButtonSubmitObject({ name: 'Submit', className: 'btn btn-secondary', disabled: true });
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
