// src/lib/components/cell/td-button-submit/td-button-submit.model.ts

import { generateId } from '../../../utils/id-helper';
import { IconObject, IconConfig } from '../td-icon/td-icon.model';

/**
 * ButtonSubmitConfig - Configuration for TdButtonSubmit component
 */
export interface ButtonSubmitConfig {
  name: string;
  icon: IconConfig | IconObject;
  id?: string;
  className?: string;
  active?: string;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
  onClick?: (e: Event, self: ButtonSubmitObject) => void;
}

export class ButtonSubmitObject {
  id: string;
  name: string;
  icon: IconObject;
  className: string;
  active: string;
  disabled: boolean;
  loading: boolean;
  title: string;
  ariaLabel: string;
  tabIndex?: number;
  onClick?: (e: Event, self: ButtonSubmitObject) => void;

  constructor(buttonSubmit: ButtonSubmitConfig) {
    if (!buttonSubmit.name) {
      throw new Error('ButtonSubmitObject requires `name`.');
    }
    if (!buttonSubmit.icon) {
      throw new Error('ButtonSubmitObject requires `icon`.');
    }

    this.id = buttonSubmit.id ?? generateId('btn-submit');
    this.name = buttonSubmit.name;

    this.className = buttonSubmit.className ?? 'btn btn-primary';
    this.active = buttonSubmit.active ?? '';
    this.disabled = !!buttonSubmit.disabled;
    this.loading = !!buttonSubmit.loading;

    this.title = buttonSubmit.title ?? buttonSubmit.name;
    this.ariaLabel = buttonSubmit.ariaLabel ?? buttonSubmit.name;
    this.tabIndex = buttonSubmit.tabIndex;

    // Hydrate icon
    this.icon = buttonSubmit.icon instanceof IconObject
      ? buttonSubmit.icon
      : new IconObject(buttonSubmit.icon as IconConfig);

    this.onClick = buttonSubmit.onClick;
  }

  /**
   * Get icon with spin class when loading
   */
  getComputedIcon(isLoading: boolean): IconObject {
    const iconClass = this.icon?.iconClass || '';
    
    // Add fa-spin only while loading (if not already present)
    const shouldSpin = isLoading && iconClass && 
      !/\bfa-spin\b/.test(iconClass) && 
      !/\bfa-pulse\b/.test(iconClass);
    
    const nextClass = shouldSpin ? `${iconClass} fa-spin` : iconClass;
    
    return new IconObject({
      id: this.icon?.id,
      iconClass: nextClass,
      className: this.icon?.className
    });
  }
}
