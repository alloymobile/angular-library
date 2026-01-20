// td-button-icon/td-button-icon.model.ts
import { TdIconModel } from '../td-icon/td-icon.model';

/**
 * TdButtonIconModel - Icon button component model
 *
 * @property icon - Required. TdIconModel instance for the button icon.
 * @property name - Optional. Button name for events.
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. CSS classes for button. Default: "btn btn-primary"
 * @property isActive - Optional. Parent-driven active state. Default: false
 * @property active - Optional. CSS classes applied when isActive is true.
 * @property disabled - Optional. Whether button is disabled. Default: false
 * @property title - Optional. Tooltip text. Defaults to name or "icon button".
 * @property ariaLabel - Optional. Accessibility label. Defaults to title.
 * @property tabIndex - Optional. Tab index for keyboard navigation.
 */
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

  constructor(config: {
    icon: TdIconModel | any;
    name?: string;
    id?: string;
    className?: string;
    isActive?: boolean;
    active?: string;
    disabled?: boolean;
    title?: string;
    ariaLabel?: string;
    tabIndex?: number;
  }) {
    if (!config.icon) {
      throw new Error('TdButtonIconModel requires `icon`.');
    }

    const icon = config.icon instanceof TdIconModel
      ? config.icon
      : new TdIconModel(config.icon);

    this.id = config.id;
    this.icon = icon;
    this.name = config.name;
    this.className = config.className ?? 'btn btn-primary';
    this.isActive = config.isActive ?? false;
    this.active = config.active ?? '';
    this.disabled = config.disabled ?? false;

    const fallback = this.name ?? 'icon button';
    this.title = config.title ?? fallback;
    this.ariaLabel = config.ariaLabel ?? this.title;
    this.tabIndex = config.tabIndex;
  }
}
