/**
 * ModalObject - Model for modal dialog with input fields
 *
 * Supports:
 * - Dynamic input fields
 * - Form validation
 * - Submit/Cancel actions
 */

import { generateId } from '../../share';
import { ButtonObject, ButtonObjectConfig } from '../td-button-bar/td-button-bar.model';

/* ----- InputObject ----- */

export interface InputObjectConfig {
  id?: string;
  name?: string;
  type?: string;
  value?: any;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  options?: { value: string; label: string; selected?: boolean }[];
  ariaLabel?: string;
  autoComplete?: string;
  passwordStrength?: boolean;
  matchWith?: string;
}

export class InputObject {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  value: any;
  readonly placeholder: string;
  readonly className: string;
  readonly label: string;
  readonly required: boolean;
  readonly disabled: boolean;
  readonly readonly: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly rows?: number;
  readonly options: { value: string; label: string; selected?: boolean }[];
  readonly ariaLabel: string;
  readonly autoComplete: string;
  readonly passwordStrength: boolean;
  readonly matchWith?: string;

  constructor(input: InputObjectConfig = {}) {
    this.id = input.id ?? generateId('input');
    this.name = typeof input.name === 'string' ? input.name : this.id;
    this.type = typeof input.type === 'string' ? input.type : 'text';
    this.value = input.value ?? '';
    this.placeholder = typeof input.placeholder === 'string' ? input.placeholder : '';
    this.className = typeof input.className === 'string' ? input.className : 'form-control';
    this.label = typeof input.label === 'string' ? input.label : '';
    this.required = !!input.required;
    this.disabled = !!input.disabled;
    this.readonly = !!input.readonly;
    this.minLength = input.minLength;
    this.maxLength = input.maxLength;
    this.pattern = input.pattern;
    this.min = input.min;
    this.max = input.max;
    this.step = input.step;
    this.rows = input.rows;
    this.options = Array.isArray(input.options) ? input.options : [];
    this.ariaLabel = typeof input.ariaLabel === 'string' ? input.ariaLabel : this.label || this.name;
    this.autoComplete = typeof input.autoComplete === 'string' ? input.autoComplete : 'off';
    this.passwordStrength = !!input.passwordStrength;
    this.matchWith = input.matchWith;
  }

  /**
   * Check if input has a label
   */
  hasLabel(): boolean {
    return this.label.trim().length > 0;
  }

  /**
   * Check if input is a select type
   */
  isSelect(): boolean {
    return this.type === 'select';
  }

  /**
   * Check if input is a textarea type
   */
  isTextarea(): boolean {
    return this.type === 'textarea';
  }

  /**
   * Check if input is a checkbox type
   */
  isCheckbox(): boolean {
    return this.type === 'checkbox';
  }

  /**
   * Check if input is a radio type
   */
  isRadio(): boolean {
    return this.type === 'radio';
  }
}

/* ----- ModalObject ----- */

export interface ModalObjectConfig {
  id?: string;
  title?: string;
  className?: string;
  action?: string;
  submit?: ButtonObjectConfig | ButtonObject;
  fields?: (InputObjectConfig | InputObject)[];
  data?: Record<string, any>;
}

export class ModalObject {
  readonly id: string;
  readonly title: string;
  readonly className: string;
  readonly action: string;
  readonly submit: ButtonObject;
  readonly fields: InputObject[];
  data: Record<string, any>;

  constructor(modal: ModalObjectConfig = {}) {
    this.id = modal.id ?? generateId('modal');
    this.title = typeof modal.title === 'string' ? modal.title : '';
    this.className = typeof modal.className === 'string' ? modal.className : 'modal fade';
    this.action = typeof modal.action === 'string' ? modal.action : '';

    // Normalize submit button
    if (modal.submit instanceof ButtonObject) {
      this.submit = modal.submit;
    } else if (modal.submit && typeof modal.submit === 'object') {
      this.submit = new ButtonObject(modal.submit);
    } else {
      this.submit = new ButtonObject({
        name: 'Submit',
        className: 'btn btn-primary',
      });
    }

    // Normalize fields
    const rawFields = Array.isArray(modal.fields) ? modal.fields : [];
    this.fields = rawFields.map(f =>
      f instanceof InputObject ? f : new InputObject(f)
    );

    // Initial data
    const baseData: Record<string, any> = {};
    this.fields.forEach(f => {
      baseData[f.name] = f.value;
    });
    this.data = { ...baseData, ...(modal.data || {}) };
  }

  /**
   * Check if modal has fields
   */
  hasFields(): boolean {
    return this.fields.length > 0;
  }

  /**
   * Get display title
   */
  getDisplayTitle(): string {
    if (this.action && this.title) {
      return `${this.action} a ${this.title}`;
    }
    return this.title || this.action || 'Modal';
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): ModalObjectConfig {
    return {
      id: this.id,
      title: this.title,
      className: this.className,
      action: this.action,
      data: this.data,
    };
  }
}
