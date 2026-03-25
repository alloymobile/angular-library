/**
 * TdButtonModel - Button component model
 *
 * @property name - Required. Button text/label.
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. CSS classes for button. Default: "btn btn-primary"
 * @property isActive - Optional. Parent-driven active state. Default: false
 * @property active - Optional. CSS classes applied when isActive is true.
 * @property disabled - Optional. Whether button is disabled. Default: false
 * @property title - Optional. Tooltip text. Defaults to name.
 * @property ariaLabel - Optional. Accessibility label. Defaults to name.
 * @property tabIndex - Optional. Tab index for keyboard navigation.
 */
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

  constructor(config: {
    name: string;
    id?: string;
    className?: string;
    isActive?: boolean;
    active?: string;
    disabled?: boolean;
    title?: string;
    ariaLabel?: string;
    tabIndex?: number;
  }) {
    if (!config.name) {
      throw new Error('TdButtonModel requires `name`.');
    }

    this.id = config.id;
    this.name = config.name;
    this.className = config.className ?? 'btn btn-primary';
    this.isActive = config.isActive ?? false;
    this.active = config.active ?? '';
    this.disabled = config.disabled ?? false;
    this.title = config.title ?? config.name;
    this.ariaLabel = config.ariaLabel ?? config.name;
    this.tabIndex = config.tabIndex;
  }
}
