// src/app/demo/tissue/demo-form/demo-form.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdForm } from '../../../lib/tissue/td-form/td-form';
import { TdFormModel } from '../../../lib/tissue/td-form/td-form.model';
import { OutputObject } from '../../../lib/share/output-object';

type TabKey = 'Text' | 'Icon' | 'Float';

const DEFAULT_FORM_TEXT = JSON.stringify(
  {
    title: 'Sign In (Text Inputs)',
    className: 'col-12 col-md-6 col-lg-4 mx-auto',
    message: '',
    action: 'login',
    type: 'TdInputText',
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'you@example.com',
        layout: 'text',
        required: true,
        value: '',
        className: 'form-control',
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: '••••••••',
        layout: 'text',
        required: true,
        passwordStrength: true,
        value: '',
        className: 'form-control',
      },
    ],
    submit: {
      name: 'Sign In',
      icon: { iconClass: 'fa-solid fa-circle-notch fa-spin' },
      className: 'btn btn-primary w-100 mt-3',
      disabled: false,
      loading: false,
      ariaLabel: 'Submit login form',
      title: 'Submit login form',
    },
  },
  null,
  2
);

const DEFAULT_FORM_ICON = JSON.stringify(
  {
    title: 'Contact Support (Icon Inputs)',
    className: 'col-12 col-md-6 col-lg-4 mx-auto',
    message: '',
    action: 'support',
    type: 'TdInputTextIcon',
    fields: [
      {
        name: 'fullName',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Ada Lovelace',
        layout: 'icon',
        icon: { iconClass: 'fa-regular fa-user' },
        required: true,
        value: '',
        className: 'form-control form-control-lg',
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'ada@example.com',
        layout: 'icon',
        icon: { iconClass: 'fa-regular fa-envelope' },
        required: true,
        value: '',
        className: 'form-control',
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'How can we help?',
        placeholder: 'Write your issue here...',
        layout: 'text',
        required: true,
        minLength: 10,
        value: '',
        className: 'form-control',
      },
    ],
    submit: {
      name: 'Send Message',
      icon: { iconClass: 'fa-solid fa-paper-plane' },
      className: 'btn btn-success w-100 mt-3',
      disabled: false,
      loading: false,
      ariaLabel: 'Send support request',
      title: 'Send support request',
    },
  },
  null,
  2
);

const DEFAULT_FORM_FLOAT = JSON.stringify(
  {
    title: 'Create Account (Floating Inputs)',
    className: 'col-12 col-md-6 col-lg-4 mx-auto',
    message: '',
    action: 'signup',
    type: 'TdInputFloatingText',
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'you@example.com',
        layout: 'floating',
        icon: { iconClass: 'fa-regular fa-envelope' },
        required: true,
        value: '',
        className: 'form-control',
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Create a password',
        layout: 'floating',
        icon: { iconClass: 'fa-solid fa-lock' },
        required: true,
        passwordStrength: true,
        value: '',
        className: 'form-control',
      },
      {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm Password',
        placeholder: 'Re-enter password',
        layout: 'floating',
        icon: { iconClass: 'fa-solid fa-lock' },
        required: true,
        matchWith: 'password',
        value: '',
        className: 'form-control',
      },
    ],
    submit: {
      name: 'Sign Up',
      icon: { iconClass: 'fa-solid fa-circle-notch fa-spin' },
      className: 'btn btn-warning w-100 mt-3',
      disabled: false,
      loading: false,
      ariaLabel: 'Create account',
      title: 'Create account',
    },
  },
  null,
  2
);

@Component({
  selector: 'demo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TdForm],
  templateUrl: './demo-form.html',
  styleUrl: './demo-form.css',
})
export class DemoForm {
  readonly TABS: Array<{ key: TabKey; label: string }> = [
    { key: 'Text', label: 'Text Inputs' },
    { key: 'Icon', label: 'Icon Inputs' },
    { key: 'Float', label: 'Floating Inputs' },
  ];

  active: TabKey = 'Text';

  jsonText = DEFAULT_FORM_TEXT;
  errText = '';
  modelText: TdFormModel = this.safeHydrate('Text', this.jsonText);

  jsonIcon = DEFAULT_FORM_ICON;
  errIcon = '';
  modelIcon: TdFormModel = this.safeHydrate('Icon', this.jsonIcon);

  jsonFloat = DEFAULT_FORM_FLOAT;
  errFloat = '';
  modelFloat: TdFormModel = this.safeHydrate('Float', this.jsonFloat);

  outputHeader = '// OutputObject event (latest: change / blur / submit)\n';
  outputLatest = this.outputHeader;


  readonly TAG_SNIPPET = `<td-form [form]="new TdFormModel(formObject)" (output)="handleOutput($event)" />`;

  switchTab(next: TabKey): void {
    this.active = next;
  }

  getModel(tab: TabKey): TdFormModel {
    return tab === 'Text' ? this.modelText : tab === 'Icon' ? this.modelIcon : this.modelFloat;
  }

  getJson(tab: TabKey): string {
    return tab === 'Text' ? this.jsonText : tab === 'Icon' ? this.jsonIcon : this.jsonFloat;
  }

  getParseError(tab: TabKey): string {
    return tab === 'Text' ? this.errText : tab === 'Icon' ? this.errIcon : this.errFloat;
  }

  setJson(tab: TabKey, next: string): void {
    if (tab === 'Text') this.jsonText = next;
    else if (tab === 'Icon') this.jsonIcon = next;
    else this.jsonFloat = next;

    const hydrated = this.safeHydrate(tab, next);
    if (tab === 'Text') this.modelText = hydrated;
    else if (tab === 'Icon') this.modelIcon = hydrated;
    else this.modelFloat = hydrated;
  }

  resetTab(tab: TabKey): void {
    if (tab === 'Text') {
      this.jsonText = DEFAULT_FORM_TEXT;
      this.errText = '';
      this.modelText = this.safeHydrate('Text', this.jsonText);
    } else if (tab === 'Icon') {
      this.jsonIcon = DEFAULT_FORM_ICON;
      this.errIcon = '';
      this.modelIcon = this.safeHydrate('Icon', this.jsonIcon);
    } else {
      this.jsonFloat = DEFAULT_FORM_FLOAT;
      this.errFloat = '';
      this.modelFloat = this.safeHydrate('Float', this.jsonFloat);
    }
  }

  clearLog(): void {
    this.outputLatest = this.outputHeader;
  }


  handleOutput(payload: OutputObject): void {
    const anyPayload: any = payload as any;
    const plain =
      anyPayload && typeof anyPayload.toJSON === 'function' ? anyPayload.toJSON() : anyPayload;

    this.outputLatest =
      this.outputHeader +
      '\n------------------------------\n' +
      JSON.stringify(plain, null, 2) +
      '\n';
  }

  private safeHydrate(tab: TabKey, json: string): TdFormModel {
    try {
      const parsed = JSON.parse(json || '{}');
      this.setErr(tab, '');
      return new TdFormModel(parsed);
    } catch (e: any) {
      this.setErr(tab, String(e?.message || e));
      return new TdFormModel({
        title: `Invalid JSON (${tab})`,
        className: 'col-12 col-md-6 col-lg-4 mx-auto',
        message: 'Could not parse form JSON.',
        action: 'error',
        fields: [],
        submit: {
          name: 'Submit',
          icon: { iconClass: 'fa-solid fa-triangle-exclamation' },
          className: 'btn btn-secondary w-100 mt-3',
          disabled: true,
          loading: false,
        },
      });
    }
  }

  private setErr(tab: TabKey, msg: string): void {
    if (tab === 'Text') this.errText = msg;
    else if (tab === 'Icon') this.errIcon = msg;
    else this.errFloat = msg;
  }
}
