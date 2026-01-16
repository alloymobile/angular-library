// src/lib/components/tissue/td-button-bar/td-button-bar.model.ts

import { generateId, TagObject } from '../../../utils/id-helper';
import { ButtonObject } from '../../cell/td-button/td-button.model';
import { ButtonIconObject } from '../../cell/td-button-icon/td-button-icon.model';

/**
 * ButtonBarConfig - Configuration for TdButtonBar component
 */
export interface ButtonBarConfig {
  id?: string;
  className?: string;
  type?: 'TdButton' | 'TdButtonIcon';
  buttonClass?: string;
  title?: any;
  buttons?: any[];
}

export class ButtonBarObject {
  id: string;
  className: string;
  type: 'TdButton' | 'TdButtonIcon';
  buttonClass: string;
  title: TagObject;
  buttons: (ButtonObject | ButtonIconObject)[];

  constructor(bar: ButtonBarConfig = {}) {
    this.id = bar.id ?? generateId('buttonBar');
    this.className = bar.className ?? 'd-flex gap-2';
    this.type = (bar.type as 'TdButton' | 'TdButtonIcon') ?? 'TdButton';
    this.buttonClass = bar.buttonClass ?? '';

    // Normalize title into a TagObject instance
    if (bar.title instanceof TagObject) {
      this.title = bar.title;
    } else if (bar.title) {
      this.title = new TagObject(bar.title);
    } else {
      this.title = new TagObject({});
    }

    // Normalize buttons into the proper model instances
    const rawButtons = Array.isArray(bar.buttons) ? bar.buttons : [];

    if (this.type === 'TdButtonIcon') {
      this.buttons = rawButtons.map(item =>
        item instanceof ButtonIconObject ? item : new ButtonIconObject(item)
      );
    } else {
      // Default "TdButton"
      this.buttons = rawButtons.map(item =>
        item instanceof ButtonObject ? item : new ButtonObject(item)
      );
    }
  }

  /**
   * Check if title should be shown
   */
  hasTitle(): boolean {
    return !!(this.title && this.title.name);
  }
}
