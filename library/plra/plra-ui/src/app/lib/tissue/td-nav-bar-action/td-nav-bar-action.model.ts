// td-nav-bar-action.model.ts
import { generateId, TagObject } from '../../share';

import { TdLinkBarModel } from '../td-link-bar/td-link-bar.model';
import { TdLinkLogoModel } from '../../cell/td-link-logo/td-link-logo.model';
import { TdButtonBarModel } from '../td-button-bar/td-button-bar.model';
import { TdButtonIconModel } from '../../cell/td-button-icon/td-button-icon.model';

export interface TdNavBarActionConfig {
  id?: string;
  className?: string;
  containerClass?: string;
  collapseId?: string;
  expand?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | false;

  sidebarId?: string;
  backButton?: any;
  logo?: any;
  title?: any;
  linkBar?: any;
  buttonBar?: any;
  collapse?: boolean;
}

export class TdNavBarActionModel {
  id: string;
  className: string;
  containerClass: string;
  collapseId: string;
  expand: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | false;

  /** Offcanvas sidebar ID for mobile toggle (without #) */
  sidebarId: string;

  /** Optional back button on the left side */
  backButton: TdButtonIconModel | null;

  /** Brand logo */
  logo: TdLinkLogoModel;

  /** Optional title displayed beside the logo */
  title: TagObject | null;

  /** Navigation links */
  linkBar: TdLinkBarModel;

  /** Action buttons */
  buttonBar: TdButtonBarModel;

  /** Whether collapse is enabled (default true) */
  collapse: boolean;

  constructor(navbar: TdNavBarActionConfig = {}) {
    this.id =
      typeof navbar.id === 'string' && navbar.id.trim()
        ? navbar.id
        : generateId('navBarAction');

    this.className =
      typeof navbar.className === 'string'
        ? navbar.className
        : 'navbar navbar-expand-lg navbar-light bg-light';

    this.containerClass =
      typeof navbar.containerClass === 'string'
        ? navbar.containerClass
        : 'container-fluid';

    this.collapseId =
      typeof navbar.collapseId === 'string' && navbar.collapseId.trim()
        ? navbar.collapseId
        : `${this.id}-collapse`;

    this.expand = navbar.expand ?? 'lg';
    this.collapse = navbar.collapse !== false;

    // Sidebar ID for offcanvas toggle (strip # if present)
    this.sidebarId =
      typeof navbar.sidebarId === 'string'
        ? navbar.sidebarId.replace(/^#/, '').trim()
        : '';

    // Back button
    if (navbar.backButton === null) {
      this.backButton = null;
    } else if (navbar.backButton instanceof TdButtonIconModel) {
      this.backButton = navbar.backButton;
    } else if (navbar.backButton) {
      this.backButton = new TdButtonIconModel(navbar.backButton);
    } else {
      this.backButton = null;
    }

    // Logo
    if (navbar.logo instanceof TdLinkLogoModel) {
      this.logo = navbar.logo;
    } else {
      this.logo = new TdLinkLogoModel(
        navbar.logo || { href: '#', logo: { imageUrl: '' }, name: '' }
      );
    }

    // Title
    if (navbar.title === null) {
      this.title = null;
    } else if (navbar.title instanceof TagObject) {
      this.title = navbar.title;
    } else if (navbar.title) {
      this.title = new TagObject(navbar.title);
    } else {
      this.title = null;
    }

    // Link bar
    if (navbar.linkBar instanceof TdLinkBarModel) {
      this.linkBar = navbar.linkBar;
    } else {
      this.linkBar = new TdLinkBarModel({
        ...(navbar.linkBar || {}),
        className:
          (navbar.linkBar as any)?.className ?? 'navbar-nav ms-auto mb-2 mb-lg-0',
      });
    }

    // Button bar
    if (navbar.buttonBar instanceof TdButtonBarModel) {
      this.buttonBar = navbar.buttonBar;
    } else {
      this.buttonBar = new TdButtonBarModel(navbar.buttonBar || {});
    }
  }

  hasSidebar(): boolean {
    return !!this.sidebarId;
  }

  hasBackButton(): boolean {
    return this.backButton !== null;
  }

  hasLogo(): boolean {
    const anyLogo = this.logo as any;
    return !!(anyLogo?.logo?.imageUrl || this.logo?.name);
  }

  hasTitle(): boolean {
    return this.title !== null && !!this.title.name;
  }

  hasLinks(): boolean {
    return (this.linkBar?.links?.length ?? 0) > 0;
  }

  hasButtons(): boolean {
    return (this.buttonBar?.buttons?.length ?? 0) > 0;
  }

  /** Returns true if collapse toggle should be shown */
  showCollapse(): boolean {
    return this.collapse && (this.hasLinks() || this.hasButtons());
  }

  getExpandClass(): string {
    if (this.expand === false) return '';
    return `navbar-expand-${this.expand}`;
  }
}