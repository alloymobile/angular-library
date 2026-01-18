import { Component, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdButtonSubmit } from '../../../lib/td-button-submit/td-button-submit';
import { TdButtonSubmitModel } from '../../../lib/td-button-submit/td-button-submit.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_INPUT_OBJ = {
  id: 'btnSubmit01',
  name: 'Save',
  className: 'btn btn-success',
  disabled: false,
  loading: false,
  ariaLabel: 'Submit form',
  tabIndex: 0,
  icon: {
    iconClass: 'fa-solid fa-spinner fa-spin',
    className: 'd-inline-flex align-items-center justify-content-center',
  },
};

@Component({
  selector: 'button-submit-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdButtonSubmit],
  template: `
    <div class="container py-3">
      <h3 class="mb-3 text-center">TdButtonSubmit</h3>

      <!-- Row 1 — Usage snippet -->
      <div class="row mb-3">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>&lt;td-button-submit [model]="submitModel" (output)="handleOutput($event)"&gt;&lt;/td-button-submit&gt;</code>
          </pre>
        </div>
      </div>

      <!-- Row 2 — Live demo -->
      <div class="row mb-4">
        <div class="col-12 text-center">
          <form (submit)="$event.preventDefault()">
            <td-button-submit
              #btnRef
              [model]="model()"
              (output)="handleOutput($event)">
            </td-button-submit>
          </form>

          <div class="small text-secondary mt-2">
            Arms on: <code>mousedown</code>, <code>keydown</code> (<code>Enter</code>/<code>Space</code>),
            <code>click</code>. While armed/loading, the spinner icon is shown and the button is disabled
            until parent sets <code>loading:false</code> again.
          </div>
        </div>
      </div>

      <!-- Row 3 — JSON editor (left) / Output log (right) -->
      <div class="row g-3 align-items-stretch">
        <!-- LEFT PANEL -->
        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold">Input JSON (editable)</span>

            <div class="d-flex flex-wrap gap-2">
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                (click)="handleReset()"
                title="Restore defaults, clear output">
                Reset
              </button>

              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                (click)="handleFormat()"
                title="Prettify JSON">
                <i class="fa-solid fa-wand-magic-sparkles me-2" aria-hidden="true"></i>
                Format
              </button>

              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                (click)="triggerClick()"
                title="Programmatically click">
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
            <strong>Required:</strong> <code>name</code>, <code>icon.iconClass</code>.
            <strong>Optional:</strong> <code>id</code>, <code>className</code>, <code>disabled</code>,
            <code>loading</code>, <code>title</code>, <code>ariaLabel</code>, <code>tabIndex</code>.
            <br>
            <strong>Icon wrapper styling:</strong> use <code>icon.className</code> (applies to the icon's
            wrapping <code>&lt;span&gt;</code> inside <code>TdIcon</code>).
          </div>
        </div>

        <!-- RIGHT PANEL -->
        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-semibold">
              Output (from <code>output</code> callback)
            </span>

            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              (click)="outputJson.set('// Interact with the submit button to see OutputObject here…')">
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
            Only real events from <code>TdButtonSubmit</code> appear here.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ButtonSubmitDemo {
  @ViewChild('btnRef') btnRef!: TdButtonSubmit;

  inputJson = JSON.stringify(DEFAULT_INPUT_OBJ, null, 2);
  parseError = signal('');
  outputJson = signal('// Interact with the submit button to see OutputObject here…');
  parsed = signal<any>(DEFAULT_INPUT_OBJ);

  model = computed(() => {
    try {
      const safe = this.parsed() && typeof this.parsed() === 'object' ? this.parsed() : {};
      return new TdButtonSubmitModel(safe);
    } catch {
      return new TdButtonSubmitModel({
        name: 'Invalid',
        className: 'btn btn-secondary',
        disabled: true,
        loading: false,
        icon: {
          iconClass: 'fa-solid fa-triangle-exclamation',
          className: 'd-inline-flex align-items-center justify-content-center',
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
    this.outputJson.set('// Interact with the submit button to see OutputObject here…');
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
