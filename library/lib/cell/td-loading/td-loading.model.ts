// td-loading/td-loading.model.ts
import { TdIconModel } from '../td-icon/td-icon.model';

/**
 * TdLoadingModel - Loading overlay component model
 *
 * @property id - Optional. DOM id. If omitted, a stable id is generated.
 * @property message - Optional. Loading message text. Default: "Loading..."
 * @property visible - Optional. Whether loading overlay is visible. Default: true
 * @property ariaLabel - Optional. Accessibility label. Defaults to message.
 * @property icon - Optional. TdIconModel instance for spinner. Default: fa-spinner
 * @property overlayClass - Optional. CSS classes for overlay.
 * @property contentClass - Optional. CSS classes for content container.
 * @property messageClass - Optional. CSS classes for message text.
 */
export class TdLoadingModel {
  id?: string;
  message: string;
  visible: boolean;
  ariaLabel: string;
  icon: TdIconModel;
  overlayClass: string;
  contentClass: string;
  messageClass: string;

  constructor(config: {
    id?: string;
    message?: string;
    visible?: boolean;
    ariaLabel?: string;
    icon?: TdIconModel | any;
    overlayClass?: string;
    contentClass?: string;
    messageClass?: string;
  } = {}) {
    this.id = config.id;
    this.message = config.message ?? 'Loading...';
    this.visible = config.visible ?? true;
    this.ariaLabel = config.ariaLabel ?? this.message;

    // Default spinner icon if not provided
    this.icon = config.icon
      ? (config.icon instanceof TdIconModel ? config.icon : new TdIconModel(config.icon))
      : new TdIconModel({
        iconClass: 'fa-solid fa-spinner fa-3x fa-spin',
      });

    this.overlayClass = config.overlayClass ??
      'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50';
    this.contentClass = config.contentClass ?? 'text-center p-4 rounded bg-white shadow';
    this.messageClass = config.messageClass ?? 'mt-3 text-muted';
  }
}
