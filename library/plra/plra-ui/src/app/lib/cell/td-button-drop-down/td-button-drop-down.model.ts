// td-button-drop-down.model.ts
import { generateId } from '../../share';

import { TdIconModel } from '../../cell/td-icon/td-icon.model';
import { TdLinkBarModel } from '../../tissue/td-link-bar/td-link-bar.model';

export class TdButtonDropDownModel {
  id: string;
  name: string;
  type: string;
  className: string;

  isActive: boolean;
  active: string;

  icon?: TdIconModel;
  linkBar: TdLinkBarModel;

  constructor(cfg: any = {}) {
    this.id = typeof cfg.id === 'string' && cfg.id.trim() ? cfg.id : generateId('btnDropdown');

    this.name = typeof cfg.name === 'string' ? cfg.name : 'Menu';
    this.type = typeof cfg.type === 'string' ? cfg.type : 'button';

    this.className =
      typeof cfg.className === 'string'
        ? cfg.className
        : 'btn btn-sm btn-outline-secondary dropdown-toggle';

    this.isActive = typeof cfg.isActive === 'boolean' ? cfg.isActive : false;
    this.active = typeof cfg.active === 'string' ? cfg.active : '';

    // icon (TdIconModel)
    if (cfg.icon instanceof TdIconModel) {
      this.icon = cfg.icon;
    } else if (cfg.icon && typeof cfg.icon === 'object' && typeof cfg.icon.iconClass === 'string') {
      const ic = cfg.icon.iconClass.trim();
      if (ic) {
        this.icon = new TdIconModel({
          iconClass: ic,
          id: typeof cfg.icon.id === 'string' ? cfg.icon.id : undefined,
          className: typeof cfg.icon.className === 'string' ? cfg.icon.className : undefined,
        });
      }
    }

    // linkBar (TdLinkBarModel) — always build via `new`
    const lbDefault = {
      className: 'dropdown-menu',
      linkClass: 'dropdown-item',
      links: [] as any[],
    };

    let lbCfg: any = lbDefault;

    if (cfg.linkBar instanceof TdLinkBarModel) {
      lbCfg = {
        id: cfg.linkBar.id,
        className: cfg.linkBar.className,
        type: cfg.linkBar.type,
        linkClass: cfg.linkBar.linkClass,
        title: cfg.linkBar.title,
        links: cfg.linkBar.links,
      };
    } else if (cfg.linkBar && typeof cfg.linkBar === 'object') {
      lbCfg = {
        ...lbDefault,
        ...cfg.linkBar,
        links: Array.isArray(cfg.linkBar.links) ? cfg.linkBar.links : lbDefault.links,
      };
    }

    this.linkBar = new TdLinkBarModel(lbCfg);
  }
}
