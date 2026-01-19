import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdForm } from '../../../lib/tissue/td-form/td-form';
import { FormObject } from '../../../lib/tissue/td-form/td-form.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const DEFAULT_FORM_TEXT = JSON.stringify(
  {
    title: 'Sign In (Text Inputs)',
    className: 'col-12 col-md-6 col-lg-4 mx-auto',
    message: '',
    action: 'login',
    type: 'AlloyInputText',
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
      className: 'btn btn-primary w-100 mt-3',
      disabled: false,
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
    type: 'AlloyInputTextIcon',
    fields: [
      {
        name: 'fullName',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Ada Lovelace',
        layout: 'icon',
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
      className: 'btn btn-success w-100 mt-3',
      disabled: false,
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
    type: 'AlloyInputFloatingText',
    fields: [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'you@example.com',
        layout: 'floating',
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
        required: true,
        matchWith: 'password',
        value: '',
        className: 'form-control',
      },
    ],
    submit: {
      name: 'Sign Up',
      className: 'btn btn-warning w-100 mt-3',
      disabled: false,
      ariaLabel: 'Create account',
      title: 'Create account',
    },
  },
  null,
  2
);

type TabKey = 'Text' | 'Icon' | 'Float';

interface TabConfig {
  key: TabKey;
  label: string;
  defaultJson: string;
}

interface TabState {
  json: string;
  output: string;
  parseError: string;
}

@Component({
  selector: 'demo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TdForm],
  templateUrl: './demo-form.html',
  styleUrls: ['./demo-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoForm {
  readonly tagSnippet = `<td-form [form]="formModel" (output)="handleOutput($event)"></td-form>`;

  readonly TABS: TabConfig[] = [
    { key: 'Text', label: 'Text Inputs', defaultJson: DEFAULT_FORM_TEXT },
    { key: 'Icon', label: 'Icon Inputs', defaultJson: DEFAULT_FORM_ICON },
    { key: 'Float', label: 'Floating Inputs', defaultJson: DEFAULT_FORM_FLOAT },
  ];

  activeTab: TabKey = 'Text';
  defaultOutputMsg = '// Submit form to see OutputObject here';

  tabStates: Record<TabKey, TabState> = {
    Text: { json: DEFAULT_FORM_TEXT, output: this.defaultOutputMsg, parseError: '' },
    Icon: { json: DEFAULT_FORM_ICON, output: this.defaultOutputMsg, parseError: '' },
    Float: { json: DEFAULT_FORM_FLOAT, output: this.defaultOutputMsg, parseError: '' },
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find(t => t.key === this.activeTab)!;
  }

  get formModel(): FormObject {
    try {
      this.tabStates[this.activeTab].parseError = '';
      return new FormObject(JSON.parse(this.currentTab.json));
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return new FormObject({
        title: 'Invalid JSON',
        className: 'col-12 col-md-6 col-lg-4 mx-auto',
        message: 'Could not parse form JSON.',
        action: 'error',
        fields: [],
        submit: {
          name: 'Submit',
          className: 'btn btn-secondary w-100 mt-3',
          disabled: true,
        },
      });
    }
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  onJsonChange(value: string): void {
    this.tabStates[this.activeTab].json = value;
    this.cdr.markForCheck();
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabStates[this.activeTab].output = JSON.stringify(payload, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(): void {
    const config = this.currentTabConfig;
    this.tabStates[this.activeTab].json = config.defaultJson;
    this.tabStates[this.activeTab].parseError = '';
    this.tabStates[this.activeTab].output = this.defaultOutputMsg;
    this.cdr.markForCheck();
  }
}
