// src/lib/components/tissue/td-link-bar/td-link-bar.model.ts

import { generateId, TagObject } from '../../../utils/id-helper';
import { LinkObject } from '../../cell/td-link/td-link.model';
import { LinkIconObject } from '../../cell/td-link-icon/td-link-icon.model';
import { LinkLogoObject } from '../../cell/td-link-logo/td-link-logo.model';

/**
 * LinkBarConfig - Configuration for TdLinkBar component
 */
export interface LinkBarConfig {
  id?: string;
  className?: string;
  type?: 'TdLink' | 'TdLinkIcon' | 'TdLinkLogo';
  linkClass?: string;
  selected?: string;
  title?: any;
  links?: any[];
}

export class LinkBarObject {
  id: string;
  className: string;
  type: 'TdLink' | 'TdLinkIcon' | 'TdLinkLogo';
  linkClass: string;
  selected: string;
  title: TagObject;
  links: (LinkObject | LinkIconObject | LinkLogoObject)[];

  constructor(bar: LinkBarConfig = {}) {
    this.id = bar.id ?? generateId('linkBar');
    this.className = bar.className ?? 'd-flex justify-content-center';
    this.type = (bar.type as 'TdLink' | 'TdLinkIcon' | 'TdLinkLogo') ?? 'TdLink';
    this.linkClass = bar.linkClass ?? 'nav-item';
    this.selected = bar.selected ?? 'active';

    // Normalize title into a TagObject instance
    if (bar.title instanceof TagObject) {
      this.title = bar.title;
    } else if (bar.title) {
      this.title = new TagObject(bar.title);
    } else {
      this.title = new TagObject({});
    }

    // Normalize links into the proper link model instances
    const rawLinks = Array.isArray(bar.links) ? bar.links : [];

    if (this.type === 'TdLinkIcon') {
      this.links = rawLinks.map(item =>
        item instanceof LinkIconObject ? item : new LinkIconObject(item)
      );
    } else if (this.type === 'TdLinkLogo') {
      this.links = rawLinks.map(item =>
        item instanceof LinkLogoObject ? item : new LinkLogoObject(item)
      );
    } else {
      // Default "TdLink"
      this.links = rawLinks.map(item =>
        item instanceof LinkObject ? item : new LinkObject(item)
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

/**
 * Clone a link with updated active class and wrapped onClick
 */
export function cloneWithActiveAndClick(
  item: any,
  injectedActiveClass: string,
  isSelected: boolean,
  wrapClickFn: (e: Event) => void
): LinkObject | LinkIconObject | LinkLogoObject {
  const activeClass = isSelected ? injectedActiveClass : '';

  if (item instanceof LinkObject) {
    return new LinkObject({
      id: item.id,
      name: item.name,
      href: item.href,
      className: item.className,
      active: activeClass,
      target: item.target,
      rel: item.rel,
      onClick: wrapClickFn,
      title: item.title
    });
  }

  if (item instanceof LinkIconObject) {
    return new LinkIconObject({
      id: item.id,
      href: item.href,
      icon: item.icon,
      name: item.name,
      className: item.className,
      active: activeClass,
      target: item.target,
      rel: item.rel,
      onClick: wrapClickFn,
      title: item.title
    });
  }

  if (item instanceof LinkLogoObject) {
    return new LinkLogoObject({
      id: item.id,
      name: item.name,
      href: item.href,
      logo: item.logo,
      width: item.width,
      height: item.height,
      logoAlt: item.logoAlt,
      className: item.className,
      active: activeClass,
      target: item.target,
      rel: item.rel,
      onClick: wrapClickFn,
      title: item.title
    });
  }

  // If unknown, return as-is
  return item;
}
