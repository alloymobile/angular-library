/**
 * NavBarActionObject - Model for advanced navigation bar with auth support
 *
 * Extends NavBarObject with:
 * - Authentication state management (guest/user)
 * - Guest action bar
 * - User action bar
 * - Back button support
 * - Sidebar toggle support
 */

import { generateId, TagObject, TagObjectConfig } from '../../share';
import { LinkBarObject, LinkBarObjectConfig, LinkLogoObject, LinkLogoObjectConfig } from '../td-link-bar/td-link-bar.model';
import { ButtonBarObject, ButtonBarObjectConfig, ButtonIconObject, ButtonIconObjectConfig } from '../td-button-bar/td-button-bar.model';

export interface AuthConfig {
  mode?: 'guest' | 'user' | 'auto';
  storageKey?: string;
  storageType?: 'sessionStorage' | 'localStorage' | 'cookie';
}

export interface NavBarActionObjectConfig {
  id?: string;
  className?: string;
  containerClass?: string;
  collapseId?: string;
  sidebarId?: string;
  collapse?: boolean;
  brand?: LinkLogoObjectConfig | LinkLogoObject;
  title?: TagObjectConfig | TagObject;
  backButton?: ButtonIconObjectConfig | ButtonIconObject;
  linkBar?: LinkBarObjectConfig | LinkBarObject;
  auth?: AuthConfig;
  guestActions?: ButtonBarObjectConfig | ButtonBarObject;
  userActions?: ButtonBarObjectConfig | ButtonBarObject;
  expand?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | false;
}

export class NavBarActionObject {
  readonly id: string;
  readonly className: string;
  readonly containerClass: string;
  readonly collapseId: string;
  readonly sidebarId: string;
  readonly collapse: boolean;
  readonly brand: LinkLogoObject;
  readonly title: TagObject;
  readonly backButton: ButtonIconObject | null;
  readonly linkBar: LinkBarObject;
  readonly auth: AuthConfig;
  readonly guestActions: ButtonBarObject;
  readonly userActions: ButtonBarObject;
  readonly expand: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | false;

  constructor(navbar: NavBarActionObjectConfig = {}) {
    this.id = navbar.id ?? generateId('navbar-action');
    this.className = typeof navbar.className === 'string'
      ? navbar.className
      : 'navbar navbar-expand-lg navbar-light bg-light sticky-top';
    this.containerClass = typeof navbar.containerClass === 'string'
      ? navbar.containerClass
      : 'container-fluid';
    this.collapseId = navbar.collapseId ?? `${this.id}-collapse`;
    this.sidebarId = typeof navbar.sidebarId === 'string' ? navbar.sidebarId : '';
    this.collapse = navbar.collapse !== false;
    this.expand = navbar.expand ?? 'lg';

    // Normalize brand/logo
    if (navbar.brand instanceof LinkLogoObject) {
      this.brand = navbar.brand;
    } else if (navbar.brand && typeof navbar.brand === 'object') {
      this.brand = new LinkLogoObject(navbar.brand);
    } else {
      this.brand = new LinkLogoObject({});
    }

    // Normalize title
    if (navbar.title instanceof TagObject) {
      this.title = navbar.title;
    } else if (navbar.title && typeof navbar.title === 'object') {
      this.title = new TagObject(navbar.title);
    } else {
      this.title = new TagObject({});
    }

    // Normalize back button
    if (navbar.backButton instanceof ButtonIconObject) {
      this.backButton = navbar.backButton;
    } else if (navbar.backButton && typeof navbar.backButton === 'object') {
      this.backButton = new ButtonIconObject({
        className: 'btn btn-link text-dark',
        ...navbar.backButton,
      });
    } else {
      this.backButton = null;
    }

    // Normalize linkBar
    if (navbar.linkBar instanceof LinkBarObject) {
      this.linkBar = navbar.linkBar;
    } else if (navbar.linkBar && typeof navbar.linkBar === 'object') {
      this.linkBar = new LinkBarObject({
        ...navbar.linkBar,
        className: navbar.linkBar.className ?? 'navbar-nav me-auto mb-2 mb-lg-0',
      });
    } else {
      this.linkBar = new LinkBarObject({
        className: 'navbar-nav me-auto mb-2 mb-lg-0',
      });
    }

    // Auth config
    this.auth = {
      mode: navbar.auth?.mode ?? 'auto',
      storageKey: navbar.auth?.storageKey ?? 'auth_token',
      storageType: navbar.auth?.storageType ?? 'sessionStorage',
    };

    // Normalize guest actions
    if (navbar.guestActions instanceof ButtonBarObject) {
      this.guestActions = navbar.guestActions;
    } else if (navbar.guestActions && typeof navbar.guestActions === 'object') {
      this.guestActions = new ButtonBarObject({
        ...navbar.guestActions,
        className: navbar.guestActions.className ?? 'd-flex gap-2',
      });
    } else {
      this.guestActions = new ButtonBarObject({
        className: 'd-flex gap-2',
      });
    }

    // Normalize user actions
    if (navbar.userActions instanceof ButtonBarObject) {
      this.userActions = navbar.userActions;
    } else if (navbar.userActions && typeof navbar.userActions === 'object') {
      this.userActions = new ButtonBarObject({
        ...navbar.userActions,
        className: navbar.userActions.className ?? 'd-flex gap-2',
      });
    } else {
      this.userActions = new ButtonBarObject({
        className: 'd-flex gap-2',
      });
    }
  }

  /**
   * Check if brand/logo exists
   */
  hasBrand(): boolean {
    return !!(this.brand && (this.brand.logo?.imageUrl || this.brand.name));
  }

  /**
   * Check if title exists
   */
  hasTitle(): boolean {
    return !!(this.title && this.title.name && this.title.name.trim());
  }

  /**
   * Check if back button exists
   */
  hasBackButton(): boolean {
    return !!this.backButton;
  }

  /**
   * Check if links exist
   */
  hasLinks(): boolean {
    return this.linkBar.links.length > 0;
  }

  /**
   * Check if guest actions exist
   */
  hasGuestActions(): boolean {
    return this.guestActions.buttons.length > 0;
  }

  /**
   * Check if user actions exist
   */
  hasUserActions(): boolean {
    return this.userActions.buttons.length > 0;
  }

  /**
   * Check if sidebar toggle should be shown
   */
  hasSidebarToggle(): boolean {
    return !!this.sidebarId;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): NavBarActionObjectConfig {
    return {
      id: this.id,
      className: this.className,
      containerClass: this.containerClass,
      collapseId: this.collapseId,
      sidebarId: this.sidebarId,
      collapse: this.collapse,
      expand: this.expand,
      auth: this.auth,
    };
  }
}
