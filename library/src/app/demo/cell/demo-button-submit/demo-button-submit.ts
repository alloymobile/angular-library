import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdButtonSubmit } from '../../../lib/cell/td-button-submit/td-button-submit';
import { TdButtonSubmitModel } from '../../../lib/cell/td-button-submit/td-button-submit.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_INPUT_OBJ = {
  id: 'btnSubmit01',
  name: 'Save',
  className: 'btn btn-success',
  isActive: false,
  active: 'active',
  disabled: false,
  loading: false,
  title: 'Save changes',
  ariaLabel: 'Submit form',
  tabIndex: 0,
  icon: {
    iconClass: 'fa-solid fa-spinner',
    className: 'd-inline-flex align-items-center justify-content-center',
  },
};

@Component({
  selector: 'demo-button-submit',
  standalone: true,
  imports: [CommonModule, FormsModule, TdButtonSubmit],
  templateUrl: './demo-button-submit.html',
  styleUrl: './demo-button-submit.css',
})
export class DemoButtonSubmit implements OnInit {
  inputJson = '';
  parseError = signal('');
  outputJson = signal('// Click the submit button to see OutputObject here…');
  parsed = signal<any>(DEFAULT_INPUT_OBJ);

  outputShape = `{
  "id": "btn-submit-1",
  "type": "button-submit",
  "action": "click",
  "error": false,
  "data": {
    "name": "Save"
  }
}`;

  model = computed(() => {
    try {
      const safe = this.parsed() && typeof this.parsed() === 'object' ? this.parsed() : {};
      return new TdButtonSubmitModel(safe);
    } catch (err: any) {
      return new TdButtonSubmitModel({
        name: 'Invalid config',
        className: 'btn btn-secondary',
        disabled: true,
        loading: false,
        ariaLabel: 'Invalid config',
        icon: 'fa-solid fa-triangle-exclamation',
      });
    }
  });

  ngOnInit(): void {
    this.inputJson = JSON.stringify(DEFAULT_INPUT_OBJ, null, 2);
  }

  handleInputChange(val: string): void {
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed.set(obj);
      this.parseError.set('');
    } catch (err: any) {
      this.parseError.set(err.message || 'Invalid JSON.');
    }
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.outputJson.set(JSON.stringify(payload, null, 2));
  }

  handleReset(): void {
    this.inputJson = JSON.stringify(DEFAULT_INPUT_OBJ, null, 2);
    this.parsed.set(DEFAULT_INPUT_OBJ);
    this.outputJson.set('// Click the submit button to see OutputObject here…');
    this.parseError.set('');
  }

  handleFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson);
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parsed.set(obj);
      this.parseError.set('');
    } catch {
      // ignore
    }
  }

  clearOutput(): void {
    this.outputJson.set('// cleared');
  }

  // --- Fake API controls (NO timers) ---
  apiStart(): void {
    const current = this.parsed();
    const next = { ...(current || {}), loading: true };
    this.parsed.set(next);
    this.inputJson = JSON.stringify(next, null, 2);
    this.parseError.set('');
  }

  apiDone(): void {
    const current = this.parsed();
    const next = { ...(current || {}), loading: false };
    this.parsed.set(next);
    this.inputJson = JSON.stringify(next, null, 2);
    this.parseError.set('');
  }

  toggleDisabled(): void {
    const current = this.parsed();
    const next = { ...(current || {}), disabled: !current?.disabled };
    this.parsed.set(next);
    this.inputJson = JSON.stringify(next, null, 2);
    this.parseError.set('');
  }

  toggleActive(): void {
    const current = this.parsed();
    const next = { ...(current || {}), isActive: !current?.isActive };
    this.parsed.set(next);
    this.inputJson = JSON.stringify(next, null, 2);
    this.parseError.set('');
  }
}
