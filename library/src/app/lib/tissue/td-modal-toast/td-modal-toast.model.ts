/**
 * ModalToastObject - Model for confirmation/toast modal
 *
 * Simple modal with a message and confirm/cancel actions.
 * Used for confirmations, alerts, and simple notifications.
 */

import { generateId } from '../../share';

export interface ButtonObjectConfig {
  id?: string;
  name?: string;
  className?: string;
  active?: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

export class ButtonObject {
  readonly id: string;
  readonly name: string;
  readonly className: string;
  readonly active: string;
  readonly disabled: boolean;
  readonly title: string;
  readonly ariaLabel: string;
  readonly tabIndex: number;

  constructor(button: ButtonObjectConfig = {}) {
    this.id = button.id ?? generateId('btn');
    this.name = typeof button.name === 'string' ? button.name : '';
    this.className = typeof button.className === 'string' ? button.className : 'btn btn-primary';
    this.active = typeof button.active === 'string' ? button.active : '';
    this.disabled = !!button.disabled;
    this.title = typeof button.title === 'string' ? button.title : '';
    this.ariaLabel = typeof button.ariaLabel === 'string' ? button.ariaLabel : this.name;
    this.tabIndex = typeof button.tabIndex === 'number' ? button.tabIndex : 0;
  }

  /**
   * Get combined CSS classes including active state
   */
  getCombinedClasses(): string {
    return [this.className, this.active].filter(Boolean).join(' ');
  }
}

export interface ModalToastObjectConfig {
  id?: string;
  title?: string;
  className?: string;
  action?: string;
  submit?: ButtonObjectConfig | ButtonObject;
  message?: string;
}

export class ModalToastObject {
  readonly id: string;
  readonly title: string;
  readonly className: string;
  readonly action: string;
  readonly submit: ButtonObject;
  readonly message: string;

  constructor(modalToast: ModalToastObjectConfig = {}) {
    this.id = modalToast.id ?? generateId('modalToast');
    this.title = typeof modalToast.title === 'string' ? modalToast.title : '';
    this.className = typeof modalToast.className === 'string' ? modalToast.className : 'modal fade';
    this.action = typeof modalToast.action === 'string' ? modalToast.action : '';
    this.message = typeof modalToast.message === 'string' ? modalToast.message : '';

    // Normalize submit button
    if (modalToast.submit instanceof ButtonObject) {
      this.submit = modalToast.submit;
    } else if (modalToast.submit && typeof modalToast.submit === 'object') {
      this.submit = new ButtonObject(modalToast.submit);
    } else {
      this.submit = new ButtonObject({
        name: 'OK',
        className: 'btn btn-primary',
      });
    }
  }

  /**
   * Check if modal has a message
   */
  hasMessage(): boolean {
    return this.message.trim().length > 0;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): ModalToastObjectConfig {
    return {
      id: this.id,
      title: this.title,
      className: this.className,
      action: this.action,
      message: this.message,
    };
  }
}
