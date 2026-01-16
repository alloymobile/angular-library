// src/demo/pages/tissue/td-form-demo/td-form-demo.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdFormComponent } from '../../../../lib/components/tissue/td-form/td-form';
import { FormObject } from '../../../../lib/components/tissue/td-form/td-form.model';

const RAW_TEXT: any = {
    title: "Sign In (Text Inputs)",
    className: "col-12 col-md-6 col-lg-4 mx-auto",
    message: "",
    action: "login",
    type: "AlloyInputText",

    fields: [
      {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "you@example.com",
        layout: "text",
        required: true,
        value: "",
        className: "form-control"
      },
      {
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "••••••••",
        layout: "text",
        required: true,
        passwordStrength: true,
        value: "",
        className: "form-control"
      }
    ],

    submit: {
      name: "Sign In",
      icon: { iconClass: "fa-solid fa-circle-notch fa-spin" },
      className: "btn btn-primary w-100 mt-3",
      disabled: false,
      loading: false,
      ariaLabel: "Submit login form",
      title: "Submit login form"
    }
  };
const RAW_ICON: any = {
    title: "Contact Support (Icon Inputs)",
    className: "col-12 col-md-6 col-lg-4 mx-auto",
    message: "",
    action: "support",
    type: "AlloyInputTextIcon",

    fields: [
      {
        name: "fullName",
        type: "text",
        label: "Full Name",
        placeholder: "Ada Lovelace",
        layout: "icon",
        icon: { iconClass: "fa-regular fa-user" },
        required: true,
        value: "",
        className: "form-control form-control-lg"
      },
      {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "ada@example.com",
        layout: "icon",
        icon: { iconClass: "fa-regular fa-envelope" },
        required: true,
        value: "",
        className: "form-control"
      },
      {
        name: "message",
        type: "textarea",
        label: "How can we help?",
        placeholder: "Write your issue here...",
        layout: "text",
        required: true,
        minLength: 10,
        value: "",
        className: "form-control"
      }
    ],

    submit: {
      name: "Send Message",
      icon: { iconClass: "fa-solid fa-paper-plane" },
      className: "btn btn-success w-100 mt-3",
      disabled: false,
      loading: false,
      ariaLabel: "Send support request",
      title: "Send support request"
    }
  };
const RAW_FLOAT: any = {
    title: "Create Account (Floating Inputs)",
    className: "col-12 col-md-6 col-lg-4 mx-auto",
    message: "",
    action: "signup",
    type: "AlloyInputFloatingText",

    fields: [
      {
        name: "email",
        type: "email",
        label: "Email",
        placeholder: "you@example.com",
        layout: "floating",
        icon: { iconClass: "fa-regular fa-envelope" },
        required: true,
        value: "",
        className: "form-control"
      },
      {
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "Create a password",
        layout: "floating",
        icon: { iconClass: "fa-solid fa-lock" },
        required: true,
        passwordStrength: true,
        value: "",
        className: "form-control"
      },
      {
        name: "confirmPassword",
        type: "password",
        label: "Confirm Password",
        placeholder: "Re-enter password",
        layout: "floating",
        icon: { iconClass: "fa-solid fa-lock" },
        required: true,
        matchWith: "password",
        value: "",
        className: "form-control"
      }
    ],

    submit: {
      name: "Sign Up",
      icon: { iconClass: "fa-solid fa-circle-notch fa-spin" },
      className: "btn btn-warning w-100 mt-3",
      disabled: false,
      loading: false,
      ariaLabel: "Create account",
      title: "Create account"
    }
  };

@Component({
  selector: 'td-demo-td-form',
  standalone: true,
  imports: [CommonModule, TdFormComponent],
  templateUrl: './td-form-demo.html',
  styleUrls: ['./td-form-demo.css']
})
export class TdFormDemoComponent {
  activeTab: 'text' | 'icon' | 'float' = 'text';

  inputJson = JSON.stringify(RAW_TEXT, null, 2);
  parseError = '';
  outputJson = '// Submit the form to see output here…';

  parsed: any = RAW_TEXT;

  get model(): FormObject {
    try {
      return new FormObject(this.parsed);
    } catch {
      return new FormObject({ title: 'Invalid JSON', fields: [], submit: { name: 'Submit', disabled: true } } as any);
    }
  }

  private currentRaw(): any {
    if (this.activeTab === 'icon') return RAW_ICON;
    if (this.activeTab === 'float') return RAW_FLOAT;
    return RAW_TEXT;
  }

  switchTab(tab: 'text' | 'icon' | 'float'): void {
    this.activeTab = tab;
    this.onReset();
  }

  onInputChange(val: string): void {
    this.inputJson = val;
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed = obj;
      this.parseError = '';
    } catch (e: any) {
      this.parseError = String(e?.message || e || 'Invalid JSON.');
    }
  }

  onReset(): void {
    const raw = this.currentRaw();
    this.parsed = raw;
    this.inputJson = JSON.stringify(raw, null, 2);
    this.parseError = '';
    this.outputJson = '// Submit the form to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.parsed = obj;
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parseError = '';
    } catch {}
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }
}
