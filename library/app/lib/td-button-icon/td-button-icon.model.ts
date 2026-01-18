import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';

/**
 * TdButtonIconModel - Configuration for TdButtonIcon component
 *
 * @property icon - Required. Icon configuration (TdIconModel or config object).
 * @property name - Optional. Visible label text. If missing, renders icon-only.
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. Base classes for <button>. Default: "btn btn-primary"
 * @property active - Optional. Classes added on hover/press/focus.
 * @property disabled - Optional. Defaults to false.
 * @property title - Optional. Tooltip/title. Defaults to name or "icon button".
 * @property ariaLabel - Optional. Accessible name. Defaults to name or "icon button".
 * @property tabIndex - Optional. Tab index override.
 */

export interface TdButtonIconConfig {
  icon: TdIconModel | TdIconConfig;
  name?: string;
  id?: string;
  className?: string;
  active?: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

export class TdButtonIconModel {
  readonly id?: string;
  readonly name?: string;
  readonly icon: TdIconModel;
  readonly className: string;
  readonly active: string;
  readonly disabled: boolean;
  readonly title: string;
  readonly ariaLabel: string;
  readonly tabIndex?: number;

  constructor(config: TdButtonIconConfig) {
    if (!config.icon) {
      throw new Error('TdButtonIconModel requires `icon`.');
    }

    this.id = config.id;
    this.name = config.name;
    this.className = config.className ?? 'btn btn-primary';
    this.active = config.active ?? '';
    this.disabled = !!config.disabled;

    const fallbackLabel = this.name || 'icon button';
    this.title = config.title ?? fallbackLabel;
    this.ariaLabel = config.ariaLabel ?? fallbackLabel;
    this.tabIndex = config.tabIndex;

    // Normalize icon to TdIconModel
    this.icon = config.icon instanceof TdIconModel
      ? config.icon
      : new TdIconModel(config.icon);
  }
}
