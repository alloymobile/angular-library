// src/lib/components/cell/td-link-icon/td-link-icon.model.ts

import { generateId } from '../../../utils/id-helper';
import { IconObject, IconConfig } from '../td-icon/td-icon.model';

/**
 * LinkIconConfig - Configuration for TdLinkIcon component
 */
export interface LinkIconConfig {
  href: string;
  icon: IconConfig | IconObject;
  name?: string;
  id?: string;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
  ariaLabel?: string;
  onClick?: (e: Event) => void;
}

export class LinkIconObject {
  id: string;
  href: string;
  icon: IconObject;
  name?: string;
  className: string;
  active: string;
  target?: string;
  rel?: string;
  title: string;
  ariaLabel: string;
  onClick?: (e: Event) => void;

  constructor(linkIcon: LinkIconConfig) {
    if (!linkIcon.href) {
      throw new Error('LinkIconObject requires `href`.');
    }
    if (!linkIcon.icon) {
      throw new Error('LinkIconObject requires `icon`.');
    }

    this.id = linkIcon.id ?? generateId('link-icon');
    this.href = linkIcon.href;

    // Hydrate icon
    this.icon = linkIcon.icon instanceof IconObject
      ? linkIcon.icon
      : new IconObject(linkIcon.icon as IconConfig);

    this.name = linkIcon.name;
    this.className = linkIcon.className ?? 'nav-link';
    this.active = linkIcon.active ?? '';
    this.target = linkIcon.target;
    this.rel = linkIcon.rel;

    // Better defaults
    this.title = linkIcon.title ?? linkIcon.name ?? linkIcon.href;
    this.ariaLabel = linkIcon.ariaLabel ?? linkIcon.title ?? linkIcon.name ?? 'Link';
    this.onClick = linkIcon.onClick;
  }

  /**
   * Check if link has a text label
   */
  hasLabel(): boolean {
    return Boolean(this.name);
  }

  /**
   * Compute safe rel attribute for external links
   */
  getSafeRel(): string | undefined {
    if (this.target === '_blank') {
      return this.rel
        ? `${this.rel} noopener noreferrer`
        : 'noopener noreferrer';
    }
    return this.rel;
  }
}
