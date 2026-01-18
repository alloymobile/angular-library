import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdInput } from '../../../lib/td-input/td-input';
import { TdInputModel } from '../../../lib/td-input/td-input.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_INPUTS: Record<string, any> = {
  name: {
    name: 'name',
    label: 'Name',
    type: 'text',
    layout: 'floating',
    placeholder: 'Enter your name',
    required: true,
    icon: { iconClass: 'fa-solid fa-user' },
    className: 'form-control',
  },
  email: {
    name: 'email',
    label: 'Email',
    type: 'email',
    layout: 'floating',
    placeholder: 'Enter your email',
    required: true,
    icon: { iconClass: 'fa-solid fa-envelope' },
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    className: 'form-control',
  },
  password: {
    name: 'password',
    label: 'Password',
    type: 'password',
    layout: 'floating',
    required: true,
    icon: { iconClass: 'fa-solid fa-lock' },
    passwordStrength: true,
    placeholder: 'Enter a strong password',
    className: 'form-control',
  },
  age: {
    name: 'age',
    label: 'Age',
    type: 'number',
    layout: 'floating',
    placeholder: 'Enter your age',
    required: true,
    min: 0,
    icon: { iconClass: 'fa-solid fa-hashtag' },
    className: 'form-control',
  },
  dob: {
    name: 'dob',
    label: 'Date of Birth',
    type: 'date',
    layout: 'floating',
    required: true,
    icon: { iconClass: 'fa-solid fa-calendar' },
    className: 'form-control',
  },
  'datetime-local': {
    name: 'appointmentTime',
    label: 'Appointment Date & Time',
    type: 'datetime-local',
    layout: 'floating',
    required: true,
    icon: { iconClass: 'fa-solid fa-calendar-check' },
    className: 'form-control',
    min: '2024-01-01T00:00',
    max: '2025-12-31T23:59',
  },
  time: {
    name: 'preferredTime',
    label: 'Preferred Time',
    type: 'time',
    layout: 'floating',
    required: true,
    icon: { iconClass: 'fa-solid fa-clock' },
    className: 'form-control',
    min: '09:00',
    max: '17:00',
  },
  select: {
    name: 'country',
    label: 'Country',
    type: 'select',
    layout: 'floating',
    required: true,
    icon: { iconClass: 'fa-solid fa-globe' },
    className: 'form-select',
    options: [
      { value: '', label: 'Select country' },
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'au', label: 'Australia' },
    ],
  },
  textarea: {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    layout: 'floating',
    placeholder: 'Tell us about yourself...',
    required: true,
    minLength: 10,
    icon: { iconClass: 'fa-solid fa-pen' },
    className: 'form-control',
  },
};

const TABS = Object.keys(DEFAULT_INPUTS);

@Component({
  selector: 'input-floating-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput],
  template: `
    <div class="container py-3">
      <h3 class="mb-4 text-center">TdInput (Floating Layout)</h3>

      <ul class="nav nav-underline nav-fill mb-3 flex-wrap">
        @for (key of tabs; track key) {
          <li class="nav-item">
            <button
              class="nav-link"
              [class.active]="key === tab()"
              (click)="switchTab(key)"
              type="button">
              {{ key }}
            </button>
          </li>
        }
      </ul>

      <div class="row g-3 mb-3">
        <div class="col-12 text-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>&lt;td-input [model]="inputModel" (output)="handleOutput($event)"&gt;&lt;/td-input&gt;</code>
          </pre>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
          <td-input
            [model]="model()"
            (output)="handleOutput($event)">
          </td-input>

          <div class="small text-secondary mt-2 text-center">
            <div>
              <code>layout: "floating"</code> uses Bootstrap floating labels with icon prefix.
              Requires an <code>icon</code> object with <code>iconClass</code>.
            </div>
            <div class="mt-1">
              Note: Canvas and File inputs don't work well with floating labels.
              Use <code>layout: "icon"</code> or <code>layout: "text"</code> for those.
            </div>
          </div>
        </div>
      </div>

      <!-- JSON editor (left) and callback output (right) -->
      <div class="row g-3 align-items-stretch">
        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="fw-semibold mb-0">Input JSON (editable)</label>

            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              (click)="handleFormat()"
              title="Format JSON">
              <i class="fa-solid fa-wand-magic-sparkles me-2" aria-hidden="true"></i>
              Format
            </button>
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
        </div>

        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="fw-semibold mb-0">
              Output (from <code>output</code> callback)
            </label>

            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              (click)="outputJson.set('// Interact with the field')">
              Clear
            </button>
          </div>

          <textarea
            class="form-control font-monospace bg-light border"
            rows="18"
            [ngModel]="outputJson()"
            readonly
            spellcheck="false">
          </textarea>
        </div>
      </div>
    </div>
  `,
})
export class InputFloatingDemo {
  tabs = TABS;
  tab = signal('name');
  inputJson = JSON.stringify(DEFAULT_INPUTS['name'], null, 2);
  outputJson = signal('// Interact with the field');
  parseError = signal('');
  parsed = signal<any>(DEFAULT_INPUTS['name']);
  inputKey = signal(0);

  model = computed(() => {
    this.inputKey();
    try {
      return new TdInputModel(this.parsed());
    } catch {
      return new TdInputModel(DEFAULT_INPUTS[this.tab()]);
    }
  });

  handleInputChange(val: string): void {
    try {
      const raw = JSON.parse(val || '{}');
      this.parsed.set(raw);
      this.parseError.set('');
    } catch (e: any) {
      this.parseError.set(String(e?.message || e));
    }
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson.set(JSON.stringify(payload, null, 2));
  }

  switchTab(nextTab: string): void {
    const freshConfig = DEFAULT_INPUTS[nextTab];
    this.tab.set(nextTab);
    this.inputJson = JSON.stringify(freshConfig, null, 2);
    this.parsed.set(freshConfig);
    this.outputJson.set('// Interact with the field');
    this.parseError.set('');
    this.inputKey.update(k => k + 1);
  }

  handleFormat(): void {
    try {
      const parsed = JSON.parse(this.inputJson);
      this.inputJson = JSON.stringify(parsed, null, 2);
    } catch {
      // ignore
    }
  }
}
