import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';

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
  id?: string;

  message: string;
  visible: boolean;
  ariaLabel: string;

  icon: TdIconModel;

  overlayClass: string;
  contentClass: string;
  messageClass: string;

  constructor(config: TdLoadingConfig = {}) {
    this.id = config.id;

    this.message = config.message ?? 'Loading...';
    this.visible = config.visible ?? true;
    this.ariaLabel = config.ariaLabel ?? this.message ?? 'Loading';

    this.icon = this.normalizeIcon(config.icon);

    this.overlayClass =
      config.overlayClass ??
      'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50';

    this.contentClass = config.contentClass ?? 'text-center p-4 rounded bg-white shadow';
    this.messageClass = config.messageClass ?? 'mt-3 text-muted';
  }

  private normalizeIcon(icon?: TdIconModel | TdIconConfig): TdIconModel {
    try {
      if (icon instanceof TdIconModel) return icon;

      if (icon && typeof icon === 'object') {
        const cfg = icon as TdIconConfig;

        // Guard: TdIconModel requires iconClass
        if (typeof cfg.iconClass === 'string' && cfg.iconClass.trim()) {
          return new TdIconModel(cfg);
        }
      }
    } catch {
      // ignore and fallback below
    }

    return new TdIconModel({
      iconClass: 'fa-solid fa-spinner fa-3x fa-spin',
    });
  }
}
