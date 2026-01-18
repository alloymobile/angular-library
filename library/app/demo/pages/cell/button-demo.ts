import { Component, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdButton } from '../../../lib/td-button/td-button';
import { TdButtonModel } from '../../../lib/td-button/td-button.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_INPUT_OBJ = {
  id: 'tdBtn01',
  name: 'Primary',
  className: 'btn btn-primary',
  active: 'active',
  disabled: false,
  ariaLabel: 'Primary action',
  tabIndex: 0,
};

@Component({
  selector: 'button-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdButton],
  template: `
    <div class="container py-3">
      <h3 class="mb-3 text-center">TdButton</h3>

      <!-- Row 1 — Usage snippet -->
      <div class="row mb-3">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>&lt;td-button [model]="buttonModel" (output)="handleOutput($event)"&gt;&lt;/td-button&gt;</code>
          </pre>
        </div>
      </div>

      <!-- Row 2 — Live Button Preview -->
      <div class="row mb-4">
        <div class="col-12 text-center">
          <td-button #btnRef [model]="model()" (output)="handleOutput($event)"></td-button>
          <div class="small text-secondary mt-2">
            Tip: <strong>Only click emits</strong> via <code>output</code> as an
            <code>OutputObject</code> with <code>id</code>, <code>type</code>,
            <code>action</code>, <code>error</code> and a minimal
            <code>data</code> payload.
          </div>
        </div>
      </div>

      <!-- Row 3 — JSON in / JSON out -->
      <div class="row g-3 align-items-stretch">
        <!-- Left side: Input editor -->
        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold">Input JSON (editable)</span>
            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                (click)="handleReset()">
                Reset
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                (click)="handleFormat()"
                title="Format JSON">
                <i class="fa-solid fa-wand-magic-sparkles me-2" aria-hidden="true"></i>
                Format
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                (click)="triggerClick()"
                title="Programmatically click the TdButton">
                Trigger Click
              </button>
            </div>
          </div>

          <textarea
            class="form-control font-monospace"
            [class.is-invalid]="parseError()"
            rows="18"
            [(ngModel)]="inputJson"
            (ngModelChange)="handleInputChange($event)"
            spellcheck="false">
          </textarea>
          @if (parseError()) {
            <div class="invalid-feedback d-block mt-1">{{ parseError() }}</div>
          }

          <div class="form-text">
            Required: <code>name</code>. Optional: <code>id</code>,
            <code>className</code>, <code>active</code>, <code>disabled</code>,
            <code>title</code>, <code>ariaLabel</code>, <code>tabIndex</code>.
            If you omit <code>id</code>, the component will generate a stable one via
            <code>DomIdRef</code>.
          </div>
        </div>

        <!-- Right side: Output inspector -->
        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold">
              Output (from <code>output</code> callback)
            </span>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              (click)="outputJson.set('// cleared')">
              Clear
            </button>
          </div>

          <textarea
            class="form-control font-monospace"
            rows="18"
            [ngModel]="outputJson()"
            (ngModelChange)="outputJson.set($event)"
            spellcheck="false">
          </textarea>

          <div class="form-text">
            Shape:
            <pre class="mb-0 mt-1 small">{{outputShape}}</pre>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ButtonDemo {
  @ViewChild('btnRef') btnRef!: TdButton;

  inputJson = JSON.stringify(DEFAULT_INPUT_OBJ, null, 2);
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
    } catch {
      return new TdButtonModel({
        name: 'Invalid config',
        className: 'btn btn-secondary',
        disabled: true,
      });
    }
  });

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
    const payload = out && typeof out.toJSON === 'function' ? out.toJSON() : out;
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

  triggerClick(): void {
    this.btnRef?.click();
  }
}
