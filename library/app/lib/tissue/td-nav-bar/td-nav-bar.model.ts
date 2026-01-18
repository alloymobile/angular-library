/**
 * NavBarObject - Model for basic navigation bar
 *
 * Contains:
 * - Logo/brand link
 * - Link bar for navigation items
 * - Bootstrap navbar support
 */

import { generateId, LogoObject, LogoObjectConfig } from '../../share';
import { LinkBarObject, LinkBarObjectConfig, LinkLogoObject, LinkLogoObjectConfig } from '../td-link-bar/td-link-bar.model';

export interface NavBarObjectConfig {
  id?: string;
  className?: string;
  containerClass?: string;
  collapseId?: string;
  logo?: LinkLogoObjectConfig | LinkLogoObject;
  linkBar?: LinkBarObjectConfig | LinkBarObject;
  expand?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | false;
}

export class NavBarObject {
  readonly id: string;
  readonly className: string;
  readonly containerClass: string;
  readonly collapseId: string;
  readonly logo: LinkLogoObject;
  readonly linkBar: LinkBarObject;
  readonly expand: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | false;

  constructor(navbar: NavBarObjectConfig = {}) {
    this.id = navbar.id ?? generateId('navbar');
    this.className = typeof navbar.className === 'string'
      ? navbar.className
      : 'navbar navbar-expand-lg navbar-light bg-light';
    this.containerClass = typeof navbar.containerClass === 'string'
      ? navbar.containerClass
      : 'container-fluid';
    this.collapseId = navbar.collapseId ?? `${this.id}-collapse`;
    this.expand = navbar.expand ?? 'lg';

    // Normalize logo
    if (navbar.logo instanceof LinkLogoObject) {
      this.logo = navbar.logo;
    } else if (navbar.logo && typeof navbar.logo === 'object') {
      this.logo = new LinkLogoObject(navbar.logo);
    } else {
      this.logo = new LinkLogoObject({});
    }

    // Normalize linkBar
    if (navbar.linkBar instanceof LinkBarObject) {
      this.linkBar = navbar.linkBar;
    } else if (navbar.linkBar && typeof navbar.linkBar === 'object') {
      this.linkBar = new LinkBarObject({
        ...navbar.linkBar,
        className: navbar.linkBar.className ?? 'navbar-nav ms-auto mb-2 mb-lg-0',
      });
    } else {
      this.linkBar = new LinkBarObject({
        className: 'navbar-nav ms-auto mb-2 mb-lg-0',
      });
    }
  }

  /**
   * Check if logo exists
   */
  hasLogo(): boolean {
    return !!(this.logo && (this.logo.logo?.imageUrl || this.logo.name));
  }

  /**
   * Check if links exist
   */
  hasLinks(): boolean {
    return this.linkBar.links.length > 0;
  }

  /**
   * Get expand class for navbar
   */
  getExpandClass(): string {
    if (this.expand === false) return '';
    return `navbar-expand-${this.expand}`;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): NavBarObjectConfig {
    return {
      id: this.id,
      className: this.className,
      containerClass: this.containerClass,
      collapseId: this.collapseId,
      expand: this.expand,
    };
  }
}
