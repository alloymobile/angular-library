// td-card-action.model.ts
/**
 * TdCardActionModel - Model for card with action bar
 *
 * Rules:
 * - action accepts ONLY hydrated models (TdButtonBarModel | TdLinkBarModel)
 * - NO config hydration here for action
 * - No readonly (parent can mutate)
 * - Split layout only
 */
import { generateId, BlockObject, BlockObjectConfig } from '../../share';
import { TdButtonBarModel } from '../td-button-bar/td-button-bar.model';
import { TdLinkBarModel } from '../td-link-bar/td-link-bar.model';

export interface TdCardActionModelConfig {
  id?: string;
  className?: string;

  layout?: 'single' | 'split';

  leftColClass?: string;
  rightColClass?: string;

  header?: BlockObjectConfig | BlockObject;
  body?: BlockObjectConfig | BlockObject;
  leftFields?: (BlockObjectConfig | BlockObject)[];
  fields?: (BlockObjectConfig | BlockObject)[];
  footer?: BlockObjectConfig | BlockObject;

  type?: 'AlloyButtonBar' | 'AlloyLinkBar' | string;

  // IMPORTANT: model only (already hydrated outside)
  action?: TdButtonBarModel | TdLinkBarModel;
}

export class TdCardActionModel {
  id: string;
  className: string;
  layout: 'single' | 'split';
  leftColClass: string;
  rightColClass: string;

  header: BlockObject;
  body: BlockObject;
  leftFields: BlockObject[];
  fields: BlockObject[];
  footer: BlockObject;

  type: string;

  // IMPORTANT: model only
  action: TdButtonBarModel | TdLinkBarModel;

  constructor(cardAction: TdCardActionModelConfig = {}) {
    this.id = cardAction.id ?? generateId('card-action');
    this.className =
      typeof cardAction.className === 'string'
        ? cardAction.className
        : 'card border m-2 shadow';

    this.layout = 'split';

    this.leftColClass =
      typeof cardAction.leftColClass === 'string'
        ? cardAction.leftColClass
        : 'col-12 col-sm-4';
    this.rightColClass =
      typeof cardAction.rightColClass === 'string'
        ? cardAction.rightColClass
        : 'col-12 col-sm-8';

    const rawHeader = cardAction.header ?? {};
    this.header = rawHeader instanceof BlockObject ? rawHeader : new BlockObject(rawHeader);

    const rawBody = cardAction.body ?? {};
    this.body = rawBody instanceof BlockObject ? rawBody : new BlockObject(rawBody);

    const rawLeftFields = Array.isArray(cardAction.leftFields) ? cardAction.leftFields : [];
    this.leftFields = rawLeftFields.map((f) => (f instanceof BlockObject ? f : new BlockObject(f || {})));

    const rawFields = Array.isArray(cardAction.fields) ? cardAction.fields : [];
    if (rawFields.length === 0) {
      throw new Error('TdCardActionModel requires at least one field in `fields`.');
    }
    this.fields = rawFields.map((f) => (f instanceof BlockObject ? f : new BlockObject(f || {})));

    const rawFooter = cardAction.footer ?? {};
    this.footer = rawFooter instanceof BlockObject ? rawFooter : new BlockObject(rawFooter);

    this.type =
      typeof cardAction.type === 'string' && cardAction.type.trim()
        ? cardAction.type
        : 'AlloyButtonBar';

    const rawAction = cardAction.action;
    if (!rawAction) {
      throw new Error('TdCardActionModel requires `action` as hydrated TdButtonBarModel or TdLinkBarModel.');
    }
    this.action = rawAction;
  }

  hasHeader(): boolean {
    return !!(this.header && (this.header.hasText() || (this.header.className || '').trim().length > 0));
  }

  hasAction(): boolean {
    return !!this.action;
  }

  hasFooter(): boolean {
    return !!((this.footer && (this.footer.hasText() || (this.footer.className || '').trim().length > 0)) || this.hasAction());
  }

  isSplitLayout(): boolean {
    return this.leftFields.length > 0;
  }

  isLinkBarAction(): boolean {
    return this.type === 'AlloyLinkBar';
  }

  getAllFields(): BlockObject[] {
    return [...this.leftFields, ...this.fields];
  }

  toJSON(): TdCardActionModelConfig {
    return {
      id: this.id,
      className: this.className,
      layout: this.layout,
      leftColClass: this.leftColClass,
      rightColClass: this.rightColClass,
      type: this.type,
      action: this.action,
    };
  }
}
