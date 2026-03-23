import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { TdModalToastModel } from './td-modal-toast.model';
import { OutputObject } from '../../share';

declare var bootstrap: any;

@Component({
  selector: 'td-modal-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-modal-toast.html',
  styleUrls: ['./td-modal-toast.css'],
})
export class TdModalToast {
  @Input({ required: true }) modalToast!: TdModalToastModel;
  @Output() output = new EventEmitter<OutputObject>();

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

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
    this.dismissModal();
  }

  private dismissModal(): void {
    if (!this.isBrowser) return;

    const modalEl = document.getElementById(this.modalToast.id);
    if (!modalEl) return;

    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
      if (instance) {
        instance.hide();
        return;
      }
    }

    const dismissBtn = modalEl.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
    if (dismissBtn) dismissBtn.click();
  }

  getButtonClasses(): string {
    const btn = this.modalToast?.submit;
    if (!btn) return 'btn btn-primary';

    const base = (btn.className || 'btn btn-primary').trim();
    const active = btn.isActive ? (btn.active || '').trim() : '';

    return [base, active].filter(Boolean).join(' ');
  }
}
