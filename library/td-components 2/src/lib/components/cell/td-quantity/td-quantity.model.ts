// src/lib/components/cell/td-quantity/td-quantity.model.ts

import { generateId } from '../../../utils/id-helper';
import { InputObject, InputConfig } from '../td-input/td-input.model';
import { ButtonIconObject, ButtonIconConfig } from '../td-button-icon/td-button-icon.model';
import { IconObject } from '../td-icon/td-icon.model';

function toNum(x: any, fallback: number): number {
  if (typeof x === 'string') {
    const s = x.trim();
    if (!s) return fallback;
    const n = Number(s);
    return Number.isFinite(n) ? n : fallback;
  }
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * QuantityConfig - Configuration for TdQuantity component
 */
export interface QuantityConfig {
  name: string;
  id?: string;
  label?: string;
  value?: number | string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  disabled?: boolean;
  showRange?: boolean;
  colClass?: string;
  className?: string;
  input?: InputConfig | InputObject;
  decrease?: ButtonIconConfig | ButtonIconObject;
  increase?: ButtonIconConfig | ButtonIconObject;
  onChange?: (next: number, self: QuantityObject, meta: { action: string; event?: Event }) => void;
  [key: string]: any;
}

export class QuantityObject {
  id: string;
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  showRange: boolean;
  colClass: string;
  className: string;
  input: InputObject;
  decrease: ButtonIconObject;
  increase: ButtonIconObject;
  onChange?: (next: number, self: QuantityObject, meta: { action: string; event?: Event }) => void;
  [key: string]: any;

  constructor(cfg: QuantityConfig) {
    if (!cfg.name) {
      throw new Error('QuantityObject requires `name`.');
    }

    this.id = cfg.id ?? generateId('qty');
    this.name = cfg.name;
    this.label = cfg.label ?? 'Quantity';

    // Parse min/max
    this.min = toNum(cfg.min, 1);
    this.max = toNum(cfg.max, this.min);
    if (this.max < this.min) {
      const tmp = this.min;
      this.min = this.max;
      this.max = tmp;
    }

    this.step = Math.abs(toNum(cfg.step, 1)) || 1;
    this.disabled = !!cfg.disabled;

    // Initialize value
    const initial = typeof cfg.value === 'undefined' ? this.min : toNum(cfg.value, this.min);
    this.value = clamp(initial, this.min, this.max);

    this.showRange = cfg.showRange !== false;
    this.colClass = cfg.colClass ?? 'col-12';
    this.className = cfg.className ?? '';

    // Hydrate input
    if (cfg.input instanceof InputObject) {
      this.input = cfg.input;
    } else {
      this.input = new InputObject({
        name: this.name,
        type: 'number',
        label: '',
        value: this.value,
        min: this.min,
        max: this.max,
        className: 'form-control text-center',
        disabled: this.disabled,
        ...(cfg.input && !(cfg.input instanceof InputObject) ? cfg.input : {})
      });
    }

    // Hydrate decrease button
    if (cfg.decrease instanceof ButtonIconObject) {
      this.decrease = cfg.decrease;
    } else {
      this.decrease = new ButtonIconObject({
        name: '',
        className: 'btn btn-outline-secondary',
        disabled: this.disabled || this.value <= this.min,
        ariaLabel: 'Decrease quantity',
        title: 'Decrease',
        icon: new IconObject({ iconClass: 'fa-solid fa-minus' }),
        ...(cfg.decrease && !(cfg.decrease instanceof ButtonIconObject) ? cfg.decrease : {})
      });
    }

    // Hydrate increase button
    if (cfg.increase instanceof ButtonIconObject) {
      this.increase = cfg.increase;
    } else {
      this.increase = new ButtonIconObject({
        name: '',
        className: 'btn btn-outline-secondary',
        disabled: this.disabled || this.value >= this.max,
        ariaLabel: 'Increase quantity',
        title: 'Increase',
        icon: new IconObject({ iconClass: 'fa-solid fa-plus' }),
        ...(cfg.increase && !(cfg.increase instanceof ButtonIconObject) ? cfg.increase : {})
      });
    }

    this.onChange = cfg.onChange;

    // Spread remaining properties
    const knownKeys = [
      'id', 'name', 'label', 'value', 'min', 'max', 'step', 'disabled',
      'showRange', 'colClass', 'className', 'input', 'decrease', 'increase', 'onChange'
    ];
    Object.keys(cfg).forEach(key => {
      if (!knownKeys.includes(key)) {
        (this as any)[key] = cfg[key];
      }
    });
  }

  /**
   * Get range text for display
   */
  rangeText(): string {
    if (!this.showRange) return '';
    return `Min: ${this.min}, Max: ${this.max}`;
  }

  /**
   * Sync internal state with a new value
   */
  sync(nextValue: number): number {
    const next = clamp(toNum(nextValue, this.min), this.min, this.max);

    this.value = next;
    this.input.value = next;
    this.input.min = this.min;
    this.input.max = this.max;
    this.input.disabled = this.disabled;

    this.decrease.disabled = this.disabled || next <= this.min;
    this.increase.disabled = this.disabled || next >= this.max;

    return next;
  }
}
