import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';

/**
 * TdLoadingModel - Configuration for TdLoading component
 *
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property message - Optional. Loading message text. Default: "Loading..."
 * @property visible - Optional. Whether to show the loading overlay. Default: true
 * @property ariaLabel - Optional. Accessible label. Defaults to message.
 * @property icon - Optional. Icon configuration for spinner.
 * @property overlayClass - Optional. Classes for the overlay container.
 * @property contentClass - Optional. Classes for the content wrapper.
 * @property messageClass - Optional. Classes for the message text.
 */

export interface TdLoadingConfig {
  id?: string;
  message?: string;
  visible?: boolean;
  ariaLabel?: string;
  icon?: TdIconModel | TdIconConfig;
  overlayClass?: string;
  contentClass?: string;
  messageClass?: string;
}

export class TdLoadingModel {
  readonly id?: string;
  readonly message: string;
  visible: boolean;
  readonly ariaLabel: string;
  readonly icon: TdIconModel;
  readonly overlayClass: string;
  readonly contentClass: string;
  readonly messageClass: string;

  constructor(config: TdLoadingConfig = {}) {
    this.id = config.id;
    this.message = config.message ?? 'Loading...';
    this.visible = config.visible ?? true;
    this.ariaLabel = config.ariaLabel ?? this.message ?? 'Loading';

    // Default spinner icon
    if (config.icon instanceof TdIconModel) {
      this.icon = config.icon;
    } else if (config.icon && typeof config.icon === 'object') {
      this.icon = new TdIconModel(config.icon);
    } else {
      this.icon = new TdIconModel({
        iconClass: 'fa-solid fa-spinner fa-3x fa-spin',
      });
    }

    this.overlayClass = config.overlayClass ??
      'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50';

    this.contentClass = config.contentClass ?? 'text-center p-4 rounded bg-white shadow';

    this.messageClass = config.messageClass ?? 'mt-3 text-muted';
  }
}
