// src/lib/components/tissue/td-navbar/td-navbar.model.ts

import { generateId } from '../../../utils/id-helper';
import { LinkLogoObject, LinkLogoConfig } from '../../cell/td-link-logo/td-link-logo.model';
import { LinkBarObject, LinkBarConfig } from '../td-link-bar/td-link-bar.model';

/**
 * NavBarConfig - Configuration for TdNavBar component
 */
export interface NavBarConfig {
  id?: string;
  className?: string;
  logo?: LinkLogoConfig | LinkLogoObject;
  linkBar?: LinkBarConfig | LinkBarObject;
}

export class NavBarObject {
  id: string;
  className: string;
  logo: LinkLogoObject;
  linkBar: LinkBarObject;

  constructor(nav: NavBarConfig = {}) {
    this.id = nav.id ?? generateId('navbar');
    this.className = nav.className ?? 'navbar navbar-expand-lg navbar-light bg-light';

    // Normalize logo into LinkLogoObject
    if (nav.logo instanceof LinkLogoObject) {
      this.logo = nav.logo;
    } else {
      const fallbackLogoConfig = nav.logo ?? {
        href: '/',
        logo: '/logos/alloy.svg',
        name: 'Alloy',
        width: 110,
        height: 28,
        logoAlt: 'Alloy',
        className: 'navbar-brand d-flex align-items-center gap-2'
      };
      this.logo = new LinkLogoObject(fallbackLogoConfig);
    }

    // Normalize linkBar into LinkBarObject
    if (nav.linkBar instanceof LinkBarObject) {
      this.linkBar = nav.linkBar;
    } else {
      const rawLinkBar = nav.linkBar ?? {};
      this.linkBar = new LinkBarObject({
        id: rawLinkBar.id,
        className: rawLinkBar.className ?? 'navbar-nav ms-auto mb-2 mb-lg-0 gap-2',
        title: rawLinkBar.title ?? { name: '', className: 'text-center fw-semibold mb-2' },
        type: rawLinkBar.type ?? 'TdLink',
        linkClass: rawLinkBar.linkClass ?? 'nav-item',
        selected: rawLinkBar.selected ?? 'active',
        links: Array.isArray(rawLinkBar.links) ? rawLinkBar.links : []
      });
    }
  }

  /**
   * Get collapse ID for mobile toggle
   */
  getCollapseId(): string {
    return `${this.id}-collapse`;
  }
}
