// td-nav-bar-action.model.ts
import { generateId } from '../../share';

import { TdLinkBarModel } from '../td-link-bar/td-link-bar.model';
import { TdLinkLogoModel } from '../../cell/td-link-logo/td-link-logo.model';
import { TdButtonBarModel } from '../td-button-bar/td-button-bar.model';

export class TdNavBarActionModel {
  id: string;
  className: string;
  containerClass: string;
  collapseId: string;

  logo: TdLinkLogoModel;
  linkBar: TdLinkBarModel;

  buttonBar: TdButtonBarModel;

  expand: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | false;

  constructor(navbar: any = {}) {
    this.id = typeof navbar.id === 'string' && navbar.id.trim() ? navbar.id : generateId('navBarAction');

    this.className =
      typeof navbar.className === 'string'
        ? navbar.className
        : 'navbar navbar-expand-lg navbar-light bg-light';

    this.containerClass =
      typeof navbar.containerClass === 'string'
        ? navbar.containerClass
        : 'container-fluid';

    this.collapseId = typeof navbar.collapseId === 'string' && navbar.collapseId.trim()
      ? navbar.collapseId
      : `${this.id}-collapse`;

    this.expand = navbar.expand ?? 'lg';

    if (navbar.logo instanceof TdLinkLogoModel) {
      this.logo = navbar.logo;
    } else {
      this.logo = new TdLinkLogoModel(navbar.logo || { href: '#', logo: { imageUrl: '' }, name: '' });
    }

    if (navbar.linkBar instanceof TdLinkBarModel) {
      this.linkBar = navbar.linkBar;
    } else {
      this.linkBar = new TdLinkBarModel({
        ...(navbar.linkBar || {}),
        className: (navbar.linkBar as any)?.className ?? 'navbar-nav ms-auto mb-2 mb-lg-0',
      });
    }

    if (navbar.buttonBar instanceof TdButtonBarModel) {
      this.buttonBar = navbar.buttonBar;
    } else {
      this.buttonBar = new TdButtonBarModel(navbar.buttonBar || {});
    }
  }

  hasLogo(): boolean {
    const anyLogo: any = this.logo as any;
    return !!(anyLogo?.logo?.imageUrl || this.logo?.name);
  }

  hasLinks(): boolean {
    return (this.linkBar?.links?.length ?? 0) > 0;
  }

  hasButtons(): boolean {
    return (this.buttonBar?.buttons?.length ?? 0) > 0;
  }

  getExpandClass(): string {
    if (this.expand === false) return '';
    return `navbar-expand-${this.expand}`;
  }
}
