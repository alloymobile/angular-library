import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { TdButtonIconModel } from './td-button-icon.model';
import { TdIcon } from '../td-icon/td-icon';
import { generateId } from '../../share/id-helper';
import { OutputObject } from '../../share/output-object';

@Component({
  selector: 'td-button-icon',
  standalone: true,
  imports: [TdIcon],
  templateUrl: './td-button-icon.html',
  styleUrl: './td-button-icon.css',
})
export class TdButtonIcon implements OnInit, OnChanges {
  @Input({ required: true }) buttonIcon!: TdButtonIconModel;
  @Output() output = new EventEmitter<OutputObject>();

  domId = '';
  cssClass = '';

  ngOnInit(): void {
    this.ensureButtonIcon();
    this.applyButtonIcon();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buttonIcon']) {
      this.ensureButtonIcon();
      this.applyButtonIcon();
    }
  }

  onClick(): void {
    if (this.buttonIcon.disabled) return;

    const eventName = (this.buttonIcon.name && this.buttonIcon.name.trim())
      ? this.buttonIcon.name.trim()
      : this.buttonIcon.title;

    this.output.emit(
      OutputObject.ok({
        id: this.domId,
        type: 'button-icon',
        action: 'click',
        data: { name: eventName },
      })
    );
  }

  private ensureButtonIcon(): void {
    if (!this.buttonIcon || !(this.buttonIcon instanceof TdButtonIconModel)) {
      throw new Error('TdButtonIcon requires `buttonIcon` (TdButtonIconModel instance).');
    }
  }

  private applyButtonIcon(): void {
    const incomingId = this.buttonIcon.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.buttonIcon.id = incomingId;
    } else {
      const next = generateId('btn-icon');
      this.domId = next;
      this.buttonIcon.id = next;
    }

    this.cssClass = [
      this.buttonIcon.className || 'btn btn-primary',
      this.buttonIcon.isActive ? this.buttonIcon.active : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
