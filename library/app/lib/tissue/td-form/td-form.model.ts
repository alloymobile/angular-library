/**
 * FormObject - Model for standalone form component
 *
 * Supports:
 * - Dynamic input fields with validation
 * - Custom submit button
 * - Success/error message handling
 */

import { generateId, IconObject, IconObjectConfig } from '../../share';

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
  colClass?: string;
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
  readonly colClass: string;

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
    this.colClass = typeof input.colClass === 'string' ? input.colClass : 'col-12';
  }

  hasLabel(): boolean {
    return this.label.trim().length > 0;
  }

  isSelect(): boolean {
    return this.type === 'select';
  }

  isTextarea(): boolean {
    return this.type === 'textarea';
  }

  isCheckbox(): boolean {
    return this.type === 'checkbox';
  }

  isRadio(): boolean {
    return this.type === 'radio';
  }
}

/* ----- ButtonSubmitObject ----- */

export interface ButtonSubmitObjectConfig {
  id?: string;
  name?: string;
  className?: string;
  icon?: IconObjectConfig | IconObject;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  loading?: boolean;
  loadingText?: string;
}

export class ButtonSubmitObject {
  readonly id: string;
  readonly name: string;
  readonly className: string;
  readonly icon: IconObject;
  readonly disabled: boolean;
  readonly title: string;
  readonly ariaLabel: string;
  readonly loading: boolean;
  readonly loadingText: string;

  constructor(button: ButtonSubmitObjectConfig = {}) {
    this.id = button.id ?? generateId('btn-submit');
    this.name = typeof button.name === 'string' ? button.name : 'Submit';
    this.className = typeof button.className === 'string' ? button.className : 'btn btn-primary';
    this.icon = button.icon instanceof IconObject
      ? button.icon
      : new IconObject(button.icon || {});
    this.disabled = !!button.disabled;
    this.title = typeof button.title === 'string' ? button.title : '';
    this.ariaLabel = typeof button.ariaLabel === 'string' ? button.ariaLabel : this.name;
    this.loading = !!button.loading;
    this.loadingText = typeof button.loadingText === 'string' ? button.loadingText : 'Loading...';
  }

  getCombinedClasses(): string {
    return this.className;
  }
}

/* ----- FormObject ----- */

export interface FormObjectConfig {
  id?: string;
  title?: string;
  className?: string;
  message?: string;
  messageClass?: string;
  action?: string;
  submit?: ButtonSubmitObjectConfig | ButtonSubmitObject;
  fields?: (InputObjectConfig | InputObject)[];
  layout?: 'vertical' | 'horizontal' | 'inline';
  rowClass?: string;
}

export class FormObject {
  readonly id: string;
  readonly title: string;
  readonly className: string;
  readonly message: string;
  readonly messageClass: string;
  readonly action: string;
  readonly submit: ButtonSubmitObject;
  readonly fields: InputObject[];
  readonly layout: 'vertical' | 'horizontal' | 'inline';
  readonly rowClass: string;

  constructor(form: FormObjectConfig = {}) {
    this.id = form.id ?? generateId('form');
    this.title = typeof form.title === 'string' ? form.title : '';
    this.className = typeof form.className === 'string' ? form.className : '';
    this.message = typeof form.message === 'string' ? form.message : '';
    this.messageClass = typeof form.messageClass === 'string' ? form.messageClass : 'alert alert-info';
    this.action = typeof form.action === 'string' ? form.action : '';
    this.layout = form.layout ?? 'vertical';
    this.rowClass = typeof form.rowClass === 'string' ? form.rowClass : 'row g-3';

    // Normalize submit button
    if (form.submit instanceof ButtonSubmitObject) {
      this.submit = form.submit;
    } else if (form.submit && typeof form.submit === 'object') {
      this.submit = new ButtonSubmitObject(form.submit);
    } else {
      this.submit = new ButtonSubmitObject({});
    }

    // Normalize fields
    const rawFields = Array.isArray(form.fields) ? form.fields : [];
    this.fields = rawFields.map(f =>
      f instanceof InputObject ? f : new InputObject(f)
    );
  }

  hasTitle(): boolean {
    return this.title.trim().length > 0;
  }

  hasMessage(): boolean {
    return this.message.trim().length > 0;
  }

  hasFields(): boolean {
    return this.fields.length > 0;
  }

  toJSON(): FormObjectConfig {
    return {
      id: this.id,
      title: this.title,
      className: this.className,
      message: this.message,
      messageClass: this.messageClass,
      action: this.action,
      layout: this.layout,
      rowClass: this.rowClass,
    };
  }
}
