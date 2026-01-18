import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardActionObject } from './td-card-action.model';
import { OutputObject, BlockObject } from '../../share';
import { TdButtonBar } from '../td-button-bar/td-button-bar';
import { TdLinkBar } from '../td-link-bar/td-link-bar';
import { ButtonBarObject } from '../td-button-bar/td-button-bar.model';
import { LinkBarObject } from '../td-link-bar/td-link-bar.model';

@Component({
  selector: 'td-card-action',
  standalone: true,
  imports: [CommonModule, TdButtonBar, TdLinkBar],
  templateUrl: './td-card-action.html',
  styleUrls: ['./td-card-action.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdCardAction {
  @Input({ required: true }) cardAction!: CardActionObject;
  @Output() output = new EventEmitter<OutputObject>();

  /**
   * Collect all field values for output
   */
  private collectFieldValues(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    const fieldMap: Record<string, unknown> = {};
    const allFields = this.cardAction.getAllFields();

    allFields.forEach(field => {
      if (!field || !field.id) return;

      const value = field.id in overrides
        ? overrides[field.id]
        : this.extractFieldValue(field);

      // Handle tags array
      if (this.looksLikeTagsArray(value)) {
        (value as any[]).forEach(t => {
          const id = String(t.id || '').trim();
          const name = String(t.name || '').trim();
          if (id && name) fieldMap[id] = name;
        });
        return;
      }

      fieldMap[field.id] = value;
    });

    return fieldMap;
  }

  /**
   * Extract value from a field based on its content type
   */
  private extractFieldValue(field: BlockObject): unknown {
    if (!field) return '';

    if (field.hasMedia()) {
      return field.media?.items?.map(item => item.url) ?? [];
    }
    if (field.hasLogo()) {
      return field.logo?.imageUrl ?? '';
    }
    if (field.hasIcon()) {
      return field.icon?.iconClass ?? '';
    }
    if (field.hasTags()) {
      return Array.isArray(field.tags)
        ? field.tags
          .filter(t => t && typeof t.name === 'string' && t.name.trim())
          .map(t => ({ id: t.id, name: t.name }))
        : [];
    }
    if (field.hasQuantity()) {
      return field.quantity?.value ?? 0;
    }
    if (field.hasButtonIcon()) {
      return field.buttonIcon?.id ?? '';
    }
    if (field.hasLinkIcon()) {
      return field.linkIcon?.to ?? '';
    }
    if (field.hasText()) {
      return field.name;
    }
    return '';
  }

  /**
   * Check if value looks like a tags array
   */
  private looksLikeTagsArray(arr: unknown): boolean {
    if (!Array.isArray(arr) || arr.length === 0) return false;
    return arr.every(t => {
      if (!t || typeof t !== 'object' || Array.isArray(t)) return false;
      const idOk = typeof (t as any).id === 'string' && (t as any).id.trim().length > 0;
      const nameOk = typeof (t as any).name === 'string' && (t as any).name.trim().length > 0;
      return idOk && nameOk;
    });
  }

  /**
   * Resolve action name from output object
   */
  private resolveActionName(source: any): string {
    if (!source || typeof source !== 'object') return '';

    const pickFrom = (obj: any): string => {
      if (!obj || typeof obj !== 'object') return '';
      if (typeof obj.name === 'string' && obj.name.trim()) return obj.name.trim();
      if (typeof obj.ariaLabel === 'string' && obj.ariaLabel.trim()) return obj.ariaLabel.trim();
      if (typeof obj.title === 'string' && obj.title.trim()) return obj.title.trim();
      if (typeof obj.id === 'string' && obj.id.trim()) return obj.id.trim();
      return '';
    };

    const data = source.data && typeof source.data === 'object' ? source.data : null;

    if (data) {
      if (data.button && typeof data.button === 'object') {
        const v = pickFrom(data.button);
        if (v) return v;
      }
      if (data.link && typeof data.link === 'object') {
        const v = pickFrom(data.link);
        if (v) return v;
      }
      if (typeof data.action === 'string' && data.action.trim()) {
        return data.action.trim();
      }
      const v = pickFrom(data);
      if (v) return v;
    }

    if (typeof source.action === 'string' && source.action.trim()) {
      return source.action.trim();
    }

    return pickFrom(source);
  }

  /**
   * Handle action bar output
   */
  onActionBarOutput(innerOut: OutputObject): void {
    const base = innerOut && typeof (innerOut as any).toJSON === 'function'
      ? (innerOut as any).toJSON()
      : innerOut || {};

    const { error = false, errorMessage = [] } = base;
    const actionName = this.resolveActionName(base);

    const wrapped = new OutputObject({
      id: this.cardAction.id,
      type: 'card-action',
      action: actionName,
      error: !!error,
      errorMessage: errorMessage || [],
      data: this.collectFieldValues(),
    });

    this.output.emit(wrapped);
  }

  /**
   * Handle quantity change
   */
  onQuantityChange(field: BlockObject, value: number): void {
    const wrapped = new OutputObject({
      id: this.cardAction.id,
      type: 'card-action',
      action: 'quantity-change',
      error: false,
      data: {
        ...this.collectFieldValues({ [field.id]: value }),
        triggeredBy: field.id,
        quantityData: { value },
      },
    });

    this.output.emit(wrapped);
  }

  /**
   * Handle button icon click
   */
  onButtonIconClick(field: BlockObject): void {
    const actionName = field.buttonIcon?.name || field.buttonIcon?.ariaLabel || 'button-icon-click';

    const wrapped = new OutputObject({
      id: this.cardAction.id,
      type: 'card-action',
      action: actionName,
      error: false,
      data: {
        ...this.collectFieldValues(),
        triggeredBy: field.id,
        buttonData: { id: field.buttonIcon?.id },
      },
    });

    this.output.emit(wrapped);
  }

  /**
   * Get header classes
   */
  getHeaderClasses(): string {
    return this.cardAction.header.className || 'card-header py-2 fw-semibold';
  }

  /**
   * Get body classes
   */
  getBodyClasses(): string {
    return this.cardAction.body.className || 'card-body';
  }

  /**
   * Get footer classes
   */
  getFooterClasses(): string {
    return this.cardAction.footer.className || 'card-footer d-flex align-items-center gap-2 py-2';
  }

  /**
   * Cast action to ButtonBarObject
   */
  getButtonBarAction(): ButtonBarObject {
    return this.cardAction.action as ButtonBarObject;
  }

  /**
   * Cast action to LinkBarObject
   */
  getLinkBarAction(): LinkBarObject {
    return this.cardAction.action as LinkBarObject;
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
