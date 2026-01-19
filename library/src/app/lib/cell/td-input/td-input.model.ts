import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';

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

/**
 * TdInputModel - Configuration for TdInput component
 *
 * @property name - Required. Form field name.
 * @property id - Optional. DOM id.
 * @property type - Optional. Input type. Default: "text"
 * @property label - Optional. Label text.
 * @property value - Optional. Initial value.
 * @property layout - Optional. Layout variant. Default: "text"
 * @property icon - Optional. Icon for icon/floating layouts.
 * @property placeholder - Optional. Placeholder text.
 * @property required - Optional. Whether field is required.
 * @property minLength - Optional. Minimum string length.
 * @property maxLength - Optional. Maximum string length.
 * @property min - Optional. Minimum value (number/date).
 * @property max - Optional. Maximum value (number/date).
 * @property pattern - Optional. Regex pattern for validation.
 * @property passwordStrength - Optional. Enable password strength check.
 * @property matchWith - Optional. Field name to match (for confirm fields).
 * @property className - Optional. Input element classes.
 * @property colClass - Optional. Wrapper column classes.
 * @property options - Optional. Options for select/radio/checkbox.
 * @property validators - Optional. Custom validator functions.
 * @property iconGroupClass - Optional. Classes for icon group wrapper.
 * @property accept - Optional. Accepted file types.
 * @property multiple - Optional. Allow multiple file selection.
 * @property disabled - Optional. Whether input is disabled.
 * @property size - Optional. Visible rows for multiselect.
 * @property searchable - Optional. Enable search in multiselect.
 * @property valueKey - Optional. Key for option value in objects.
 * @property labelKey - Optional. Key for option label in objects.
 * @property width - Optional. Canvas width.
 * @property height - Optional. Canvas height.
 * @property canvasStrokeWidth - Optional. Canvas stroke width.
 */

export interface TdInputConfig {
  name: string;
  id?: string;
  type?: TdInputType;
  label?: string;
  value?: string | string[] | boolean | File | File[];
  layout?: TdInputLayout;
  icon?: TdIconModel | TdIconConfig;
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
  options?: TdInputOption[] | Record<string, unknown>[];
  validators?: TdInputValidator[];
  iconGroupClass?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  size?: number;
  searchable?: boolean;
  valueKey?: string;
  labelKey?: string;
  width?: number;
  height?: number;
  canvasStrokeWidth?: number;
}

export class TdInputModel {
  readonly id?: string;
  readonly name: string;
  readonly type: TdInputType;
  readonly label: string;
  value: string | string[] | boolean | File | File[];
  readonly layout: TdInputLayout;
  readonly icon?: TdIconModel;
  readonly placeholder: string;
  readonly required: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly min?: number | string;
  readonly max?: number | string;
  readonly pattern?: string;
  readonly passwordStrength: boolean;
  readonly matchWith?: string;
  readonly className: string;
  readonly colClass: string;
  readonly options: TdInputOption[];
  readonly validators: TdInputValidator[];
  readonly iconGroupClass: string;
  readonly accept?: string;
  readonly multiple: boolean;
  readonly disabled: boolean;
  readonly size?: number;
  readonly searchable: boolean;
  readonly valueKey: string;
  readonly labelKey: string;
  readonly width: number;
  readonly height: number;
  readonly canvasStrokeWidth: number;

  constructor(config: TdInputConfig) {
    if (!config.name) {
      throw new Error('TdInputModel requires `name`.');
    }

    const type = config.type ?? 'text';
    const layout = config.layout ?? 'text';

    if ((layout === 'icon' || layout === 'floating') && !config.icon) {
      throw new Error("TdInputModel with layout='icon' or 'floating' requires `icon`.");
    }

    this.id = config.id;
    this.name = config.name;
    this.type = type;
    this.label = config.label ?? '';
    this.layout = layout;
    this.placeholder = config.placeholder ?? '';
    this.required = !!config.required;
    this.minLength = config.minLength;
    this.maxLength = config.maxLength;
    this.min = config.min;
    this.max = config.max;
    this.pattern = config.pattern;
    this.passwordStrength = !!config.passwordStrength;
    this.matchWith = config.matchWith;
    this.accept = config.accept;
    this.multiple = !!config.multiple;
    this.disabled = !!config.disabled;
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

    // Normalize icon
    this.icon = config.icon instanceof TdIconModel
      ? config.icon
      : config.icon
        ? new TdIconModel(config.icon)
        : undefined;

    // Determine className
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
    this.colClass = typeof config.colClass === 'string' && config.colClass.trim() !== ''
      ? config.colClass.trim()
      : 'col-12 col-md-6 mx-auto';

    // Normalize options
    this.options = Array.isArray(config.options)
      ? config.options.map(opt => {
          if ('value' in opt && 'label' in opt) {
            return opt as TdInputOption;
          }
          // Try to normalize object to option
          const valueKey = config.valueKey ?? 'value';
          const labelKey = config.labelKey ?? 'label';
          return {
            value: String((opt as Record<string, unknown>)[valueKey] ?? ''),
            label: String((opt as Record<string, unknown>)[labelKey] ?? ''),
          };
        })
      : [];

    this.validators = config.validators ?? [];

    // Icon group class
    const baseIconGroupClass = 'input-group-text';
    this.iconGroupClass = typeof config.iconGroupClass === 'string' && config.iconGroupClass.trim() !== ''
      ? `${baseIconGroupClass} ${config.iconGroupClass.trim()}`
      : baseIconGroupClass;

    // Multiselect config
    this.searchable = typeof config.searchable === 'boolean'
      ? config.searchable
      : type === 'multiselect';
    this.valueKey = config.valueKey ?? 'value';
    this.labelKey = config.labelKey ?? 'label';
  }
}