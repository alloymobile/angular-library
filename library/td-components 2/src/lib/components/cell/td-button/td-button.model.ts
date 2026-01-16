// src/lib/components/cell/td-button/td-button.model.ts

import { generateId } from '../../../utils/id-helper';

/**
 * ButtonConfig - Configuration for TdButton component
 */
export interface ButtonConfig {
  name: string;
  id?: string;
  className?: string;
  active?: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
  onClick?: (e: Event, self: ButtonObject) => void;
  onKeyDown?: (e: Event, self: ButtonObject) => void;
  onKeyUp?: (e: Event, self: ButtonObject) => void;
  onFocus?: (e: Event, self: ButtonObject) => void;
  onBlur?: (e: Event, self: ButtonObject) => void;
  onMouseEnter?: (e: Event, self: ButtonObject) => void;
  onMouseLeave?: (e: Event, self: ButtonObject) => void;
}

export class ButtonObject {
  id: string;
  name: string;
  className: string;
  active: string;
  disabled: boolean;
  title: string;
  ariaLabel: string;
  tabIndex?: number;
  onClick?: (e: Event, self: ButtonObject) => void;
  onKeyDown?: (e: Event, self: ButtonObject) => void;
  onKeyUp?: (e: Event, self: ButtonObject) => void;
  onFocus?: (e: Event, self: ButtonObject) => void;
  onBlur?: (e: Event, self: ButtonObject) => void;
  onMouseEnter?: (e: Event, self: ButtonObject) => void;
  onMouseLeave?: (e: Event, self: ButtonObject) => void;

  constructor(button: ButtonConfig) {
    if (!button.name) {
      throw new Error('ButtonObject requires `name`.');
    }

    this.id = button.id ?? generateId('btn');
    this.name = button.name;
    this.className = button.className ?? 'btn btn-primary';
    this.active = button.active ?? '';
    this.disabled = !!button.disabled;
    this.title = button.title ?? button.name;
    this.ariaLabel = button.ariaLabel ?? button.name;
    this.tabIndex = button.tabIndex;

    // Optional per-event callbacks
    this.onClick = button.onClick;
    this.onKeyDown = button.onKeyDown;
    this.onKeyUp = button.onKeyUp;
    this.onFocus = button.onFocus;
    this.onBlur = button.onBlur;
    this.onMouseEnter = button.onMouseEnter;
    this.onMouseLeave = button.onMouseLeave;
  }
}
