/**
 * TdIconTextModel - Icon with text component model
 *
 * Displays an icon alongside text value (e.g., 🔒 2.50)
 *
 * @property icon - Required. TdIconModel instance or icon config for the icon.
 * @property value - Required. The text/number value to display.
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. Wrapper className. Default: "d-inline-flex align-items-center gap-1"
 * @property valueClassName - Optional. CSS class for the value text.
 * @property iconPosition - Optional. Position of icon relative to text. Default: "left"
 */

import { generateId } from '../../share/id-helper';
import { TdIconModel } from '../td-icon/td-icon.model';

export interface TdIconTextConfig {
  icon: TdIconModel | { iconClass: string; className?: string };
  value: string | number | null | undefined;
  id?: string;
  className?: string;
  valueClassName?: string;
  iconPosition?: 'left' | 'right';
}

export class TdIconTextModel {
  readonly id: string;
  readonly icon: TdIconModel;
  readonly value: string | number | null | undefined;
  readonly className: string;
  readonly valueClassName: string;
  readonly iconPosition: 'left' | 'right';

  constructor(config: TdIconTextConfig) {
    if (!config.icon) {
      throw new Error('TdIconTextModel requires `icon`.');
    }

    this.id = config.id ?? generateId('icon-text');

    // Normalize icon to TdIconModel
    this.icon = config.icon instanceof TdIconModel
      ? config.icon
      : new TdIconModel(config.icon);

    this.value = config.value;
    this.className = config.className ?? 'd-inline-flex align-items-center gap-1';
    this.valueClassName = config.valueClassName ?? '';
    this.iconPosition = config.iconPosition ?? 'left';
  }

  /**
   * Get formatted display value
   */
  getDisplayValue(): string {
    if (this.value === null || this.value === undefined) {
      return '—';
    }
    if (typeof this.value === 'number') {
      return this.value.toFixed(2);
    }
    return String(this.value);
  }

  /**
   * Check if value exists
   */
  hasValue(): boolean {
    return this.value !== null && this.value !== undefined && this.value !== '';
  }
}