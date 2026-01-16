// src/lib/components/tissue/td-modal-toast/td-modal-toast.model.ts

import { generateId } from '../../../utils/id-helper';

export interface ModalToastConfig {
  id?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  title?: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
  autohide?: boolean;
  delay?: number;
  position?: string;
}

export class ModalToastObject {
  id: string;
  className: string;
  headerClassName: string;
  bodyClassName: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
  autohide: boolean;
  delay: number;
  position: string;

  constructor(cfg: ModalToastConfig = {}) {
    this.id = cfg.id ?? generateId('toast');
    this.className = cfg.className ?? 'toast';
    this.headerClassName = cfg.headerClassName ?? 'toast-header';
    this.bodyClassName = cfg.bodyClassName ?? 'toast-body';
    this.title = cfg.title ?? '';
    this.message = cfg.message ?? '';
    this.type = cfg.type ?? 'info';
    this.autohide = cfg.autohide ?? true;
    this.delay = cfg.delay ?? 5000;
    this.position = cfg.position ?? 'top-0 end-0';

    // Default icons by type
    const defaultIcons: Record<string, string> = {
      success: 'fa-solid fa-check-circle text-success',
      error: 'fa-solid fa-times-circle text-danger',
      warning: 'fa-solid fa-exclamation-triangle text-warning',
      info: 'fa-solid fa-info-circle text-info'
    };
    this.icon = cfg.icon ?? defaultIcons[this.type] ?? defaultIcons.info;
  }

  hasTitle(): boolean { return !!this.title; }
}
