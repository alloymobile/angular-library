import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';

export interface TdButtonIconConfig {
  icon: TdIconModel | TdIconConfig | string;

  name?: string;
  id?: string;

  className?: string;

  // parent-driven selection
  isActive?: boolean;
  active?: string;

  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

export class TdButtonIconModel {
  id?: string;

  icon: TdIconModel;

  name?: string;

  className: string;

  isActive: boolean;
  active: string;

  disabled: boolean;

  title: string;
  ariaLabel: string;

  tabIndex?: number;

  constructor(config: TdButtonIconConfig) {
    if (!config.icon) throw new Error('TdButtonIconModel requires `icon`.');

    this.id = config.id;

    this.name = config.name;

    this.className = config.className ?? 'btn btn-primary';

    this.isActive = !!config.isActive;
    this.active = config.active ?? '';

    this.disabled = !!config.disabled;

    const fallback = this.name || 'icon button';
    this.title = config.title ?? fallback;

    // if no ariaLabel, use name -> title -> fallback
    this.ariaLabel = config.ariaLabel ?? this.name ?? this.title ?? fallback;

    this.tabIndex = config.tabIndex;

    this.icon = this.normalizeIcon(config.icon);
  }

  private normalizeIcon(icon: TdIconModel | TdIconConfig | string): TdIconModel {
    if (icon instanceof TdIconModel) return icon;
    if (typeof icon === 'string') return new TdIconModel({ iconClass: icon });
    return new TdIconModel(icon);
  }
}
