// td-button-submit/td-button-submit.model.ts
import { TdIconModel } from '../td-icon/td-icon.model';

/**
 * TdButtonSubmitModel - Submit button component model with loading state
 *
 * @property name - Required. Button text/label.
 * @property icon - Optional. TdIconModel instance for loading spinner icon.
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property className - Optional. CSS classes for button. Default: "btn btn-primary"
 * @property isActive - Optional. Parent-driven active state. Default: false
 * @property active - Optional. CSS classes applied when isActive is true.
 * @property disabled - Optional. Whether button is disabled. Default: false
 * @property loading - Optional. Whether button is in loading state. Default: false
 * @property title - Optional. Tooltip text. Defaults to name.
 * @property ariaLabel - Optional. Accessibility label. Defaults to name.
 * @property tabIndex - Optional. Tab index for keyboard navigation.
 */
export class TdButtonSubmitModel {
  id?: string;
  name: string;
  icon?: TdIconModel;
  className: string;
  isActive: boolean;
  active: string;
  disabled: boolean;
  loading: boolean;
  title: string;
  ariaLabel: string;
  tabIndex?: number;

  constructor(config: {
    name: string;
    icon?: TdIconModel | any;
    id?: string;
    className?: string;
    isActive?: boolean;
    active?: string;
    disabled?: boolean;
    loading?: boolean;
    title?: string;
    ariaLabel?: string;
    tabIndex?: number;
  }) {
    if (!config.name) {
      throw new Error('TdButtonSubmitModel requires `name`.');
    }

    const icon = config.icon
      ? (config.icon instanceof TdIconModel ? config.icon : new TdIconModel(config.icon))
      : undefined;

    this.id = config.id;
    this.name = config.name;
    this.icon = icon;
    this.className = config.className ?? 'btn btn-primary';
    this.isActive = config.isActive ?? false;
    this.active = config.active ?? '';
    this.disabled = config.disabled ?? false;
    this.loading = config.loading ?? false;
    this.title = config.title ?? config.name;
    this.ariaLabel = config.ariaLabel ?? config.name;
    this.tabIndex = config.tabIndex;
  }
}
