// td-link-bar.model.ts
/**
 * TdLinkBarModel - Model for link navigation bar
 *
 * React parity:
 * - `selected` property for active class name (default: "active")
 * - Links are normalized to proper model instances
 */

import { generateId, TagObject, TagObjectConfig } from '../../share';

import { TdLinkModel } from '../../cell/td-link/td-link.model';
import { TdLinkIconModel } from '../../cell/td-link-icon/td-link-icon.model';
import { TdLinkLogoModel } from '../../cell/td-link-logo/td-link-logo.model';

export type TdLinkBarItem = TdLinkModel | TdLinkIconModel | TdLinkLogoModel;

export type TdLinkBarItemConfig = TdLinkBarItem | any;

export interface TdLinkBarConfig {
  id?: string;
  className?: string;
  title?: TagObjectConfig | TagObject;
  type?: string;
  linkClass?: string;
  links?: TdLinkBarItemConfig[];
  selected?: string;  // Active class name (React parity)
}

export class TdLinkBarModel {
  id: string;
  className: string;
  title: TagObject;
  type: string;
  linkClass: string;
  links: TdLinkBarItem[];
  selected: string;  // Active class name to apply

  constructor(cfg: TdLinkBarConfig = {}) {
    this.id = cfg.id ?? generateId('linkBar');
    this.className =
      typeof cfg.className === 'string' ? cfg.className : 'd-flex justify-content-center';
    this.type = typeof cfg.type === 'string' ? cfg.type : 'TdLinkBar';
    this.linkClass = typeof cfg.linkClass === 'string' ? cfg.linkClass : 'nav-item';
    
    // React parity: selected class name (default "active")
    this.selected = typeof cfg.selected === 'string' ? cfg.selected : 'active';

    // Normalize title
    if (cfg.title instanceof TagObject) {
      this.title = cfg.title;
    } else if (cfg.title) {
      this.title = new TagObject(cfg.title);
    } else {
      this.title = new TagObject({});
    }

    // Normalize links
    const raw = Array.isArray(cfg.links) ? cfg.links : [];
    this.links = raw.map((item) => this.normalizeItem(item));
  }

  hasTitle(): boolean {
    return !!(this.title && this.title.name && this.title.name.trim());
  }

  private normalizeItem(item: TdLinkBarItemConfig): TdLinkBarItem {
    if (item instanceof TdLinkModel) return item;
    if (item instanceof TdLinkIconModel) return item;
    if (item instanceof TdLinkLogoModel) return item;

    const anyItem = item as any;

    if (!anyItem || typeof anyItem !== 'object') {
      throw new Error(
        'TdLinkBarModel: link item must be an object (or TdLinkModel/TdLinkIconModel/TdLinkLogoModel instance).'
      );
    }

    const t = typeof anyItem.type === 'string' ? anyItem.type.trim().toLowerCase() : '';

    if (t) {
      if (t.includes('logo')) return new TdLinkLogoModel(anyItem);
      if (t.includes('icon')) return new TdLinkIconModel(anyItem);
      if (t.includes('link')) return new TdLinkModel(anyItem);
    }

    if ('logo' in anyItem) return new TdLinkLogoModel(anyItem);
    if ('icon' in anyItem) return new TdLinkIconModel(anyItem);

    return new TdLinkModel(anyItem);
  }
}