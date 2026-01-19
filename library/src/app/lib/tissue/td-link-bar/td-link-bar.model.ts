/**
 * LinkBarObject - Model for link navigation bar
 *
 * Supports multiple link types:
 * - LinkObject (standard links)
 * - LinkIconObject (links with icons)
 * - LinkLogoObject (links with logos)
 */

import { generateId, IconObject, IconObjectConfig, LogoObject, LogoObjectConfig, TagObject, TagObjectConfig } from '../../share';

/* ----- LinkObject ----- */

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
    this.className = typeof link.className === 'string' ? link.className : 'nav-link';
    this.active = typeof link.active === 'string' ? link.active : '';
    this.target = typeof link.target === 'string' ? link.target : '';
    this.rel = typeof link.rel === 'string' ? link.rel : '';
    this.title = typeof link.title === 'string' ? link.title : '';
  }

  getCombinedClasses(): string {
    return [this.className, this.active].filter(Boolean).join(' ');
  }
}

/* ----- LinkIconObject ----- */

export interface LinkIconObjectConfig {
  id?: string;
  name?: string;
  href?: string;
  icon?: IconObjectConfig | IconObject;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
}

export class LinkIconObject {
  readonly id: string;
  readonly name: string;
  readonly href: string;
  readonly icon: IconObject;
  readonly className: string;
  readonly active: string;
  readonly target: string;
  readonly rel: string;
  readonly title: string;

  constructor(link: LinkIconObjectConfig = {}) {
    this.id = link.id ?? generateId('link-icon');
    this.name = typeof link.name === 'string' ? link.name : '';
    this.href = typeof link.href === 'string' ? link.href : '#';
    this.icon = link.icon instanceof IconObject
      ? link.icon
      : new IconObject(link.icon || {});
    this.className = typeof link.className === 'string' ? link.className : 'nav-link';
    this.active = typeof link.active === 'string' ? link.active : '';
    this.target = typeof link.target === 'string' ? link.target : '';
    this.rel = typeof link.rel === 'string' ? link.rel : '';
    this.title = typeof link.title === 'string' ? link.title : '';
  }

  getCombinedClasses(): string {
    return [this.className, this.active].filter(Boolean).join(' ');
  }
}

/* ----- LinkLogoObject ----- */

export interface LinkLogoObjectConfig {
  id?: string;
  name?: string;
  href?: string;
  logo?: string | LogoObjectConfig | LogoObject;
  width?: number | string;
  height?: number | string;
  logoAlt?: string;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
}

export class LinkLogoObject {
  readonly id: string;
  readonly name: string;
  readonly href: string;
  readonly logo: LogoObject;
  readonly className: string;
  readonly active: string;
  readonly target: string;
  readonly rel: string;
  readonly title: string;

  constructor(link: LinkLogoObjectConfig = {}) {
    this.id = link.id ?? generateId('link-logo');
    this.name = typeof link.name === 'string' ? link.name : '';
    this.href = typeof link.href === 'string' ? link.href : '#';
    this.className = typeof link.className === 'string' ? link.className : 'navbar-brand d-flex align-items-center gap-2';
    this.active = typeof link.active === 'string' ? link.active : '';
    this.target = typeof link.target === 'string' ? link.target : '';
    this.rel = typeof link.rel === 'string' ? link.rel : '';
    this.title = typeof link.title === 'string' ? link.title : '';

    // Normalize logo
    if (link.logo instanceof LogoObject) {
      this.logo = link.logo;
    } else if (typeof link.logo === 'string') {
      this.logo = new LogoObject({
        imageUrl: link.logo,
        alt: link.logoAlt ?? link.name ?? 'Logo',
        width: link.width,
        height: link.height,
      });
    } else if (link.logo) {
      this.logo = new LogoObject(link.logo);
    } else {
      this.logo = new LogoObject({
        imageUrl: '',
        alt: link.logoAlt ?? link.name ?? 'Logo',
        width: link.width,
        height: link.height,
      });
    }
  }

  getCombinedClasses(): string {
    return [this.className, this.active].filter(Boolean).join(' ');
  }
}

/* ----- LinkBarObject ----- */

export type LinkBarItem = LinkObject | LinkIconObject | LinkLogoObject;

export interface LinkBarObjectConfig {
  id?: string;
  className?: string;
  title?: TagObjectConfig | TagObject;
  type?: 'AlloyLink' | 'AlloyLinkIcon' | 'AlloyLinkLogo' | string;
  linkClass?: string;
  links?: (LinkObjectConfig | LinkIconObjectConfig | LinkLogoObjectConfig | LinkBarItem)[];
  selected?: string;
}

export class LinkBarObject {
  readonly id: string;
  readonly className: string;
  readonly title: TagObject;
  readonly type: string;
  readonly linkClass: string;
  readonly links: LinkBarItem[];
  readonly selected: string;

  constructor(bar: LinkBarObjectConfig = {}) {
    this.id = bar.id ?? generateId('linkBar');
    this.className = typeof bar.className === 'string' ? bar.className : 'd-flex justify-content-center';
    this.type = bar.type ?? 'AlloyLink';
    this.linkClass = typeof bar.linkClass === 'string' ? bar.linkClass : 'nav-item';
    this.selected = typeof bar.selected === 'string' ? bar.selected : 'active';

    // Normalize title
    if (bar.title instanceof TagObject) {
      this.title = bar.title;
    } else if (bar.title) {
      this.title = new TagObject(bar.title);
    } else {
      this.title = new TagObject({});
    }

    // Normalize links based on type
    const rawLinks = Array.isArray(bar.links) ? bar.links : [];

    if (this.type === 'AlloyLinkIcon') {
      this.links = rawLinks.map(item =>
        item instanceof LinkIconObject ? item : new LinkIconObject(item as LinkIconObjectConfig)
      );
    } else if (this.type === 'AlloyLinkLogo') {
      this.links = rawLinks.map(item =>
        item instanceof LinkLogoObject ? item : new LinkLogoObject(item as LinkLogoObjectConfig)
      );
    } else {
      // Default "AlloyLink"
      this.links = rawLinks.map(item =>
        item instanceof LinkObject ? item : new LinkObject(item as LinkObjectConfig)
      );
    }
  }

  /**
   * Check if title should be displayed
   */
  hasTitle(): boolean {
    return !!(this.title && this.title.name && this.title.name.trim());
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): LinkBarObjectConfig {
    return {
      id: this.id,
      className: this.className,
      type: this.type,
      linkClass: this.linkClass,
      selected: this.selected,
    };
  }
}
