// td-input/td-input.model.ts
import { TdIconModel } from '../td-icon/td-icon.model';

/**
 * Input option for select/radio/checkbox/multiselect
 */
export interface TdInputOption {
  value: string;
  label: string;
  slug?: string;
}

/**
 * Custom validator function type
 */
export type TdInputValidator = (value: unknown) => string | null;

/**
 * Supported input types
 */
export type TdInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'file'
  | 'canvas';

/**
 * Layout variants
 */
export type TdInputLayout = 'text' | 'icon' | 'floating';

export class TdInputModel {
  id?: string;
  name: string;
  type: TdInputType;
  label: string;
  value: string | string[] | boolean | File | File[];
  layout: TdInputLayout;
  icon?: TdIconModel;
  placeholder: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  pattern?: string;
  passwordStrength: boolean;
  matchWith?: string;
  className: string;
  colClass: string;
  options: TdInputOption[];
  validators: TdInputValidator[];
  iconGroupClass: string;
  accept?: string;
  multiple: boolean;
  disabled: boolean;
  size?: number;
  searchable: boolean;
  width: number;
  height: number;
  canvasStrokeWidth: number;

  constructor(config: {
    name: string;
    id?: string;
    type?: TdInputType;
    label?: string;
    value?: string | string[] | boolean | File | File[];
    layout?: TdInputLayout;
    icon?: TdIconModel | any;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number | string;
    max?: number | string;
    pattern?: string;
    passwordStrength?: boolean;
    matchWith?: string;
    className?: string;
    colClass?: string;
    options?: TdInputOption[];
    validators?: TdInputValidator[];
    iconGroupClass?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    size?: number;
    searchable?: boolean;
    width?: number;
    height?: number;
    canvasStrokeWidth?: number;
  }) {
    if (!config.name) {
      throw new Error('TdInputModel requires `name`.');
    }

    const type = config.type ?? 'text';
    const layout = config.layout ?? 'text';

    const icon = config.icon
      ? (config.icon instanceof TdIconModel ? config.icon : new TdIconModel(config.icon))
      : undefined;

    if ((layout === 'icon' || layout === 'floating') && !icon) {
      throw new Error("TdInputModel with layout='icon' or 'floating' requires `icon`.");
    }

    this.id = config.id;
    this.name = config.name;
    this.type = type;
    this.label = config.label ?? '';
    this.layout = layout;
    this.icon = icon;
    this.placeholder = config.placeholder ?? '';
    this.required = config.required ?? false;
    this.minLength = config.minLength;
    this.maxLength = config.maxLength;
    this.min = config.min;
    this.max = config.max;
    this.pattern = config.pattern;
    this.passwordStrength = config.passwordStrength ?? false;
    this.matchWith = config.matchWith;
    this.accept = config.accept;
    this.multiple = config.multiple ?? false;
    this.disabled = config.disabled ?? false;
    this.size = config.size;
    this.width = config.width ?? 420;
    this.height = config.height ?? 180;
    this.canvasStrokeWidth = config.canvasStrokeWidth ?? 2;

    // Initialize value based on type
    if (typeof config.value !== 'undefined') {
      this.value = config.value;
    } else if (type === 'checkbox' || type === 'multiselect') {
      this.value = [];
    } else if (type === 'switch') {
      this.value = false;
    } else {
      this.value = '';
    }

    // Determine className based on type
    if (typeof config.className === 'string' && config.className.trim() !== '') {
      this.className = config.className.trim();
    } else {
      if (type === 'select' || type === 'multiselect') {
        this.className = 'form-control';
      } else if (type === 'radio' || type === 'checkbox' || type === 'switch') {
        this.className = 'form-check-input';
      } else {
        this.className = 'form-control';
      }
    }

    // Column class
    this.colClass =
      typeof config.colClass === 'string' && config.colClass.trim() !== ''
        ? config.colClass.trim()
        : 'col-12 col-md-6 mx-auto';

    // Options
    this.options = config.options ?? [];

    // Validators
    this.validators = config.validators ?? [];

    // Icon group class
    const baseIconGroupClass = 'input-group-text';
    this.iconGroupClass =
      typeof config.iconGroupClass === 'string' && config.iconGroupClass.trim() !== ''
        ? `${baseIconGroupClass} ${config.iconGroupClass.trim()}`
        : baseIconGroupClass;

    // Multiselect searchable
    this.searchable =
      typeof config.searchable === 'boolean' ? config.searchable : type === 'multiselect';
  }
}
