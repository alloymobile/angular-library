// src/lib/components/cell/td-loading/td-loading.model.ts

import { generateId } from '../../../utils/id-helper';
import { IconObject, IconConfig } from '../td-icon/td-icon.model';

/**
 * LoadingConfig - Configuration for TdLoading component
 */
export interface LoadingConfig {
  id?: string;
  message?: string;
  visible?: boolean;
  ariaLabel?: string;
  icon?: IconConfig | IconObject;
  overlayClass?: string;
  contentClass?: string;
  messageClass?: string;
}

export class LoadingObject {
  id: string;
  message: string;
  visible: boolean;
  ariaLabel: string;
  icon: IconObject;
  overlayClass: string;
  contentClass: string;
  messageClass: string;

  constructor(cfg: LoadingConfig = {}) {
    this.id = cfg.id ?? generateId('loading');
    this.message = cfg.message ?? 'Loading...';
    this.visible = cfg.visible ?? true;
    this.ariaLabel = cfg.ariaLabel ?? this.message ?? 'Loading';

    // Hydrate icon
    if (cfg.icon instanceof IconObject) {
      this.icon = cfg.icon;
    } else if (cfg.icon && typeof cfg.icon === 'object') {
      this.icon = new IconObject(cfg.icon as IconConfig);
    } else {
      this.icon = new IconObject({
        iconClass: 'fa-solid fa-spinner fa-3x fa-spin'
      });
    }

    this.overlayClass = cfg.overlayClass ?? 
      'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50';
    this.contentClass = cfg.contentClass ?? 'text-center p-4 rounded bg-white shadow';
    this.messageClass = cfg.messageClass ?? 'mt-3 text-muted';
  }
}
