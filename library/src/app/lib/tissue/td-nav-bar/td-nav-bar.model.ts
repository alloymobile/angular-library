// td-navbar.model.ts
import { generateId } from '../../share';

import { TdLinkBarModel } from '../td-link-bar/td-link-bar.model';
import { TdLinkLogoModel } from '../../cell/td-link-logo/td-link-logo.model';

export class TdNavBarModel {
  id: string;
  className: string;
  containerClass: string;
  collapseId: string;

  logo: TdLinkLogoModel;
  linkBar: TdLinkBarModel;

  expand: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | false;

  constructor(navbar: any = {}) {
    this.id = navbar.id ?? generateId('navbar');

    this.className =
      typeof navbar.className === 'string'
        ? navbar.className
        : 'navbar navbar-expand-lg navbar-light bg-light';

    this.containerClass =
      typeof navbar.containerClass === 'string'
        ? navbar.containerClass
        : 'container-fluid';

    this.collapseId = navbar.collapseId ?? `${this.id}-collapse`;
    this.expand = navbar.expand ?? 'lg';

    // Hydrate logo (TdLinkLogoModel hydrates its own embedded logo object)
    if (navbar.logo instanceof TdLinkLogoModel) {
      this.logo = navbar.logo;
    } else {
      this.logo = new TdLinkLogoModel(
        navbar.logo || { href: '#', logo: { imageUrl: '' }, name: '' }
      );
    }

    // Hydrate link bar (TdLinkBarModel hydrates its own link items)
    if (navbar.linkBar instanceof TdLinkBarModel) {
      this.linkBar = navbar.linkBar;
    } else {
      this.linkBar = new TdLinkBarModel({
        ...(navbar.linkBar || {}),
        className: (navbar.linkBar as any)?.className ?? 'navbar-nav ms-auto mb-2 mb-lg-0',
      });
    }
  }

  hasLogo(): boolean {
    const anyLogo: any = this.logo as any;
    return !!(anyLogo?.logo?.imageUrl || this.logo?.name);
  }

  hasLinks(): boolean {
    return (this.linkBar?.links?.length ?? 0) > 0;
  }

  getExpandClass(): string {
    if (this.expand === false) return '';
    return `navbar-expand-${this.expand}`;
  }
}
