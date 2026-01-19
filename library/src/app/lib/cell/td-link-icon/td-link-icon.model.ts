// td-link-icon.model.ts
import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';

export interface TdLinkIconConfig {
  href: string;

  // allow raw JSON too (string iconClass)
  icon: TdIconModel | TdIconConfig | string;

  name?: string;
  id?: string;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
  ariaLabel?: string;
}

export class TdLinkIconModel {
  id?: string;
  href: string;
  icon: TdIconModel;
  name?: string;
  className: string;
  active: string;
  target?: string;
  rel?: string;
  title: string;
  ariaLabel: string;

  constructor(config: TdLinkIconConfig) {
    if (!config.href) throw new Error('TdLinkIconModel requires `href`.');
    if (!config.icon) throw new Error('TdLinkIconModel requires `icon`.');

    this.id = config.id;
    this.href = config.href;
    this.name = config.name;
    this.className = config.className ?? 'nav-link';
    this.active = config.active ?? '';
    this.target = config.target;
    this.rel = config.rel;

    this.title = config.title ?? config.name ?? config.href;
    this.ariaLabel = config.ariaLabel ?? config.title ?? config.name ?? 'Link';

    // hydration responsibility stays inside the model
    this.icon = this.normalizeIcon(config.icon);
  }

  private normalizeIcon(icon: TdIconModel | TdIconConfig | string): TdIconModel {
    if (icon instanceof TdIconModel) return icon;

    if (typeof icon === 'string') {
      return new TdIconModel({ iconClass: icon });
    }

    return new TdIconModel(icon);
  }

  getSafeRel(): string | undefined {
    if (this.target === '_blank') {
      return this.rel ? `${this.rel} noopener noreferrer` : 'noopener noreferrer';
    }
    return this.rel;
  }

  hasLabel(): boolean {
    return !!this.name;
  }
}
