// src/app/demo/cell/demo-input/demo-input.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdInput } from '../../../lib/cell/td-input/td-input';
import { TdInputModel } from '../../../lib/cell/td-input/td-input.model';
import { OutputObject } from '../../../lib/share/output-object';

const DEFAULT_OUTPUT = '// Interact with the field (type, blur, select, etc.)';

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
    name: 'roles',
    label: 'Roles (multi-select)',
    type: 'multiselect',
    layout: 'text',
    required: true,
    className: 'form-select',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'user', label: 'User' },
      { value: 'guest', label: 'Guest' },
      { value: 'manager', label: 'Manager' },
    ],
    value: ['user'],
  },

  date: {
    name: 'dob',
    label: 'Date of Birth',
    type: 'date',
    layout: 'text',
    required: true,
    className: 'form-control',
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

  switch: {
    name: 'marketingOptIn',
    label: 'Marketing Opt-in (switch)',
    type: 'switch',
    layout: 'text',
    required: true,
    value: false,
  },

  icon: {
    name: 'username',
    label: 'Username (icon layout)',
    type: 'text',
    layout: 'icon',
    placeholder: 'Enter your username',
    required: true,
    className: 'form-control',
    icon: { iconClass: 'fa-solid fa-user' },
    iconGroupClass: 'bg-light border-0',
  },

  floating: {
    name: 'floatingEmail',
    label: 'Email (floating)',
    type: 'email',
    layout: 'floating',
    required: true,
    placeholder: ' ',
    className: 'form-control',
    icon: { iconClass: 'fa-solid fa-envelope' },
  },

  file: {
    name: 'resume',
    label: 'Resume (file)',
    type: 'file',
    layout: 'text',
    className: 'form-control',
    accept: '.pdf,.doc,.docx',
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

@Component({
  selector: 'demo-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput],
  templateUrl: './demo-input.html',
  styleUrls: ['./demo-input.css'],
})
export class DemoInput {
  tabs = Object.keys(DEFAULT_INPUTS);

  tab = 'text';
  inputJson = JSON.stringify(DEFAULT_INPUTS['text'], null, 2);
  outputJson = DEFAULT_OUTPUT;
  parseError = '';

  inputModel = new TdInputModel(DEFAULT_INPUTS['text']);

  exampleOutputJson =
`{
  "id": "input-xyz",
  "type": "input",
  "action": "change",
  "error": false,
  "errorMessage": [],
  "data": {
    "name": "email",
    "value": "user@example.com",
    "errors": []
  }
}`;

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.outputJson = JSON.stringify(payload, null, 2);
  }

  switchTab(next: string): void {
    const fresh = DEFAULT_INPUTS[next];
    this.tab = next;
    this.parseError = '';
    this.outputJson = DEFAULT_OUTPUT;
    this.inputJson = JSON.stringify(fresh, null, 2);
    this.inputModel = new TdInputModel(fresh);
  }

  onInputJsonChange(v: string): void {
    this.inputJson = v;

    try {
      const raw = JSON.parse(this.inputJson || '{}');
      this.parseError = '';
      this.inputModel = new TdInputModel(raw);
    } catch (e: any) {
      this.parseError = String(e?.message || e);
      this.inputModel = new TdInputModel(DEFAULT_INPUTS[this.tab]);
    }
  }

  formatJson(): void {
    try {
      const parsed = JSON.parse(this.inputJson);
      this.onInputJsonChange(JSON.stringify(parsed, null, 2));
    } catch {
      // no-op
    }
  }

  clearOutput(): void {
    this.outputJson = DEFAULT_OUTPUT;
  }
}
