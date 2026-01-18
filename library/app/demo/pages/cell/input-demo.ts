import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdInput } from '../../../lib/td-input/td-input';
import { TdInputModel } from '../../../lib/td-input/td-input.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_INPUTS: Record<string, any> = {
  text: {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    layout: 'text',
    placeholder: 'Enter your name',
    required: true,
    className: 'form-control',
  },

  email: {
    name: 'email',
    label: 'Email',
    type: 'email',
    layout: 'text',
    placeholder: 'Enter your email',
    required: true,
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    className: 'form-control',
  },

  password: {
    name: 'password',
    label: 'Password',
    type: 'password',
    layout: 'text',
    placeholder: 'Enter your password',
    required: true,
    passwordStrength: true,
    className: 'form-control',
  },

  number: {
    name: 'age',
    label: 'Age',
    type: 'number',
    layout: 'text',
    placeholder: 'Age in years',
    min: 18,
    className: 'form-control',
  },

  textarea: {
    name: 'bio',
    label: 'Bio',
    type: 'textarea',
    layout: 'text',
    placeholder: 'Tell us about yourself...',
    required: true,
    minLength: 10,
    className: 'form-control',
  },

  checkbox: {
    name: 'interests',
    label: 'Interests',
    type: 'checkbox',
    layout: 'text',
    required: true,
    className: 'form-check-input',
    options: [
      { value: 'news', label: 'News' },
      { value: 'updates', label: 'Product Updates' },
      { value: 'offers', label: 'Special Offers' },
    ],
  },

  switch: {
    name: 'isActive',
    label: 'Active',
    type: 'switch',
    layout: 'text',
    required: false,
    className: 'form-check-input',
    value: true,
  },

  select: {
    name: 'role',
    label: 'Role',
    type: 'select',
    layout: 'text',
    required: true,
    className: 'form-select',
    options: [
      { value: '', label: 'Select role' },
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
      { value: 'guest', label: 'Guest' },
    ],
  },

  multiselect: {
    name: 'categories',
    label: 'Categories',
    type: 'multiselect',
    layout: 'text',
    required: true,
    className: 'form-control',
    searchable: true,
    placeholder: 'Type to search categories...',
    options: [
      { value: 'cat-001', label: 'Concrete Pipes', slug: 'concrete-pipes' },
      { value: 'cat-002', label: 'Precast Slabs', slug: 'precast-slabs' },
      { value: 'cat-003', label: 'Rebar', slug: 'rebar' },
      { value: 'cat-004', label: 'Cement Products', slug: 'cement-products' },
      { value: 'cat-005', label: 'Aggregates', slug: 'aggregates' },
      { value: 'cat-006', label: 'Steel & Wire', slug: 'steel-wire' },
    ],
    value: ['cat-003'],
  },

  date: {
    name: 'dob',
    label: 'Date of Birth',
    type: 'date',
    layout: 'text',
    required: true,
    className: 'form-control',
  },

  'datetime-local': {
    name: 'appointmentTime',
    label: 'Appointment Date & Time',
    type: 'datetime-local',
    layout: 'text',
    required: true,
    className: 'form-control',
    min: '2024-01-01T00:00',
    max: '2025-12-31T23:59',
  },

  time: {
    name: 'preferredTime',
    label: 'Preferred Time',
    type: 'time',
    layout: 'text',
    required: true,
    className: 'form-control',
    min: '09:00',
    max: '17:00',
  },

  radio: {
    name: 'gender',
    label: 'Gender',
    type: 'radio',
    layout: 'text',
    required: true,
    className: 'form-check-input',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
  },

  file: {
    name: 'attachments',
    label: 'Upload Files (multi)',
    type: 'file',
    layout: 'text',
    required: true,
    className: 'form-control',
    accept: '.pdf,.png,.jpg,.jpeg',
    multiple: true,
  },

  canvas: {
    name: 'signature',
    label: 'Signature (canvas)',
    type: 'canvas',
    layout: 'text',
    required: true,
    width: 600,
    height: 220,
    canvasStrokeWidth: 2,
  },
};

const TABS = Object.keys(DEFAULT_INPUTS);

@Component({
  selector: 'input-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput],
  template: `
    <div class="container py-3">
      <h3 class="mb-4 text-center">TdInput</h3>

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
              Try editing the JSON on the left: remove <code>required</code>,
              change <code>minLength</code>, tweak <code>pattern</code>, etc.
            </div>

            @if (tab() === 'multiselect') {
              <div class="mt-1">
                Multiselect (searchable) emits <code>data.value</code> as a
                <strong>string[]</strong> (array of selected <code>value</code>s),
                same as checkbox groups.
              </div>
            }

            <div>
              Errors announce with <code>aria-live="polite"</code> after blur.
            </div>

            <div class="mt-1">
              Tip: You can set an explicit <code>id</code> in the JSON for a
              predictable DOM id. If omitted, TdInput generates a stable id
              using <code>DomIdRef</code>.
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
              (click)="outputJson.set('// Interact with the field (type, blur, select, etc.)')">
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

          <div class="form-text">
            For <code>type: "multiselect"</code>,
            <code>data.value</code> will be a <code>string[]</code> of selected values.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class InputDemo {
  tabs = TABS;
  tab = signal('text');
  inputJson = JSON.stringify(DEFAULT_INPUTS['text'], null, 2);
  outputJson = signal('// Interact with the field (type, blur, select, etc.)');
  parseError = signal('');
  parsed = signal<any>(DEFAULT_INPUTS['text']);

  // Unique key to force component recreation on tab switch
  inputKey = signal(0);

  model = computed(() => {
    // Access inputKey to trigger recomputation
    this.inputKey();
    try {
      const raw = this.parsed();
      return new TdInputModel(raw);
    } catch (e: any) {
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
    this.outputJson.set('// Interact with the field (type, blur, select, etc.)');
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