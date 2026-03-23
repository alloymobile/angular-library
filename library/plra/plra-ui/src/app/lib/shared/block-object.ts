/**
 * BlockObject - Universal field container for card layouts
 *
 * Supports rendering ONE of the following (checked in priority order):
 *   1. media      → Media gallery (images/videos/3D)
 *   2. logo       → Simple image
 *   3. icon       → Icon element
 *   4. tags       → Vertical stack of badges
 *   5. quantity   → Number input with +/- buttons
 *   6. buttonIcon → Icon button for actions
 *   7. linkIcon   → Icon link for navigation
 *   8. name       → Plain text (fallback)
 */

import { generateId } from './id-helper';
import { IconObject, IconObjectConfig } from './icon-object';
import { LogoObject, LogoObjectConfig } from './logo-object';
import { TagObject, TagObjectConfig } from './tag-object';

/* ----- Supporting interfaces for nested objects ----- */

export interface MediaItemConfig {
  id?: string;
  url?: string;
  type?: 'image' | 'video' | '3d';
  alt?: string;
  thumbnail?: string;
}

export interface MediaObjectConfig {
  id?: string;
  items?: MediaItemConfig[];
  className?: string;
}

export class MediaObject {
  readonly id: string;
  readonly items: MediaItemConfig[];
  readonly className: string;

  constructor(media: MediaObjectConfig = {}) {
    this.id = media.id ?? generateId('media');
    this.items = Array.isArray(media.items) ? media.items : [];
    this.className = typeof media.className === 'string' ? media.className : '';
  }

  hasItems(): boolean {
    return this.items.length > 0;
  }
}

export interface QuantityObjectConfig {
  id?: string;
  name?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export class QuantityObject {
  readonly id: string;
  readonly name: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly className: string;
  readonly disabled: boolean;

  constructor(quantity: QuantityObjectConfig = {}) {
    this.id = quantity.id ?? generateId('quantity');
    this.name = typeof quantity.name === 'string' ? quantity.name : '';
    this.value = typeof quantity.value === 'number' ? quantity.value : 0;
    this.min = typeof quantity.min === 'number' ? quantity.min : 0;
    this.max = typeof quantity.max === 'number' ? quantity.max : 999;
    this.step = typeof quantity.step === 'number' ? quantity.step : 1;
    this.className = typeof quantity.className === 'string' ? quantity.className : '';
    this.disabled = !!quantity.disabled;
  }
}

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
  readonly id: string;
  readonly name: string;
  readonly to: string;
  readonly icon: IconObject;
  readonly className: string;
  readonly active: string;
  readonly target: string;
  readonly rel: string;
  readonly title: string;
  readonly ariaLabel: string;

  constructor(linkIcon: LinkIconObjectConfig = {}) {
    this.id = linkIcon.id ?? generateId('link-icon');
    this.name = typeof linkIcon.name === 'string' ? linkIcon.name : '';
    this.to = typeof linkIcon.to === 'string' ? linkIcon.to : (linkIcon.href ?? '');
    this.icon = linkIcon.icon instanceof IconObject
      ? linkIcon.icon
      : new IconObject(linkIcon.icon || {});
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
  quantity?: QuantityObjectConfig | QuantityObject;
  buttonIcon?: ButtonIconObjectConfig | ButtonIconObject;
  linkIcon?: LinkIconObjectConfig | LinkIconObject;
  media?: MediaObjectConfig | MediaObject;
}

/* ----- BlockObject Class ----- */

export class BlockObject {
  readonly id: string;
  readonly name: string;
  readonly className: string;
  readonly colClass: string;
  readonly ariaLabel: string;
  readonly icon: IconObject | null;
  readonly logo: LogoObject | null;
  readonly tags: TagObject[];
  readonly quantity: QuantityObject | null;
  readonly buttonIcon: ButtonIconObject | null;
  readonly linkIcon: LinkIconObject | null;
  readonly media: MediaObject | null;

  constructor(block: BlockObjectConfig = {}) {
    this.id = block.id ?? generateId('block');
    this.name = typeof block.name === 'string' ? block.name : '';
    this.className = typeof block.className === 'string' ? block.className : '';
    this.colClass = typeof block.colClass === 'string' ? block.colClass : 'col-12';
    this.ariaLabel = typeof block.ariaLabel === 'string' ? block.ariaLabel : this.name;

    // Icon
    const rawIcon = block.icon || (block.iconClass ? { iconClass: block.iconClass } : null);
    this.icon = rawIcon
      ? (rawIcon instanceof IconObject ? rawIcon : new IconObject(rawIcon))
      : null;

    // Logo
    this.logo = block.logo
      ? (block.logo instanceof LogoObject ? block.logo : new LogoObject(block.logo))
      : null;

    // Tags
    const rawTags = Array.isArray(block.tags) ? block.tags : [];
    this.tags = rawTags
      .filter(Boolean)
      .map(t => t instanceof TagObject ? t : new TagObject(t || {}));

    // Quantity
    if (block.quantity) {
      const quantityCfg = { name: this.name || this.id, ...block.quantity };
      this.quantity = block.quantity instanceof QuantityObject
        ? block.quantity
        : new QuantityObject(quantityCfg);
    } else {
      this.quantity = null;
    }

    // ButtonIcon
    this.buttonIcon = block.buttonIcon
      ? (block.buttonIcon instanceof ButtonIconObject ? block.buttonIcon : new ButtonIconObject(block.buttonIcon))
      : null;

    // LinkIcon
    this.linkIcon = block.linkIcon
      ? (block.linkIcon instanceof LinkIconObject ? block.linkIcon : new LinkIconObject(block.linkIcon))
      : null;

    // Media
    this.media = block.media
      ? (block.media instanceof MediaObject ? block.media : new MediaObject(block.media))
      : null;
  }

  /* ----- Type checks (priority order for rendering) ----- */

  hasMedia(): boolean {
    return !!(this.media && this.media.items && this.media.items.length > 0);
  }

  hasLogo(): boolean {
    return !!(this.logo && this.logo.imageUrl);
  }

  hasIcon(): boolean {
    return !!(this.icon && this.icon.iconClass);
  }

  hasTags(): boolean {
    return Array.isArray(this.tags) && this.tags.some(t => t && t.name && t.name.trim().length > 0);
  }

  hasQuantity(): boolean {
    return !!(this.quantity && this.quantity.name);
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

  getContentType(): 'media' | 'logo' | 'icon' | 'tags' | 'quantity' | 'buttonIcon' | 'linkIcon' | 'text' | 'empty' {
    if (this.hasMedia()) return 'media';
    if (this.hasLogo()) return 'logo';
    if (this.hasIcon()) return 'icon';
    if (this.hasTags()) return 'tags';
    if (this.hasQuantity()) return 'quantity';
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
