// src/lib/components/cell/td-button-icon/td-button-icon.model.ts

import { generateId } from '../../../utils/id-helper';
import { IconObject, IconConfig } from '../td-icon/td-icon.model';

/**
 * ButtonIconConfig - Configuration for TdButtonIcon component
 */
export interface ButtonIconConfig {
  icon: IconConfig | IconObject;
  name?: string;
  id?: string;
  className?: string;
  active?: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
  onClick?: (e: Event, self: ButtonIconObject) => void;
  onKeyDown?: (e: Event, self: ButtonIconObject) => void;
  onKeyUp?: (e: Event, self: ButtonIconObject) => void;
  onFocus?: (e: Event, self: ButtonIconObject) => void;
  onBlur?: (e: Event, self: ButtonIconObject) => void;
  onMouseEnter?: (e: Event, self: ButtonIconObject) => void;
  onMouseLeave?: (e: Event, self: ButtonIconObject) => void;
}

export class ButtonIconObject {
  id: string;
  icon: IconObject;
  name?: string;
  className: string;
  active: string;
  disabled: boolean;
  title: string;
  ariaLabel: string;
  tabIndex?: number;
  onClick?: (e: Event, self: ButtonIconObject) => void;
  onKeyDown?: (e: Event, self: ButtonIconObject) => void;
  onKeyUp?: (e: Event, self: ButtonIconObject) => void;
  onFocus?: (e: Event, self: ButtonIconObject) => void;
  onBlur?: (e: Event, self: ButtonIconObject) => void;
  onMouseEnter?: (e: Event, self: ButtonIconObject) => void;
  onMouseLeave?: (e: Event, self: ButtonIconObject) => void;

  constructor(btn: ButtonIconConfig) {
    if (!btn.icon) {
      throw new Error('ButtonIconObject requires `icon`.');
    }

    this.id = btn.id ?? generateId('btn-icon');
    this.name = btn.name;

    this.className = btn.className ?? 'btn btn-primary';
    this.active = btn.active ?? '';
    this.disabled = !!btn.disabled;

    const fallbackLabel = this.name || 'icon button';
    this.title = btn.title ?? fallbackLabel;
    this.ariaLabel = btn.ariaLabel ?? fallbackLabel;
    this.tabIndex = btn.tabIndex;

    // Hydrate icon
    this.icon = btn.icon instanceof IconObject
      ? btn.icon
      : new IconObject(btn.icon as IconConfig);

    // Optional per-event callbacks
    this.onClick = btn.onClick;
    this.onKeyDown = btn.onKeyDown;
    this.onKeyUp = btn.onKeyUp;
    this.onFocus = btn.onFocus;
    this.onBlur = btn.onBlur;
    this.onMouseEnter = btn.onMouseEnter;
    this.onMouseLeave = btn.onMouseLeave;
  }

  /**
   * Check if button has a text label
   */
  hasLabel(): boolean {
    return Boolean(this.name);
  }
}
