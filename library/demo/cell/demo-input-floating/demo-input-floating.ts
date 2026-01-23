// demo-input-floating.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdInput } from '../../../lib/cell/td-input/td-input';
import { TdInputModel } from '../../../lib/cell/td-input/td-input.model';
import { TdIconModel } from '../../../lib/cell/td-icon/td-icon.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_INPUTS: Record<string, any> = {
  name: {
    name: 'name',
    label: 'Name',
    type: 'text',
    layout: 'floating',
    placeholder: 'Enter your name',
    required: true,
    icon: new TdIconModel({ iconClass: 'fa-solid fa-user' }),
    className: 'form-control',
  },

  email: {
    name: 'email',
    label: 'Email',
    type: 'email',
    layout: 'floating',
    placeholder: 'Enter your email',
    required: true,
    icon: new TdIconModel({ iconClass: 'fa-solid fa-envelope' }),
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    className: 'form-control',
  },

  password: {
    name: 'password',
    label: 'Password',
    type: 'password',
    layout: 'floating',
    required: true,
    icon: new TdIconModel({ iconClass: 'fa-solid fa-lock' }),
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
    icon: new TdIconModel({ iconClass: 'fa-solid fa-hashtag' }),
    className: 'form-control',
  },

  dob: {
    name: 'dob',
    label: 'Date of Birth',
    type: 'date',
    layout: 'floating',
    required: true,
    icon: new TdIconModel({ iconClass: 'fa-solid fa-calendar' }),
    className: 'form-control',
  },

  'datetime-local': {
    name: 'appointmentTime',
    label: 'Appointment Date & Time',
    type: 'datetime-local',
    layout: 'floating',
    required: true,
    icon: new TdIconModel({ iconClass: 'fa-solid fa-calendar-check' }),
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
    icon: new TdIconModel({ iconClass: 'fa-solid fa-clock' }),
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
    icon: new TdIconModel({ iconClass: 'fa-solid fa-globe' }),
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
    icon: new TdIconModel({ iconClass: 'fa-solid fa-pen' }),
    className: 'form-control',
  },
};

const TABS = Object.keys(DEFAULT_INPUTS);

@Component({
  selector: 'demo-input-floating',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput],
  templateUrl: './demo-input-floating.html',
  styleUrl: './demo-input-floating.css',
})
export class DemoInputFloating {
  tabs = TABS;
  tab = signal(TABS[0]);

  inputJson = signal(JSON.stringify(DEFAULT_INPUTS[TABS[0]], null, 2));
  outputJson = signal('// Interact with the field');
  parseError = signal('');

  parsed = signal<any>(DEFAULT_INPUTS[TABS[0]]);
  inputKey = signal(0);

  model = computed(() => {
    this.inputKey();
    try {
      return new TdInputModel(this.parsed());
    } catch (e: any) {
      this.parseError.set(String(e?.message || e));
      return new TdInputModel(DEFAULT_INPUTS[this.tab()]);
    }
  });

  switchTab(nextTab: string): void {
    const cfg = DEFAULT_INPUTS[nextTab];
    this.tab.set(nextTab);
    this.inputJson.set(JSON.stringify(cfg, null, 2));
    this.parsed.set(cfg);
    this.outputJson.set('// Interact with the field');
    this.parseError.set('');
    this.inputKey.update(k => k + 1);
  }

  handleInputChange(val: string): void {
    try {
      const raw = JSON.parse(val || '{}') as any;
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
