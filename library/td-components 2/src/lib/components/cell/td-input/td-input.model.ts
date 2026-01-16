// src/lib/components/cell/td-input/td-input.model.ts

import { generateId } from '../../../utils/id-helper';
import { IconObject, IconConfig } from '../td-icon/td-icon.model';

/**
 * InputOption - Options for select/radio/checkbox inputs
 */
export interface InputOption {
  value: string;
  label: string;
}

/**
 * InputConfig - Configuration for TdInput component
 */
export interface InputConfig {
  name: string;
  id?: string;
  type?: string;
  label?: string;
  value?: string | string[] | File | File[] | boolean;
  layout?: 'text' | 'icon' | 'floating';
  icon?: IconConfig | IconObject;
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
  options?: InputOption[] | any[];
  validators?: ((value: any) => string | null)[];
  iconGroupClass?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  width?: number;
  height?: number;
  canvasStrokeWidth?: number;
  size?: number;
  searchable?: boolean;
  valueKey?: string;
  labelKey?: string;
  [key: string]: any;
}

export class InputObject {
  id: string;
  name: string;
  type: string;
  label: string;
  value: any;
  layout: 'text' | 'icon' | 'floating';
  icon?: IconObject;
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
  colClass: string;
  options: InputOption[];
  validators: ((value: any) => string | null)[];
  iconGroupClass: string;
  accept?: string;
  multiple: boolean;
  disabled: boolean;
  width?: number;
  height?: number;
  canvasStrokeWidth?: number;
  size?: number;
  searchable: boolean;
  valueKey?: string;
  labelKey?: string;
  [key: string]: any;

  constructor(config: InputConfig) {
    if (!config.name) {
      throw new Error('InputObject requires `name`.');
    }

    const layout = config.layout || 'text';
    if ((layout === 'icon' || layout === 'floating') && !config.icon) {
      throw new Error(`InputObject with layout='${layout}' requires \`icon\`.`);
    }

    this.id = config.id ?? generateId('input');
    this.name = config.name;
    this.type = config.type ?? 'text';
    this.label = config.label ?? '';
    this.layout = layout as 'text' | 'icon' | 'floating';
    this.placeholder = config.placeholder ?? '';

    // Initialize value based on type
    if (typeof config.value !== 'undefined') {
      this.value = config.value;
    } else if (this.type === 'checkbox' || this.type === 'multiselect') {
      this.value = [];
    } else if (this.type === 'switch') {
      this.value = false;
    } else {
      this.value = '';
    }

    // Hydrate icon if provided
    if (config.icon) {
      this.icon = config.icon instanceof IconObject
        ? config.icon
        : new IconObject(config.icon as IconConfig);
    }

    // Icon group class
    const baseIconGroupClass = 'input-group-text';
    if (typeof config.iconGroupClass === 'string' && config.iconGroupClass.trim() !== '') {
      this.iconGroupClass = baseIconGroupClass + ' ' + config.iconGroupClass.trim();
    } else {
      this.iconGroupClass = baseIconGroupClass;
    }

    // Validation properties
    this.required = !!config.required;
    this.minLength = config.minLength;
    this.maxLength = config.maxLength;
    this.min = config.min;
    this.max = config.max;
    this.pattern = config.pattern;
    this.matchWith = config.matchWith;
    this.passwordStrength = config.passwordStrength;

    // Input properties
    this.size = config.size;
    this.accept = config.accept;
    this.multiple = !!config.multiple;
    this.disabled = !!config.disabled;
    this.width = config.width;
    this.height = config.height;
    this.canvasStrokeWidth = config.canvasStrokeWidth;

    // Determine className based on type
    if (typeof config.className === 'string' && config.className.trim() !== '') {
      this.className = config.className.trim();
    } else {
      if (this.type === 'select' || this.type === 'multiselect') {
        this.className = 'form-control';
      } else if (this.type === 'radio' || this.type === 'checkbox' || this.type === 'switch') {
        this.className = 'form-check-input';
      } else {
        this.className = 'form-control';
      }
    }

    // Column class
    if (typeof config.colClass === 'string' && config.colClass.trim() !== '') {
      this.colClass = config.colClass.trim();
    } else {
      this.colClass = 'col-12 col-md-6 mx-auto';
    }

    // Options for select/radio/checkbox
    this.options = config.options || [];
    this.validators = config.validators || [];

    // Multiselect searchable config
    this.searchable = typeof config.searchable === 'boolean' 
      ? config.searchable 
      : this.type === 'multiselect';
    this.valueKey = config.valueKey;
    this.labelKey = config.labelKey;

    // Spread remaining properties
    const knownKeys = [
      'id', 'name', 'type', 'label', 'value', 'layout', 'icon', 'placeholder',
      'required', 'minLength', 'maxLength', 'min', 'max', 'pattern', 'matchWith',
      'passwordStrength', 'className', 'colClass', 'options', 'validators',
      'iconGroupClass', 'accept', 'multiple', 'disabled', 'width', 'height',
      'canvasStrokeWidth', 'size', 'searchable', 'valueKey', 'labelKey'
    ];
    Object.keys(config).forEach(key => {
      if (!knownKeys.includes(key)) {
        (this as any)[key] = config[key];
      }
    });
  }
}
