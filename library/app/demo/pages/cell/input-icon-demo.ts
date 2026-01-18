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
    layout: 'icon',
    placeholder: 'Enter your name',
    required: true,
    icon: { iconClass: 'fa-solid fa-user' },
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },
  email: {
    name: 'email',
    label: 'Email',
    type: 'email',
    layout: 'icon',
    placeholder: 'Enter your email',
    required: true,
    icon: { iconClass: 'fa-solid fa-envelope' },
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },
  password: {
    name: 'password',
    label: 'Password',
    type: 'password',
    layout: 'icon',
    placeholder: 'Enter your password',
    required: true,
    icon: { iconClass: 'fa-solid fa-lock' },
    passwordStrength: true,
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },
  search: {
    name: 'search',
    label: 'Search',
    type: 'text',
    layout: 'icon',
    placeholder: 'Search...',
    icon: { iconClass: 'fa-solid fa-magnifying-glass' },
    className: 'form-control',
    iconGroupClass: 'bg-light border-0',
  },
  phone: {
    name: 'phone',
    label: 'Phone Number',
    type: 'text',
    layout: 'icon',
    placeholder: '+1 (555) 123-4567',
    required: true,
    icon: { iconClass: 'fa-solid fa-phone' },
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },
  website: {
    name: 'website',
    label: 'Website URL',
    type: 'text',
    layout: 'icon',
    placeholder: 'https://example.com',
    icon: { iconClass: 'fa-solid fa-globe' },
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },
  amount: {
    name: 'amount',
    label: 'Amount',
    type: 'number',
    layout: 'icon',
    placeholder: '0.00',
    min: 0,
    icon: { iconClass: 'fa-solid fa-dollar-sign' },
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },
  date: {
    name: 'dob',
    label: 'Date of Birth',
    type: 'date',
    layout: 'icon',
    required: true,
    icon: { iconClass: 'fa-solid fa-calendar' },
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },
  file: {
    name: 'attachments',
    label: 'Upload Files',
    type: 'file',
    layout: 'icon',
    required: true,
    icon: { iconClass: 'fa-solid fa-paperclip' },
    className: 'form-control',
    iconGroupClass: 'bg-light',
    accept: '.pdf,.png,.jpg,.jpeg',
    multiple: true,
  },
  multiselect: {
    name: 'tags',
    label: 'Tags',
    type: 'multiselect',
    layout: 'icon',
    icon: { iconClass: 'fa-solid fa-tags' },
    className: 'form-control',
    searchable: true,
    placeholder: 'Select tags...',
    options: [
      { value: 'urgent', label: 'Urgent' },
      { value: 'important', label: 'Important' },
      { value: 'review', label: 'Review' },
      { value: 'approved', label: 'Approved' },
      { value: 'pending', label: 'Pending' },
    ],
  },
};

const TABS = Object.keys(DEFAULT_INPUTS);

@Component({
  selector: 'input-icon-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput],
  template: `
    <div class="container py-3">
      <h3 class="mb-4 text-center">TdInput (Icon Layout)</h3>

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
              <code>layout: "icon"</code> uses Bootstrap input-group with icon prefix.
              Requires an <code>icon</code> object with <code>iconClass</code>.
            </div>
            <div class="mt-1">
              Use <code>iconGroupClass</code> to customize the icon wrapper styling
              (appended to <code>"input-group-text"</code>).
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
export class InputIconDemo {
  tabs = TABS;
  tab = signal('text');
  inputJson = JSON.stringify(DEFAULT_INPUTS['text'], null, 2);
  outputJson = signal('// Interact with the field');
  parseError = signal('');
  parsed = signal<any>(DEFAULT_INPUTS['text']);
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
