// demo-input.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdInput } from '../../../lib/cell/td-input/td-input';
import { TdInputModel, TdInputConfig, TdInputType } from '../../../lib/cell/td-input/td-input.model';
import { OutputObject } from '../../../lib/shared/output-object';

type DemoMap = Record<string, TdInputConfig>;

const BASE_TYPES: DemoMap = {
  text: {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    layout: 'text',
    placeholder: 'Enter your name',
    className: 'form-control',
  },

  email: {
    name: 'email',
    label: 'Email',
    type: 'email',
    layout: 'text',
    placeholder: 'Enter your email',
    className: 'form-control',
  },

  password: {
    name: 'password',
    label: 'Password',
    type: 'password',
    layout: 'text',
    placeholder: 'Enter your password',
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
    className: 'form-control',
  },

  checkbox: {
    name: 'interests',
    label: 'Interests',
    type: 'checkbox',
    layout: 'text',
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
    className: 'form-check-input',
    value: true,
  },

  select: {
    name: 'role',
    label: 'Role',
    type: 'select',
    layout: 'text',
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
    className: 'form-control',
  },

  'datetime-local': {
    name: 'appointmentTime',
    label: 'Appointment Date & Time',
    type: 'datetime-local',
    layout: 'text',
    className: 'form-control',
    min: '2024-01-01T00:00',
    max: '2025-12-31T23:59',
  },

  time: {
    name: 'preferredTime',
    label: 'Preferred Time',
    type: 'time',
    layout: 'text',
    className: 'form-control',
    min: '09:00',
    max: '17:00',
  },

  radio: {
    name: 'gender',
    label: 'Gender',
    type: 'radio',
    layout: 'text',
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
    className: 'form-control',
    accept: '.pdf,.png,.jpg,.jpeg',
    multiple: true,
  },

  canvas: {
    name: 'signature',
    label: 'Signature (canvas)',
    type: 'canvas',
    layout: 'text',
    width: 600,
    height: 220,
    canvasStrokeWidth: 2,
  },
};

type ValidationPresetKey =
  | 'none'
  | 'required'
  | 'minMaxLength'
  | 'regexEmail'
  | 'regexOnlyCaps'
  | 'passwordStrength'
  | 'customValidator';

const VALIDATION_PRESETS: Record<ValidationPresetKey, Partial<TdInputConfig>> = {
  none: {},

  required: { required: true },

  minMaxLength: { required: true, minLength: 3, maxLength: 10 },

  regexEmail: { required: true, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },

  regexOnlyCaps: { required: true, pattern: '^[A-Z]+$' },

  passwordStrength: { required: true, passwordStrength: true },

  customValidator: {
    required: true,
    validators: [
      (v: unknown) => {
        const s = String(v ?? '').trim();
        if (!s.startsWith('@')) return 'Value must start with @';
        if (s.length < 4) return 'Value must be at least 4 characters';
        return null;
      },
    ],
  },
};

function mergeTypeWithValidation(typeCfg: TdInputConfig, preset: ValidationPresetKey): TdInputConfig {
  const p = VALIDATION_PRESETS[preset] || {};
  const next: TdInputConfig = { ...typeCfg, ...p };

  const t = next.type as TdInputType;

  // Only apply string-based validations to string-like inputs
  const isStringLike =
    t === 'text' ||
    t === 'email' ||
    t === 'password' ||
    t === 'textarea' ||
    t === 'date' ||
    t === 'datetime-local' ||
    t === 'time';

  if (!isStringLike) {
    delete (next as any).minLength;
    delete (next as any).maxLength;
    delete (next as any).pattern;
    delete (next as any).passwordStrength;
    delete (next as any).validators;
  }

  // Reset default values on every switch to prevent carry-over between types
  if (t === 'checkbox' || t === 'multiselect') next.value = Array.isArray(typeCfg.value) ? typeCfg.value : [];
  else if (t === 'switch') next.value = typeof typeCfg.value === 'boolean' ? typeCfg.value : false;
  else next.value = typeof typeCfg.value !== 'undefined' ? typeCfg.value : '';

  return next;
}

const TYPE_TABS = Object.keys(BASE_TYPES);
const VALIDATION_TABS: ValidationPresetKey[] = [
  'none',
  'required',
  'minMaxLength',
  'regexEmail',
  'regexOnlyCaps',
  'passwordStrength',
  'customValidator',
];

@Component({
  selector: 'demo-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput],
  templateUrl: './demo-input.html',
  styleUrl: './demo-input.css',
})
export class DemoInput {
  typeTabs = TYPE_TABS;
  validationTabs = VALIDATION_TABS;

  typeTab = signal(TYPE_TABS[0]);
  validationTab = signal<ValidationPresetKey>('none');

  inputJson = signal(JSON.stringify(mergeTypeWithValidation(BASE_TYPES[this.typeTab()], this.validationTab()), null, 2));

  outputJson = signal('// Interact with the field (type, blur, select, etc.)');
  parseError = signal('');
  parsed = signal<TdInputConfig>(mergeTypeWithValidation(BASE_TYPES[this.typeTab()], this.validationTab()));

  inputKey = signal(0);

  model = computed(() => {
    this.inputKey();
    try {
      return new TdInputModel(this.parsed());
    } catch (e: any) {
      this.parseError.set(String(e?.message || e));
      const fallback = mergeTypeWithValidation(BASE_TYPES[this.typeTab()], this.validationTab());
      return new TdInputModel(fallback);
    }
  });

  private setConfig(cfg: TdInputConfig): void {
    this.inputJson.set(JSON.stringify(cfg, null, 2));
    this.parsed.set(cfg);
    this.parseError.set('');
    this.outputJson.set('// Interact with the field (type, blur, select, etc.)');
    this.inputKey.update(k => k + 1);
  }

  selectType(next: string): void {
    this.typeTab.set(next);
    const cfg = mergeTypeWithValidation(BASE_TYPES[next], this.validationTab());
    this.setConfig(cfg);
  }

  selectValidation(next: ValidationPresetKey): void {
    this.validationTab.set(next);
    const cfg = mergeTypeWithValidation(BASE_TYPES[this.typeTab()], next);
    this.setConfig(cfg);
  }

  handleInputChange(val: string): void {
    try {
      const raw = JSON.parse(val || '{}') as TdInputConfig;
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

  handleFormat(): void {
    try {
      const parsed = JSON.parse(this.inputJson());
      this.inputJson.set(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore
    }
  }
}
