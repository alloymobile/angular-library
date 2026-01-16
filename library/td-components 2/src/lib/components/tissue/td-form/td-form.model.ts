// src/lib/components/tissue/td-form/td-form.model.ts

import { generateId } from '../../../utils/id-helper';
import { InputObject, InputConfig } from '../../cell/td-input/td-input.model';
import { ButtonSubmitObject, ButtonSubmitConfig } from '../../cell/td-button-submit/td-button-submit.model';

/**
 * FormConfig - Configuration for TdForm component
 */
export interface FormConfig {
  id?: string;
  title?: string;
  className?: string;
  message?: string;
  action?: string;
  type?: string;
  submit?: ButtonSubmitConfig | ButtonSubmitObject;
  fields?: (InputConfig | InputObject)[];
  data?: Record<string, any>;
}

/**
 * FieldState - State for a single field
 */
export interface FieldState {
  value: any;
  valid: boolean;
  error: boolean;
  errors: string[];
}

export class FormObject {
  id: string;
  title: string;
  className: string;
  message: string;
  action: string;
  type: string;
  submit: ButtonSubmitObject;
  fields: InputObject[];
  data: Record<string, any>;

  constructor(res: FormConfig = {}) {
    this.id = res.id ?? generateId('form');
    this.title = res.title ?? 'TdMobile';
    this.className = res.className ?? 'col m-2';
    this.message = res.message ?? '';
    this.action = res.action ?? '';
    this.type = res.type ?? 'TdInputTextIcon';

    // Hydrate submit into ButtonSubmitObject
    if (res.submit instanceof ButtonSubmitObject) {
      this.submit = res.submit;
    } else {
      this.submit = new ButtonSubmitObject(
        res.submit || {
          name: 'Submit',
          icon: { iconClass: 'fa-solid fa-circle-notch fa-spin' },
          className: 'btn btn-primary w-100 mt-3',
          disabled: false,
          loading: false,
          ariaLabel: 'Submit',
          title: 'Submit'
        }
      );
    }

    // Hydrate fields into InputObject[]
    const rawFields = Array.isArray(res.fields) ? res.fields : [];
    this.fields = rawFields.map(fld =>
      fld instanceof InputObject ? fld : new InputObject(fld as InputConfig)
    );

    // Remember last submit snapshot
    this.data = res.data ?? {};
  }
}

/**
 * Validate a single field
 */
export function validateField(
  fieldDef: InputObject,
  value: any,
  allValues: Record<string, any>
): { valid: boolean; error: boolean; errors: string[] } {
  let isValid = true;
  const errs: string[] = [];

  // Required validation
  if (fieldDef.required) {
    if (fieldDef.type === 'checkbox') {
      const arrVal = Array.isArray(value) ? value : [];
      if (arrVal.length === 0) {
        isValid = false;
        errs.push('This field is required.');
      }
    } else {
      const empty = value === '' || value === false || value === undefined || value === null;
      if (empty) {
        isValid = false;
        errs.push('This field is required.');
      }
    }
  }

  // MinLength validation
  if (isValid && typeof fieldDef.minLength === 'number' && typeof value === 'string' && value.length < fieldDef.minLength) {
    isValid = false;
    errs.push(`Minimum length is ${fieldDef.minLength}`);
  }

  // MaxLength validation
  if (isValid && typeof fieldDef.maxLength === 'number' && typeof value === 'string' && value.length > fieldDef.maxLength) {
    isValid = false;
    errs.push(`Maximum length is ${fieldDef.maxLength}`);
  }

  // Pattern validation
  if (isValid && fieldDef.pattern && typeof value === 'string' && !new RegExp(fieldDef.pattern).test(value)) {
    isValid = false;
    errs.push('Invalid format.');
  }

  // Password strength validation
  if (isValid && fieldDef.passwordStrength && typeof value === 'string') {
    const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
    if (!strongRegex.test(value)) {
      isValid = false;
      errs.push('Password is too weak.');
    }
  }

  // MatchWith validation
  if (isValid && fieldDef.matchWith) {
    const otherName = fieldDef.matchWith;
    const otherVal = allValues[otherName];
    if (otherVal !== value) {
      isValid = false;
      errs.push('Values do not match.');
    }
  }

  return {
    valid: isValid,
    error: !isValid,
    errors: errs
  };
}
