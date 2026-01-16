// src/lib/components/tissue/td-modal-toast/td-modal-toast.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalToastObject } from './td-modal-toast.model';

declare var bootstrap: any;

@Component({
  selector: 'td-modal-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-modal-toast.component.html',
  styleUrls: ['./td-modal-toast.component.css']
})
export class TdModalToastComponent implements OnInit, OnChanges, OnDestroy {
  @Input() toast!: ModalToastObject;
  @Output() output = new EventEmitter<any>();
  @ViewChild('toastEl', { static: true }) toastEl!: ElementRef;

  private bsToast: any = null;

  ngOnInit(): void {
    this.validateInput();
    this.initToast();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toast']) this.validateInput();
  }

  ngOnDestroy(): void {
    if (this.bsToast) this.bsToast.dispose();
  }

  private validateInput(): void {
    if (!this.toast || !(this.toast instanceof ModalToastObject)) {
      throw new Error('TdModalToastComponent requires `toast` prop (ModalToastObject instance).');
    }
  }

  private initToast(): void {
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      this.bsToast = new bootstrap.Toast(this.toastEl.nativeElement, {
        autohide: this.toast.autohide,
        delay: this.toast.delay
      });
      this.toastEl.nativeElement.addEventListener('hidden.bs.toast', () => {
        this.output.emit({ id: this.toast.id, type: 'toast', action: 'hidden' });
      });
    }
  }

  show(): void { this.bsToast?.show(); }
  hide(): void { this.bsToast?.hide(); }
}
