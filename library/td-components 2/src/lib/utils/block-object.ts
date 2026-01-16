// src/lib/utils/block-object.ts

import { generateId, LogoObject, TagObject } from './id-helper';
import { IconObject } from '../components/cell/td-icon/td-icon.model';
import { ButtonIconObject } from '../components/cell/td-button-icon/td-button-icon.model';
import { LinkIconObject } from '../components/cell/td-link-icon/td-link-icon.model';
import { QuantityObject } from '../components/cell/td-quantity/td-quantity.model';
import { MediaObject } from '../components/cell/td-media/td-media.model';

export interface BlockConfig {
  id?: string;
  name?: string;
  className?: string;
  colClass?: string;
  ariaLabel?: string;
  icon?: any;
  iconClass?: string;
  logo?: any;
  tags?: any[];
  quantity?: any;
  buttonIcon?: any;
  linkIcon?: any;
  media?: any;
}

export class BlockObject {
  id: string;
  name: string;
  className: string;
  colClass: string;
  ariaLabel: string;
  icon: IconObject | null;
  logo: LogoObject | null;
  tags: TagObject[];
  quantity: QuantityObject | null;
  buttonIcon: ButtonIconObject | null;
  linkIcon: LinkIconObject | null;
  media: MediaObject | null;

  constructor(block: BlockConfig = {}) {
    this.id = block.id ?? generateId('block');
    this.name = typeof block.name === 'string' ? block.name : '';
    this.className = block.className ?? '';
    this.colClass = block.colClass ?? 'col-12';
    this.ariaLabel = typeof block.ariaLabel === 'string' ? block.ariaLabel : this.name || '';

    /* ----- Icon ----- */
    const rawIcon = block.icon || (block.iconClass ? { iconClass: block.iconClass } : null);
    this.icon = rawIcon
      ? rawIcon instanceof IconObject
        ? rawIcon
        : new IconObject(rawIcon)
      : null;

    /* ----- Logo ----- */
    const rawLogo = block.logo || null;
    this.logo = rawLogo
      ? rawLogo instanceof LogoObject
        ? rawLogo
        : new LogoObject(rawLogo)
      : null;

    /* ----- Tags ----- */
    const rawTags = Array.isArray(block.tags) ? block.tags : [];
    this.tags = rawTags
      .filter(Boolean)
      .map((t) => (t instanceof TagObject ? t : new TagObject(t || {})));

    /* ----- Quantity ----- */
    const rawQuantity = block.quantity || null;
    if (rawQuantity) {
      const quantityCfg = { name: this.name || this.id, ...rawQuantity };
      this.quantity = rawQuantity instanceof QuantityObject
        ? rawQuantity
        : new QuantityObject(quantityCfg);
    } else {
      this.quantity = null;
    }

    /* ----- ButtonIcon ----- */
    const rawButtonIcon = block.buttonIcon || null;
    this.buttonIcon = rawButtonIcon
      ? rawButtonIcon instanceof ButtonIconObject
        ? rawButtonIcon
        : new ButtonIconObject(rawButtonIcon)
      : null;

    /* ----- LinkIcon ----- */
    const rawLinkIcon = block.linkIcon || null;
    this.linkIcon = rawLinkIcon
      ? rawLinkIcon instanceof LinkIconObject
        ? rawLinkIcon
        : new LinkIconObject(rawLinkIcon)
      : null;

    /* ----- Media ----- */
    const rawMedia = block.media || null;
    this.media = rawMedia
      ? rawMedia instanceof MediaObject
        ? rawMedia
        : new MediaObject(rawMedia)
      : null;
  }

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
    return Array.isArray(this.tags) && this.tags.some((t) => t && t.name && t.name.trim().length > 0);
  }

  hasQuantity(): boolean {
    return !!(this.quantity && this.quantity.name);
  }

  hasButtonIcon(): boolean {
    return !!(this.buttonIcon && this.buttonIcon.icon);
  }

  hasLinkIcon(): boolean {
    return !!(this.linkIcon && this.linkIcon.href);
  }

  hasText(): boolean {
    return !!(this.name && this.name.trim().length > 0);
  }

  getContentType(): string {
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
}
