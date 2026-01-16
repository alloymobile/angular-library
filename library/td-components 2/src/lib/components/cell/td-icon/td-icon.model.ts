// src/lib/components/cell/td-icon/td-icon.model.ts

import { generateId } from '../../../utils/id-helper';

/**
 * IconConfig - Configuration for TdIcon component
 * @property {string} iconClass - Required. Font Awesome class string (for <i>).
 *                               e.g. "fa-solid fa-user" or "fa-solid fa-user fa-2x"
 * @property {string} [id] - Optional DOM id. Auto-generated if omitted.
 * @property {string} [className] - Optional wrapper <span> className.
 */
export interface IconConfig {
  iconClass: string;
  id?: string;
  className?: string;
}

export class IconObject {
  id: string;
  iconClass: string;
  className: string;

  /**
   * Build a new IconObject.
   * Normalizes config and generates stable DOM id.
   */
  constructor(icon: IconConfig) {
    if (!icon.iconClass) {
      throw new Error('IconObject requires `iconClass`.');
    }

    this.id = icon.id ?? generateId('icon');
    this.iconClass = icon.iconClass;
    this.className = icon.className ?? 'd-inline-flex align-items-center justify-content-center';
  }
}
