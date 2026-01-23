// src/app/lib/cell/td-input/td-input.model.ts
import { generateId } from '../../share/id-helper';
import { TdIconModel } from '../td-icon/td-icon.model';

export type TdInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'file'
  | 'canvas';

export type TdInputLayout = 'text' | 'icon' | 'floating';

export interface TdInputOption {
  value: string;
  label: string;
}

export interface TdInputConfig {
  name: string;
  id?: string;

  type?: TdInputType;

  label?: string;
  value?: string | string[] | boolean | File;

  layout?: TdInputLayout;
  icon?: TdIconModel | { iconClass: string };

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

  options?: TdInputOption[];
  validators?: Array<Function>;

  iconGroupClass?: string;

  accept?: string;
  multiple?: boolean;

  disabled?: boolean;

  width?: number;
  height?: number;
  canvasStrokeWidth?: number;

  [key: string]: unknown;
}

export class TdInputModel {
  id: string;
  name: string;

  type: TdInputType;

  label: string;
  value: any;

  layout: TdInputLayout;
  icon?: TdIconModel;

  placeholder: string;

  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  pattern?: string;

  passwordStrength?: boolean;
  matchWith?: string;

  className: string;

  options: TdInputOption[];
  validators: Array<Function>;

  iconGroupClass: string;

  accept?: string;
  multiple?: boolean;

  disabled?: boolean;

  width?: number;
  height?: number;
  canvasStrokeWidth?: number;

  constructor(config: TdInputConfig = { name: '' }) {
    const {
      id,
      name,
      type = 'text',
      label = '',
      value,

      layout = 'text',
      icon,
      placeholder = '',

      required = false,
      minLength,
      maxLength,
      min,
      max,
      pattern,
      matchWith,
      passwordStrength,

      className,

      options = [],
      validators = [],

      iconGroupClass,

      ...rest
    } = config;

    if (!name) {
      throw new Error('TdInputModel requires `name`.');
    }

    if ((layout === 'icon' || layout === 'floating') && !icon) {
      throw new Error("TdInputModel with layout='icon' or 'floating' requires `icon`.");
    }

    let initialValue: any;
    if (typeof value !== 'undefined') {
      initialValue = value;
    } else if (type === 'checkbox' || type === 'multiselect') {
      initialValue = [];
    } else if (type === 'switch') {
      initialValue = false;
    } else {
      initialValue = '';
    }

    const normalizedIcon =
      icon instanceof TdIconModel ? icon : icon ? new TdIconModel(icon as any) : undefined;

    this.id = id ?? generateId('input');
    this.name = name;
    this.type = type;

    this.label = label;
    this.value = initialValue;

    this.layout = layout;
    this.icon = normalizedIcon;

    this.placeholder = placeholder;

    const baseIconGroupClass = 'input-group-text';
    if (typeof iconGroupClass === 'string' && iconGroupClass.trim() !== '') {
      this.iconGroupClass = baseIconGroupClass + ' ' + iconGroupClass.trim();
    } else {
      this.iconGroupClass = baseIconGroupClass;
    }

    this.required = !!required;
    this.minLength = minLength;
    this.maxLength = maxLength;
    this.min = min;
    this.max = max;
    this.pattern = pattern;
    this.matchWith = matchWith;
    this.passwordStrength = passwordStrength;

    if (typeof className === 'string' && className.trim() !== '') {
      this.className = className.trim();
    } else {
      if (type === 'select' || type === 'multiselect') {
        this.className = 'form-select';
      } else if (type === 'radio' || type === 'checkbox') {
        this.className = 'form-check-input';
      } else {
        this.className = 'form-control';
      }
    }

    this.options = options;
    this.validators = validators;

    Object.assign(this, rest);
  }
}
