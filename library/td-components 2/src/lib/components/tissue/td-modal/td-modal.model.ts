// src/lib/components/tissue/td-modal/td-modal.model.ts

import { generateId } from '../../../utils/id-helper';

/**
 * ModalConfig - Configuration for TdModal component
 */
export interface ModalConfig {
  id?: string;
  className?: string;
  dialogClassName?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  title?: string;
  titleClassName?: string;
  size?: 'sm' | 'lg' | 'xl' | '';
  centered?: boolean;
  scrollable?: boolean;
  staticBackdrop?: boolean;
  closeButton?: boolean;
  closeButtonClassName?: string;
  visible?: boolean;
}

export class ModalObject {
  id: string;
  className: string;
  dialogClassName: string;
  contentClassName: string;
  headerClassName: string;
  bodyClassName: string;
  footerClassName: string;
  title: string;
  titleClassName: string;
  size: 'sm' | 'lg' | 'xl' | '';
  centered: boolean;
  scrollable: boolean;
  staticBackdrop: boolean;
  closeButton: boolean;
  closeButtonClassName: string;
  visible: boolean;

  constructor(modal: ModalConfig = {}) {
    this.id = modal.id ?? generateId('modal');
    this.className = modal.className ?? 'modal fade';
    this.dialogClassName = modal.dialogClassName ?? 'modal-dialog';
    this.contentClassName = modal.contentClassName ?? 'modal-content';
    this.headerClassName = modal.headerClassName ?? 'modal-header';
    this.bodyClassName = modal.bodyClassName ?? 'modal-body';
    this.footerClassName = modal.footerClassName ?? 'modal-footer';
    this.title = modal.title ?? '';
    this.titleClassName = modal.titleClassName ?? 'modal-title';
    this.size = modal.size ?? '';
    this.centered = modal.centered ?? false;
    this.scrollable = modal.scrollable ?? false;
    this.staticBackdrop = modal.staticBackdrop ?? false;
    this.closeButton = modal.closeButton ?? true;
    this.closeButtonClassName = modal.closeButtonClassName ?? 'btn-close';
    this.visible = modal.visible ?? false;
  }

  /**
   * Get computed dialog class
   */
  getDialogClass(): string {
    const classes = [this.dialogClassName];
    if (this.size) classes.push(`modal-${this.size}`);
    if (this.centered) classes.push('modal-dialog-centered');
    if (this.scrollable) classes.push('modal-dialog-scrollable');
    return classes.join(' ');
  }

  /**
   * Get backdrop attribute value
   */
  getBackdropAttr(): string | boolean {
    return this.staticBackdrop ? 'static' : true;
  }

  /**
   * Check if title should be shown
   */
  hasTitle(): boolean {
    return !!this.title;
  }
}
