import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardObject } from './td-card.model';
import { OutputObject, BlockObject } from '../../share';

@Component({
  selector: 'td-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-card.html',
  styleUrls: ['./td-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdCard {
  @Input({ required: true }) card!: CardObject;
  @Output() output = new EventEmitter<OutputObject>();

  /**
   * Handle quantity change from a field
   */
  onQuantityChange(field: BlockObject, value: number): void {
    const out = OutputObject.ok({
      id: field.id,
      type: 'quantity',
      action: 'change',
      data: {
        fieldId: field.id,
        value: value,
      },
    });
    this.output.emit(out);
  }

  /**
   * Handle button icon click from a field
   */
  onButtonIconClick(field: BlockObject): void {
    const out = OutputObject.ok({
      id: field.id,
      type: 'buttonIcon',
      action: 'click',
      data: {
        fieldId: field.id,
        buttonId: field.buttonIcon?.id,
      },
    });
    this.output.emit(out);
  }

  /**
   * Get header classes
   */
  getHeaderClasses(): string {
    return this.card.header.className || 'card-header py-2 fw-semibold';
  }

  /**
   * Get body classes
   */
  getBodyClasses(): string {
    return this.card.body.className || 'card-body';
  }

  /**
   * Get footer classes
   */
  getFooterClasses(): string {
    return this.card.footer.className || 'card-footer d-flex align-items-center justify-content-between py-2';
  }

  /**
   * Track by function for fields
   */
  trackByField(index: number, field: BlockObject): string {
    return field.id;
  }

  /**
   * Track by function for tags
   */
  trackByTag(index: number, tag: any): string {
    return tag.id;
  }
}
