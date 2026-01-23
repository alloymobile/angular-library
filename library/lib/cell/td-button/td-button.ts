import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { TdButtonModel } from './td-button.model';
import { generateId } from '../../share/id-helper';
import { OutputObject } from '../../share/output-object';

@Component({
  selector: 'td-button',
  standalone: true,
  imports: [],
  templateUrl: './td-button.html',
  styleUrl: './td-button.css',
})
export class TdButton implements OnInit, OnChanges {
  @Input({ required: true }) button!: TdButtonModel;
  @Output() output = new EventEmitter<OutputObject>();

  domId = '';
  cssClass = '';

  ngOnInit(): void {
    this.ensureButton();
    this.applyButton();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['button']) {
      this.ensureButton();
      this.applyButton();
    }
  }

  onClick(): void {
    if (this.button.disabled) return;

    this.output.emit(
      OutputObject.ok({
        id: this.domId,
        type: 'button',
        action: 'click',
        data: { name: this.button.name },
      })
    );
  }

  private ensureButton(): void {
    if (!this.button || !(this.button instanceof TdButtonModel)) {
      throw new Error('TdButton requires `button` (TdButtonModel instance).');
    }
  }

  private applyButton(): void {
    const incomingId = this.button.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.button.id = incomingId;
    } else {
      const next = generateId('btn');
      this.domId = next;
      this.button.id = next;
    }

    this.cssClass = [this.button.className, this.button.isActive ? this.button.active : '']
      .filter(Boolean)
      .join(' ');
  }
}
