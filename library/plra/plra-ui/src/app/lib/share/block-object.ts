/**
 * BlockObject - Universal field container for card layouts
 *
 * Supports rendering ONE of the following (checked in priority order):
 *   1. logo       → Simple image
 *   2. icon       → Icon element
 *   3. tags       → Vertical stack of badges
 *   4. buttonIcon → Icon button for actions
 *   5. linkIcon   → Icon link for navigation
 *   6. name       → Plain text (fallback)
 */

import { generateId } from './id-helper';
import { IconObject, IconObjectConfig } from './icon-object';
import { LogoObject, LogoObjectConfig } from './logo-object';
import { TagObject, TagObjectConfig } from './tag-object';

/* ----- Supporting interfaces for nested objects ----- */

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
  id: string;
  name: string;
  icon: IconObject;
  className: string;
  active: string;
  disabled: boolean;
  title: string;
  ariaLabel: string;
  tabIndex: number;

  constructor(buttonIcon: ButtonIconObjectConfig = {}) {
    this.id = buttonIcon.id ?? generateId('btn-icon');
    this.name = typeof buttonIcon.name === 'string' ? buttonIcon.name : '';
    this.icon =
      buttonIcon.icon instanceof IconObject
        ? buttonIcon.icon
        : new IconObject(buttonIcon.icon || {});
    this.className =
      typeof buttonIcon.className === 'string'
        ? buttonIcon.className
        : 'btn btn-outline-secondary';
    this.active = typeof buttonIcon.active === 'string' ? buttonIcon.active : '';
    this.disabled = !!buttonIcon.disabled;
    this.title = typeof buttonIcon.title === 'string' ? buttonIcon.title : '';
    this.ariaLabel =
      typeof buttonIcon.ariaLabel === 'string' ? buttonIcon.ariaLabel : this.name;
    this.tabIndex = typeof buttonIcon.tabIndex === 'number' ? buttonIcon.tabIndex : 0;
  }
}

export interface LinkIconObjectConfig {
  id?: string;
  name?: string;
  to?: string;
  href?: string;
  icon?: IconObjectConfig | IconObject;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
  ariaLabel?: string;
}

export class LinkIconObject {
  id: string;
  name: string;
  to: string;
  icon: IconObject;
  className: string;
  active: string;
  target: string;
  rel: string;
  title: string;
  ariaLabel: string;

  constructor(linkIcon: LinkIconObjectConfig = {}) {
    this.id = linkIcon.id ?? generateId('link-icon');
    this.name = typeof linkIcon.name === 'string' ? linkIcon.name : '';
    this.to = typeof linkIcon.to === 'string' ? linkIcon.to : linkIcon.href ?? '';
    this.icon =
      linkIcon.icon instanceof IconObject ? linkIcon.icon : new IconObject(linkIcon.icon || {});
    this.className = typeof linkIcon.className === 'string' ? linkIcon.className : 'btn btn-link';
    this.active = typeof linkIcon.active === 'string' ? linkIcon.active : '';
    this.target = typeof linkIcon.target === 'string' ? linkIcon.target : '';
    this.rel = typeof linkIcon.rel === 'string' ? linkIcon.rel : '';
    this.title = typeof linkIcon.title === 'string' ? linkIcon.title : '';
    this.ariaLabel = typeof linkIcon.ariaLabel === 'string' ? linkIcon.ariaLabel : this.name;
  }
}

/* ----- BlockObject Config ----- */

export interface BlockObjectConfig {
  id?: string;
  name?: string;
  className?: string;
  colClass?: string;
  ariaLabel?: string;
  icon?: IconObjectConfig | IconObject;
  iconClass?: string;
  logo?: LogoObjectConfig | LogoObject;
  tags?: (TagObjectConfig | TagObject)[];
  buttonIcon?: ButtonIconObjectConfig | ButtonIconObject;
  linkIcon?: LinkIconObjectConfig | LinkIconObject;
}

/* ----- BlockObject Class ----- */

export class BlockObject {
  id: string;
  name: string;
  className: string;
  colClass: string;
  ariaLabel: string;
  icon: IconObject | null;
  logo: LogoObject | null;
  tags: TagObject[];
  buttonIcon: ButtonIconObject | null;
  linkIcon: LinkIconObject | null;

  constructor(block: BlockObjectConfig = {}) {
    this.id = block.id ?? generateId('block');
    this.name = typeof block.name === 'string' ? block.name : '';
    this.className = typeof block.className === 'string' ? block.className : '';
    this.colClass = typeof block.colClass === 'string' ? block.colClass : 'col-12';
    this.ariaLabel = typeof block.ariaLabel === 'string' ? block.ariaLabel : this.name;

    // Icon
    const rawIcon = block.icon || (block.iconClass ? { iconClass: block.iconClass } : null);
    this.icon = rawIcon ? (rawIcon instanceof IconObject ? rawIcon : new IconObject(rawIcon)) : null;

    // Logo
    this.logo = block.logo ? (block.logo instanceof LogoObject ? block.logo : new LogoObject(block.logo)) : null;

    // Tags
    const rawTags = Array.isArray(block.tags) ? block.tags : [];
    this.tags = rawTags
      .filter(Boolean)
      .map(t => (t instanceof TagObject ? t : new TagObject(t || {})));

    // ButtonIcon
    this.buttonIcon = block.buttonIcon
      ? block.buttonIcon instanceof ButtonIconObject
        ? block.buttonIcon
        : new ButtonIconObject(block.buttonIcon)
      : null;

    // LinkIcon
    this.linkIcon = block.linkIcon
      ? block.linkIcon instanceof LinkIconObject
        ? block.linkIcon
        : new LinkIconObject(block.linkIcon)
      : null;
  }

  /* ----- Type checks (priority order for rendering) ----- */

  hasLogo(): boolean {
    return !!(this.logo && this.logo.imageUrl);
  }

  hasIcon(): boolean {
    return !!(this.icon && this.icon.iconClass);
  }

  hasTags(): boolean {
    return Array.isArray(this.tags) && this.tags.some(t => t && t.name && t.name.trim().length > 0);
  }

  hasButtonIcon(): boolean {
    return !!(this.buttonIcon && this.buttonIcon.icon);
  }

  hasLinkIcon(): boolean {
    return !!(this.linkIcon && this.linkIcon.to);
  }

  hasText(): boolean {
    return !!(this.name && this.name.trim().length > 0);
  }

  getContentType(): 'logo' | 'icon' | 'tags' | 'buttonIcon' | 'linkIcon' | 'text' | 'empty' {
    if (this.hasLogo()) return 'logo';
    if (this.hasIcon()) return 'icon';
    if (this.hasTags()) return 'tags';
    if (this.hasButtonIcon()) return 'buttonIcon';
    if (this.hasLinkIcon()) return 'linkIcon';
    if (this.hasText()) return 'text';
    return 'empty';
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): BlockObjectConfig {
    return {
      id: this.id,
      name: this.name,
      className: this.className,
      colClass: this.colClass,
      ariaLabel: this.ariaLabel,
    };
  }
}
