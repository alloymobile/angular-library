import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardObject } from './td-card.model';
import { OutputObject, BlockObject } from '../../share';

@Component({
  selector: 'td-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-card.html',
  styleUrls: ['./td-card.css']
})
export class TdCard implements OnChanges {
  @Input({ required: true }) card!: CardObject;
  @Output() output = new EventEmitter<OutputObject>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['card']) {
      const next = changes['card'].currentValue;
      this.card = next instanceof CardObject ? next : new CardObject(next || {});
    }
  }

  onButtonIconClick(field: BlockObject): void {
    const out = OutputObject.ok({
      id: field.id,
      type: 'buttonIcon',
      action: 'click',
      error: false,
      errorMessage: [],
      data: {
        id: field.buttonIcon?.id || field.id,
        name: field.buttonIcon?.name || field.name || ''
      }
    });
    this.output.emit(out);
  }

  onLinkIconClick(field: BlockObject): void {
    const out = OutputObject.ok({
      id: field.id,
      type: 'linkIcon',
      action: 'click',
      error: false,
      errorMessage: [],
      data: {
        id: field.linkIcon?.id || field.id,
        name: field.linkIcon?.name || field.name || '',
        to: field.linkIcon?.to || ''
      }
    });
    this.output.emit(out);
  }

  getHeaderClasses(): string {
    return this.card?.header?.className || 'card-header py-2 fw-semibold';
  }

  getBodyClasses(): string {
    return this.card?.body?.className || 'card-body';
  }

  getFooterClasses(): string {
    return this.card?.footer?.className || 'card-footer d-flex align-items-center justify-content-between py-2';
  }

  trackByField(index: number, field: BlockObject): string {
    return field.id;
  }

  trackByTag(index: number, tag: any): string {
    return tag.id;
  }
}
