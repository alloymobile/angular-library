/**
 * ButtonBarObject - Model for button group/bar
 *
 * Supports multiple button types:
 * - ButtonObject (standard buttons)
 * - ButtonIconObject (icon buttons)
 * - ButtonDropDownObject (dropdown buttons)
 */

import { generateId, IconObject, IconObjectConfig, TagObject, TagObjectConfig } from '../../share';

/* ----- ButtonObject ----- */

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

  getCombinedClasses(): string {
    return [this.className, this.active].filter(Boolean).join(' ');
  }
}

/* ----- ButtonIconObject ----- */

export interface ButtonIconObjectConfig {
  id?: string;
  name?: string;
  icon?: IconObjectConfig | IconObject;
  className?: string;
  active?: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

export class ButtonIconObject {
  readonly id: string;
  readonly name: string;
  readonly icon: IconObject;
  readonly className: string;
  readonly active: string;
  readonly disabled: boolean;
  readonly title: string;
  readonly ariaLabel: string;
  readonly tabIndex: number;

  constructor(buttonIcon: ButtonIconObjectConfig = {}) {
    this.id = buttonIcon.id ?? generateId('btn-icon');
    this.name = typeof buttonIcon.name === 'string' ? buttonIcon.name : '';
    this.icon = buttonIcon.icon instanceof IconObject
      ? buttonIcon.icon
      : new IconObject(buttonIcon.icon || {});
    this.className = typeof buttonIcon.className === 'string' ? buttonIcon.className : 'btn btn-outline-secondary';
    this.active = typeof buttonIcon.active === 'string' ? buttonIcon.active : '';
    this.disabled = !!buttonIcon.disabled;
    this.title = typeof buttonIcon.title === 'string' ? buttonIcon.title : '';
    this.ariaLabel = typeof buttonIcon.ariaLabel === 'string' ? buttonIcon.ariaLabel : this.name;
    this.tabIndex = typeof buttonIcon.tabIndex === 'number' ? buttonIcon.tabIndex : 0;
  }

  getCombinedClasses(): string {
    return [this.className, this.active].filter(Boolean).join(' ');
  }
}

/* ----- LinkObject (for dropdown items) ----- */

export interface LinkObjectConfig {
  id?: string;
  name?: string;
  href?: string;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
}

export class LinkObject {
  readonly id: string;
  readonly name: string;
  readonly href: string;
  readonly className: string;
  readonly active: string;
  readonly target: string;
  readonly rel: string;
  readonly title: string;

  constructor(link: LinkObjectConfig = {}) {
    this.id = link.id ?? generateId('link');
    this.name = typeof link.name === 'string' ? link.name : '';
    this.href = typeof link.href === 'string' ? link.href : '#';
    this.className = typeof link.className === 'string' ? link.className : 'dropdown-item';
    this.active = typeof link.active === 'string' ? link.active : '';
    this.target = typeof link.target === 'string' ? link.target : '';
    this.rel = typeof link.rel === 'string' ? link.rel : '';
    this.title = typeof link.title === 'string' ? link.title : '';
  }

  getCombinedClasses(): string {
    return [this.className, this.active].filter(Boolean).join(' ');
  }
}

/* ----- LinkBarObject (for dropdown menu) ----- */

export interface LinkBarObjectConfig {
  id?: string;
  className?: string;
  links?: (LinkObjectConfig | LinkObject)[];
}

export class LinkBarObject {
  readonly id: string;
  readonly className: string;
  readonly links: LinkObject[];

  constructor(linkBar: LinkBarObjectConfig = {}) {
    this.id = linkBar.id ?? generateId('linkBar');
    this.className = typeof linkBar.className === 'string' ? linkBar.className : 'dropdown-menu';
    
    const rawLinks = Array.isArray(linkBar.links) ? linkBar.links : [];
    this.links = rawLinks.map(link =>
      link instanceof LinkObject ? link : new LinkObject(link)
    );
  }
}

/* ----- ButtonDropDownObject ----- */

export interface ButtonDropDownObjectConfig {
  id?: string;
  name?: string;
  icon?: IconObjectConfig | IconObject;
  className?: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  linkBar?: LinkBarObjectConfig | LinkBarObject;
  type?: string;
}

export class ButtonDropDownObject {
  readonly id: string;
  readonly name: string;
  readonly icon: IconObject;
  readonly className: string;
  readonly disabled: boolean;
  readonly title: string;
  readonly ariaLabel: string;
  readonly linkBar: LinkBarObject;
  readonly type: string;

  constructor(dropdown: ButtonDropDownObjectConfig = {}) {
    this.id = dropdown.id ?? generateId('btn-dropdown');
    this.name = typeof dropdown.name === 'string' ? dropdown.name : '';
    this.icon = dropdown.icon instanceof IconObject
      ? dropdown.icon
      : new IconObject(dropdown.icon || {});
    this.className = typeof dropdown.className === 'string' ? dropdown.className : 'btn btn-secondary dropdown-toggle';
    this.disabled = !!dropdown.disabled;
    this.title = typeof dropdown.title === 'string' ? dropdown.title : '';
    this.ariaLabel = typeof dropdown.ariaLabel === 'string' ? dropdown.ariaLabel : this.name;
    this.linkBar = dropdown.linkBar instanceof LinkBarObject
      ? dropdown.linkBar
      : new LinkBarObject(dropdown.linkBar || {});
    this.type = 'dropdown';
  }
}

/* ----- ButtonBarObject ----- */

export type ButtonBarItem = ButtonObject | ButtonIconObject | ButtonDropDownObject;

export interface ButtonBarObjectConfig {
  id?: string;
  className?: string;
  title?: TagObjectConfig | TagObject;
  type?: 'AlloyButton' | 'AlloyButtonIcon' | string;
  buttonClass?: string;
  buttons?: (ButtonObjectConfig | ButtonIconObjectConfig | ButtonDropDownObjectConfig | ButtonBarItem)[];
  selected?: string;
}

export class ButtonBarObject {
  readonly id: string;
  readonly className: string;
  readonly title: TagObject;
  readonly type: string;
  readonly buttonClass: string;
  readonly buttons: ButtonBarItem[];
  readonly selected: string;

  constructor(bar: ButtonBarObjectConfig = {}) {
    this.id = bar.id ?? generateId('buttonBar');
    this.className = typeof bar.className === 'string' ? bar.className : 'd-flex justify-content-center';
    this.type = bar.type ?? 'AlloyButton';
    this.buttonClass = typeof bar.buttonClass === 'string' ? bar.buttonClass : 'nav-item';
    this.selected = typeof bar.selected === 'string' ? bar.selected : 'active';

    // Normalize title
    if (bar.title instanceof TagObject) {
      this.title = bar.title;
    } else if (bar.title) {
      this.title = new TagObject(bar.title);
    } else {
      this.title = new TagObject({});
    }

    // Normalize buttons
    const rawButtons = Array.isArray(bar.buttons) ? bar.buttons : [];
    this.buttons = rawButtons.map(b => this.normalizeButton(b));
  }

  private normalizeButton(b: any): ButtonBarItem {
    // Check if it's a dropdown
    const isDropdown =
      b instanceof ButtonDropDownObject ||
      b?.type === 'dropdown' ||
      b?.type === 'AlloyButtonDropDown' ||
      !!b?.linkBar;

    if (isDropdown) {
      return b instanceof ButtonDropDownObject ? b : new ButtonDropDownObject(b);
    }

    // Check type preference
    if (this.type === 'AlloyButtonIcon') {
      return b instanceof ButtonIconObject ? b : new ButtonIconObject(b);
    }

    // Default to ButtonObject
    return b instanceof ButtonObject ? b : new ButtonObject(b);
  }

  /**
   * Check if title should be displayed
   */
  hasTitle(): boolean {
    return !!(this.title && this.title.name && this.title.name.trim());
  }

  /**
   * Check if bar has dropdown items
   */
  hasDropdown(): boolean {
    return this.buttons.some(b => b instanceof ButtonDropDownObject);
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): ButtonBarObjectConfig {
    return {
      id: this.id,
      className: this.className,
      type: this.type,
      buttonClass: this.buttonClass,
      selected: this.selected,
    };
  }
}
