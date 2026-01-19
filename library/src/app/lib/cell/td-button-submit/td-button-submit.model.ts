import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';

export interface TdButtonSubmitConfig {
  name: string;
  icon?: TdIconModel | TdIconConfig | string;

  id?: string;

  className?: string;

  // parent-driven selection (optional, consistent with other buttons)
  isActive?: boolean;
  active?: string;

  disabled?: boolean;
  loading?: boolean;

  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

export class TdButtonSubmitModel {
  id?: string;

  name: string;

  // optional icon config (used while loading)
  icon?: TdIconModel;

  className: string;

  isActive: boolean;
  active: string;

  disabled: boolean;
  loading: boolean;

  title: string;
  ariaLabel: string;

  tabIndex?: number;

  constructor(config: TdButtonSubmitConfig) {
    if (!config.name) throw new Error('TdButtonSubmitModel requires `name`.');

    this.id = config.id;

    this.name = config.name;

    this.className = config.className ?? 'btn btn-primary';

    this.isActive = !!config.isActive;
    this.active = config.active ?? '';

    this.disabled = !!config.disabled;
    this.loading = !!config.loading;

    this.title = config.title ?? config.name;
    this.ariaLabel = config.ariaLabel ?? config.name;

    this.tabIndex = config.tabIndex;

    if (config.icon) {
      this.icon = this.normalizeIcon(config.icon);
    }
  }

  private normalizeIcon(icon: TdIconModel | TdIconConfig | string): TdIconModel {
    if (icon instanceof TdIconModel) return icon;
    if (typeof icon === 'string') return new TdIconModel({ iconClass: icon });
    return new TdIconModel(icon);
  }
}
