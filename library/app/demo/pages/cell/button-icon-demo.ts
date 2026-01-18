import { Component, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdButtonIcon } from '../../../lib/td-button-icon/td-button-icon';
import { TdButtonIconModel } from '../../../lib/td-button-icon/td-button-icon.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_INPUT_OBJ = {
  id: 'tdBtnIcon01',
  name: 'Sync',
  title: 'Sync',
  className: 'btn btn-primary',
  active: 'active',
  disabled: false,
  ariaLabel: 'Sync now',
  tabIndex: 0,
  icon: {
    iconClass: 'fa-solid fa-rotate',
    className: 'd-inline-flex align-items-center justify-content-center bg-light rounded-circle p-2',
  },
};

@Component({
  selector: 'button-icon-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdButtonIcon],
  template: `
    <div class="container py-3">
      <h3 class="mb-3 text-center">TdButtonIcon</h3>

      <!-- Row 1 — Usage snippet -->
      <div class="row mb-3">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>&lt;td-button-icon [model]="buttonIconModel" (output)="handleOutput($event)"&gt;&lt;/td-button-icon&gt;</code>
          </pre>
        </div>
      </div>

      <!-- Row 2 — Live ButtonIcon Preview -->
      <div class="row mb-4">
        <div class="col-12 text-center">
          <td-button-icon #btnRef [model]="model()" (output)="handleOutput($event)"></td-button-icon>
          <div class="small text-secondary mt-2">
            If <code>name</code> is missing ⇒ icon-only button (no visible label).
            On click, output sends <code>data.name</code> as
            <code>name</code> if present, otherwise <code>title</code>.
            <strong>Only click emits</strong> an <code>OutputObject</code>:
            <code>{{ '{ id, type: "button-icon", action: "click", error, data: { name } }' }}</code>.
          </div>
        </div>
      </div>

      <!-- Row 3 — JSON in / JSON out -->
      <div class="row g-3 align-items-stretch">
        <!-- Left: Input editor -->
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
                title="Programmatically click the TdButtonIcon">
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
            Required: <code>icon.iconClass</code>. Optional: <code>name</code>,
            <code>id</code>, <code>className</code>, <code>active</code>,
            <code>disabled</code>, <code>title</code>, <code>ariaLabel</code>,
            <code>tabIndex</code>.
            <br>
            For icon-only buttons, set <code>title</code> so the click event has a
            reliable identifier (used when <code>name</code> is missing).
            <br>
            Icon wrapper styling: <code>icon.className</code> (applied to the
            wrapper <code>&lt;span&gt;</code> inside <code>TdIcon</code>).
          </div>
        </div>

        <!-- Right: Output inspector -->
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
            Output is an <code>OutputObject</code> (only on click):
            <br>
            <code>{{ '{ id, type, action, error, data: { name } }' }}</code>
            <br>
            Where <code>data.name</code> = <code>name</code> (if provided) else <code>title</code>.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ButtonIconDemo {
  @ViewChild('btnRef') btnRef!: TdButtonIcon;

  inputJson = JSON.stringify(DEFAULT_INPUT_OBJ, null, 2);
  parseError = signal('');
  outputJson = signal('// Click the button to see output here…');
  parsed = signal<any>(DEFAULT_INPUT_OBJ);

  model = computed(() => {
    try {
      const safe = this.parsed() && typeof this.parsed() === 'object' ? this.parsed() : {};
      return new TdButtonIconModel(safe);
    } catch {
      return new TdButtonIconModel({
        name: 'Invalid config',
        className: 'btn btn-secondary',
        disabled: true,
        icon: {
          iconClass: 'fa-solid fa-triangle-exclamation',
          className: 'd-inline-flex align-items-center justify-content-center bg-light rounded-circle p-2',
        },
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
