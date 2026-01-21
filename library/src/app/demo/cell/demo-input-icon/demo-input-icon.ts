// demo-input-icon.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdInput } from '../../../lib/cell/td-input/td-input';
import { TdInputModel } from '../../../lib/cell/td-input/td-input.model';
import { TdIconModel } from '../../../lib/cell/td-icon/td-icon.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_INPUTS: Record<string, any> = {
  text: {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    layout: 'icon',
    placeholder: 'Enter your name',
    required: true,
    icon: new TdIconModel({ iconClass: 'fa-solid fa-user' }),
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
    icon: new TdIconModel({ iconClass: 'fa-solid fa-envelope' }),
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
    icon: new TdIconModel({ iconClass: 'fa-solid fa-lock' }),
    passwordStrength: true,
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },

  number: {
    name: 'amount',
    label: 'Amount',
    type: 'number',
    layout: 'icon',
    placeholder: '0.00',
    min: 0,
    icon: new TdIconModel({ iconClass: 'fa-solid fa-dollar-sign' }),
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },

  date: {
    name: 'dob',
    label: 'Date of Birth',
    type: 'date',
    layout: 'icon',
    required: true,
    icon: new TdIconModel({ iconClass: 'fa-solid fa-calendar' }),
    className: 'form-control',
    iconGroupClass: 'bg-light',
  },

  file: {
    name: 'attachments',
    label: 'Upload Files',
    type: 'file',
    layout: 'icon',
    required: true,
    icon: new TdIconModel({ iconClass: 'fa-solid fa-paperclip' }),
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
    icon: new TdIconModel({ iconClass: 'fa-solid fa-tags' }),
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
  selector: 'demo-input-icon',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput],
  templateUrl: './demo-input-icon.html',
  styleUrl: './demo-input-icon.css',
})
export class DemoInputIcon {
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
