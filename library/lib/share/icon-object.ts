/**
 * IconObject - Model for icon elements
 *
 * Used for FontAwesome or other icon library classes.
 */

import { generateId } from './id-helper';

export interface IconObjectConfig {
  id?: string;
  iconClass?: string;
  className?: string;
  title?: string;
  ariaLabel?: string;
}

export class IconObject {
  readonly id: string;
  readonly iconClass: string;
  readonly className: string;
  readonly title: string;
  readonly ariaLabel: string;

  constructor(icon: IconObjectConfig = {}) {
    this.id = icon.id ?? generateId('icon');
    this.iconClass = typeof icon.iconClass === 'string' ? icon.iconClass : '';
    this.className = typeof icon.className === 'string' ? icon.className : '';
    this.title = typeof icon.title === 'string' ? icon.title : '';
    this.ariaLabel = typeof icon.ariaLabel === 'string' ? icon.ariaLabel : '';
  }

  /**
   * Check if icon has a valid icon class
   */
  hasIcon(): boolean {
    return this.iconClass.trim().length > 0;
  }

  /**
   * Get combined CSS classes
   */
  getCombinedClasses(): string {
    return [this.iconClass, this.className].filter(Boolean).join(' ');
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): IconObjectConfig {
    return {
      id: this.id,
      iconClass: this.iconClass,
      className: this.className,
      title: this.title,
      ariaLabel: this.ariaLabel,
    };
  }
}
