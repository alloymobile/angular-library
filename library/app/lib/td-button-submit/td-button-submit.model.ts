import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';

/**
 * TdButtonSubmitModel - Configuration for TdButtonSubmit component
 *
 * @property name - Required. Visible label text.
 * @property icon - Required. Icon configuration (shown during loading).
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. Base classes for <button>. Default: "btn btn-primary"
 * @property active - Optional. Classes added on hover/press/focus.
 * @property disabled - Optional. Defaults to false.
 * @property loading - Optional. External loading state control. Defaults to false.
 * @property title - Optional. Tooltip/title. Defaults to `name`.
 * @property ariaLabel - Optional. Accessible name. Defaults to `name`.
 * @property tabIndex - Optional. Tab index override.
 */

export interface TdButtonSubmitConfig {
  name: string;
  icon: TdIconModel | TdIconConfig;
  id?: string;
  className?: string;
  active?: string;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

export class TdButtonSubmitModel {
  readonly id?: string;
  readonly name: string;
  readonly icon: TdIconModel;
  readonly className: string;
  readonly active: string;
  readonly disabled: boolean;
  loading: boolean;
  readonly title: string;
  readonly ariaLabel: string;
  readonly tabIndex?: number;

  constructor(config: TdButtonSubmitConfig) {
    if (!config.name) {
      throw new Error('TdButtonSubmitModel requires `name`.');
    }
    if (!config.icon) {
      throw new Error('TdButtonSubmitModel requires `icon`.');
    }

    this.id = config.id;
    this.name = config.name;
    this.className = config.className ?? 'btn btn-primary';
    this.active = config.active ?? '';
    this.disabled = !!config.disabled;
    this.loading = !!config.loading;
    this.title = config.title ?? config.name;
    this.ariaLabel = config.ariaLabel ?? config.name;
    this.tabIndex = config.tabIndex;

    // Normalize icon to TdIconModel
    this.icon = config.icon instanceof TdIconModel
      ? config.icon
      : new TdIconModel(config.icon);
  }
}
