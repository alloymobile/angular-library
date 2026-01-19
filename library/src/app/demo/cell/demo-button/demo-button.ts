// src/app/demo/shell/demo-button/demo-button.ts
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdButton } from '../../../lib/cell/td-button/td-button';
import { TdButtonModel } from '../../../lib/cell/td-button/td-button.model';
import { OutputObject } from '../../../lib/share/output-object';

const DEFAULT_INPUT_OBJ = {
  id: 'tdBtn01',
  name: 'Primary',
  className: 'btn btn-primary',
  isActive: false,
  active: 'active',
  disabled: false,
  ariaLabel: 'Primary action',
  tabIndex: 0,
};

@Component({
  selector: 'demo-button',
  standalone: true,
  imports: [CommonModule, FormsModule, TdButton],
  templateUrl: './demo-button.html',
  styleUrl: './demo-button.css',
})
export class DemoButton implements OnInit {
  inputJson = '';
  parseError = signal('');
  outputJson = signal('// Click the button to see output here…');
  parsed = signal<any>(DEFAULT_INPUT_OBJ);

  outputShape = `{
  "id": "tdBtn01",
  "type": "button",
  "action": "click",
  "error": false,
  "data": {
    "name": "Primary"
  }
}`;

  model = computed(() => {
    try {
      return new TdButtonModel(this.parsed());
    } catch (err: any) {
      return new TdButtonModel({
        name: 'Invalid config',
        className: 'btn btn-secondary',
        disabled: true,
        ariaLabel: 'Invalid config',
        title: err?.message || 'Invalid config',
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
    this.outputJson.set('// Click the button to see output here…');
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

  toggleActive(): void {
    const current = this.parsed();
    this.parsed.set({ ...current, isActive: !current?.isActive });
    this.inputJson = JSON.stringify(this.parsed(), null, 2);
    this.parseError.set('');
  }
}
