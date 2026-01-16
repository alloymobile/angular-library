// src/lib/components/tissue/td-modal/td-modal.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalObject } from './td-modal.model';
import { OutputObject } from '../../../utils/id-helper';

declare var bootstrap: any;

/**
 * TdModalComponent
 * 
 * Renders a Bootstrap modal dialog.
 * Content is projected using ng-content slots.
 */
@Component({
  selector: 'td-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-modal.component.html',
  styleUrls: ['./td-modal.component.css']
})
export class TdModalComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Input: ModalObject instance (required)
   */
  @Input() modal!: ModalObject;

  /**
   * Output: Emits modal events (open, close, hidden)
   */
  @Output() output = new EventEmitter<any>();

  @ViewChild('modalElement', { static: true }) modalElement!: ElementRef;

  private bsModal: any = null;

  ngOnInit(): void {
    this.validateInput();
    this.initModal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal']) {
      this.validateInput();
      
      // Handle visibility change
      if (!changes['modal'].firstChange) {
        if (this.modal.visible) {
          this.show();
        } else {
          this.hide();
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.bsModal) {
      this.bsModal.dispose();
    }
  }

  private validateInput(): void {
    if (!this.modal || !(this.modal instanceof ModalObject)) {
      throw new Error('TdModalComponent requires `modal` prop (ModalObject instance).');
    }
  }

  private initModal(): void {
    // Initialize Bootstrap modal if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      this.bsModal = new bootstrap.Modal(this.modalElement.nativeElement, {
        backdrop: this.modal.getBackdropAttr(),
        keyboard: !this.modal.staticBackdrop
      });

      // Listen for hidden event
      this.modalElement.nativeElement.addEventListener('hidden.bs.modal', () => {
        this.onHidden();
      });

      // Show if initially visible
      if (this.modal.visible) {
        this.show();
      }
    }
  }

  /**
   * Show the modal
   */
  show(): void {
    if (this.bsModal) {
      this.bsModal.show();
      this.emitEvent('open');
    }
  }

  /**
   * Hide the modal
   */
  hide(): void {
    if (this.bsModal) {
      this.bsModal.hide();
    }
  }

  /**
   * Handle close button click
   */
  onClose(): void {
    this.hide();
    this.emitEvent('close');
  }

  /**
   * Handle hidden event
   */
  private onHidden(): void {
    this.modal.visible = false;
    this.emitEvent('hidden');
  }

  /**
   * Emit output event
   */
  private emitEvent(action: string): void {
    const out = OutputObject.ok({
      id: this.modal.id,
      type: 'modal',
      action
    });
    this.output.emit(out);
  }
}
