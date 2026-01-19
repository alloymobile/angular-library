export interface TdButtonConfig {
  name: string;
  id?: string;

  className?: string;

  // parent-driven state
  isActive?: boolean;
  active?: string;

  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

export class TdButtonModel {
  id?: string;
  name: string;

  className: string;

  isActive: boolean;
  active: string;

  disabled: boolean;
  title: string;
  ariaLabel: string;
  tabIndex?: number;

  constructor(config: TdButtonConfig) {
    if (!config.name) throw new Error('TdButtonModel requires `name`.');

    this.id = config.id;
    this.name = config.name;

    this.className = config.className ?? 'btn btn-primary';

    this.isActive = !!config.isActive;
    this.active = config.active ?? '';

    this.disabled = !!config.disabled;
    this.title = config.title ?? config.name;
    this.ariaLabel = config.ariaLabel ?? config.name;
    this.tabIndex = config.tabIndex;
  }
}
