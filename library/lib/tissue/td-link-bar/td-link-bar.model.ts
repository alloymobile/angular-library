// td-link-bar.model.ts
/**
 * TdLinkBarModel - Model for link navigation bar
 *
 * Rule:
 * - TdLinkBarModel hydrates ONLY the link item model (TdLinkModel / TdLinkIconModel / TdLinkLogoModel).
 * - Each of those models hydrates its own embedded objects (icon/logo) using `new`.
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
  type?: string; // optional metadata only (for the bar)
  linkClass?: string; // <li> class
  links?: TdLinkBarItemConfig[];
}

export class TdLinkBarModel {
  id: string;
  className: string;
  title: TagObject;
  type: string;
  linkClass: string;
  links: TdLinkBarItem[];

  constructor(cfg: TdLinkBarConfig = {}) {
    this.id = cfg.id ?? generateId('linkBar');
    this.className =
      typeof cfg.className === 'string' ? cfg.className : 'd-flex justify-content-center';
    this.type = typeof cfg.type === 'string' ? cfg.type : 'TdLinkBar';
    this.linkClass = typeof cfg.linkClass === 'string' ? cfg.linkClass : 'nav-item';

    // Normalize title
    if (cfg.title instanceof TagObject) {
      this.title = cfg.title;
    } else if (cfg.title) {
      this.title = new TagObject(cfg.title);
    } else {
      this.title = new TagObject({});
    }

    // Normalize links (prefer explicit item.type, fallback to shape)
    const raw = Array.isArray(cfg.links) ? cfg.links : [];
    this.links = raw.map((item) => this.normalizeItem(item));
  }

  hasTitle(): boolean {
    return !!(this.title && this.title.name && this.title.name.trim());
  }

  private normalizeItem(item: TdLinkBarItemConfig): TdLinkBarItem {
    // Already hydrated
    if (item instanceof TdLinkModel) return item;
    if (item instanceof TdLinkIconModel) return item;
    if (item instanceof TdLinkLogoModel) return item;

    const anyItem = item as any;

    // Must be an object to determine the correct model
    if (!anyItem || typeof anyItem !== 'object') {
      throw new Error(
        'TdLinkBarModel: link item must be an object (or TdLinkModel/TdLinkIconModel/TdLinkLogoModel instance).'
      );
    }

    // 1) Prefer explicit discriminator: item.type
    const t = typeof anyItem.type === 'string' ? anyItem.type.trim().toLowerCase() : '';

    if (t) {
      if (t.includes('logo')) return new TdLinkLogoModel(anyItem);
      if (t.includes('icon')) return new TdLinkIconModel(anyItem);
      if (t.includes('link')) return new TdLinkModel(anyItem);
    }

    // 2) Fallback: infer by shape
    if ('logo' in anyItem) return new TdLinkLogoModel(anyItem);
    if ('icon' in anyItem) return new TdLinkIconModel(anyItem);

    // 3) Default to TdLinkModel
    return new TdLinkModel(anyItem);
  }

}
