/**
 * TdButtonModel - Configuration for TdButton component
 *
 * @property name - Required. Visible label text.
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. Base classes for <button>. Default: "btn btn-primary"
 * @property active - Optional. Classes added on hover/press/focus.
 * @property disabled - Optional. Defaults to false.
 * @property title - Optional. Tooltip/title. Defaults to `name`.
 * @property ariaLabel - Optional. Accessible name. Defaults to `name`.
 * @property tabIndex - Optional. Tab index override.
 */

export interface TdButtonConfig {
  name: string;
  id?: string;
  className?: string;
  active?: string;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

export class TdButtonModel {
  readonly id?: string;
  readonly name: string;
  readonly className: string;
  readonly active: string;
  readonly disabled: boolean;
  readonly title: string;
  readonly ariaLabel: string;
  readonly tabIndex?: number;

  constructor(config: TdButtonConfig) {
    if (!config.name) {
      throw new Error('TdButtonModel requires `name`.');
    }

    this.id = config.id;
    this.name = config.name;
    this.className = config.className ?? 'btn btn-primary';
    this.active = config.active ?? '';
    this.disabled = !!config.disabled;
    this.title = config.title ?? config.name;
    this.ariaLabel = config.ariaLabel ?? config.name;
    this.tabIndex = config.tabIndex;
  }
}
