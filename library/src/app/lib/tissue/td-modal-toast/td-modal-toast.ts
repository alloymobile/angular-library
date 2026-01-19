import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ModalToastObject } from './td-modal-toast.model';
import { OutputObject } from '../../share';

declare var bootstrap: any;

@Component({
  selector: 'td-modal-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-modal-toast.html',
  styleUrls: ['./td-modal-toast.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdModalToast {
  @Input({ required: true }) modalToast!: ModalToastObject;
  @Output() output = new EventEmitter<OutputObject>();

  private isBrowser: boolean;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Handle OK/Submit button click
   */
  onSubmit(): void {
    const out = OutputObject.ok({
      id: this.modalToast.id,
      type: 'modal-toast',
      action: 'click',
      data: {
        action: this.modalToast.action,
        title: this.modalToast.title,
        message: this.modalToast.message,
      },
    });

    this.output.emit(out);

    // Auto-dismiss modal
    this.dismissModal();
  }

  /**
   * Dismiss the modal using Bootstrap API or fallback
   */
  private dismissModal(): void {
    if (!this.isBrowser) return;

    const modalEl = document.getElementById(this.modalToast.id);
    if (!modalEl) return;

    // Try Bootstrap Modal API
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
      if (instance) {
        instance.hide();
        return;
      }
    }

    // Fallback: click dismiss button
    const dismissBtn = modalEl.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
    if (dismissBtn) {
      dismissBtn.click();
    }
  }

  /**
   * Get button CSS classes
   */
  getButtonClasses(): string {
    return this.modalToast.submit.getCombinedClasses();
  }
}
