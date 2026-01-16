// src/lib/components/cell/td-link-logo/td-link-logo.model.ts

import { generateId } from '../../../utils/id-helper';

/**
 * LinkLogoConfig - Configuration for TdLinkLogo component
 */
export interface LinkLogoConfig {
  href: string;
  logo: string;
  name?: string;
  id?: string;
  width?: number | string;
  height?: number | string;
  logoAlt?: string;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
  ariaLabel?: string;
  onClick?: (e: Event) => void;
}

export class LinkLogoObject {
  id: string;
  href: string;
  logo: string;
  name?: string;
  width?: number | string;
  height?: number | string;
  logoAlt: string;
  className: string;
  active: string;
  target?: string;
  rel?: string;
  title: string;
  ariaLabel: string;
  onClick?: (e: Event) => void;

  constructor(linkLogo: LinkLogoConfig) {
    if (!linkLogo.href) {
      throw new Error('LinkLogoObject requires `href`.');
    }
    if (!linkLogo.logo) {
      throw new Error('LinkLogoObject requires `logo`.');
    }

    this.id = linkLogo.id ?? generateId('link-logo');
    this.href = linkLogo.href;
    this.logo = linkLogo.logo;
    this.name = linkLogo.name;
    this.width = linkLogo.width;
    this.height = linkLogo.height;

    // Alt text: prefer explicit alt, else name, else empty
    this.logoAlt = linkLogo.logoAlt ?? linkLogo.name ?? '';

    this.className = linkLogo.className ?? 'nav-link';
    this.active = linkLogo.active ?? '';
    this.target = linkLogo.target;
    this.rel = linkLogo.rel;

    // Better defaults
    this.title = linkLogo.title ?? linkLogo.name ?? linkLogo.href;
    this.ariaLabel = linkLogo.ariaLabel ?? linkLogo.title ?? linkLogo.name ?? 'Link';
    this.onClick = linkLogo.onClick;
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
