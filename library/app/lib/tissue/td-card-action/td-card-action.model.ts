/**
 * CardActionObject - Model for card with action bar
 *
 * Extends Card functionality with:
 * - Action bar (ButtonBar or LinkBar) in footer
 * - Output emissions for all interactions
 */

import { generateId, BlockObject, BlockObjectConfig } from '../../share';
import { ButtonBarObject, ButtonBarObjectConfig } from '../td-button-bar/td-button-bar.model';
import { LinkBarObject, LinkBarObjectConfig } from '../td-link-bar/td-link-bar.model';

export interface CardActionObjectConfig {
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
  action?: ButtonBarObjectConfig | LinkBarObjectConfig | ButtonBarObject | LinkBarObject;
}

export class CardActionObject {
  readonly id: string;
  readonly className: string;
  readonly layout: 'single' | 'split';
  readonly leftColClass: string;
  readonly rightColClass: string;
  readonly header: BlockObject;
  readonly body: BlockObject;
  readonly leftFields: BlockObject[];
  readonly fields: BlockObject[];
  readonly footer: BlockObject;
  readonly type: string;
  readonly action: ButtonBarObject | LinkBarObject;

  constructor(cardAction: CardActionObjectConfig = {}) {
    this.id = cardAction.id ?? generateId('card-action');
    this.className = typeof cardAction.className === 'string' ? cardAction.className : 'card border m-2 shadow';
    this.layout = cardAction.layout === 'split' ? 'split' : 'single';
    this.leftColClass = typeof cardAction.leftColClass === 'string' ? cardAction.leftColClass : 'col-12 col-sm-4';
    this.rightColClass = typeof cardAction.rightColClass === 'string' ? cardAction.rightColClass : 'col-12 col-sm-8';

    // Header
    const rawHeader = cardAction.header ?? {};
    this.header = rawHeader instanceof BlockObject ? rawHeader : new BlockObject(rawHeader);

    // Body wrapper
    const rawBody = cardAction.body ?? {};
    this.body = rawBody instanceof BlockObject ? rawBody : new BlockObject(rawBody);

    // Left fields (for split layout)
    const rawLeftFields = Array.isArray(cardAction.leftFields) ? cardAction.leftFields : [];
    this.leftFields = rawLeftFields.map(f =>
      f instanceof BlockObject ? f : new BlockObject(f || {})
    );

    // Main fields
    const rawFields = Array.isArray(cardAction.fields) ? cardAction.fields : [];
    if (rawFields.length === 0) {
      throw new Error('CardActionObject requires at least one field in `fields`.');
    }
    this.fields = rawFields.map(f =>
      f instanceof BlockObject ? f : new BlockObject(f || {})
    );

    // Footer
    const rawFooter = cardAction.footer ?? {};
    this.footer = rawFooter instanceof BlockObject ? rawFooter : new BlockObject(rawFooter);

    // Action bar type
    this.type = cardAction.type ?? 'AlloyButtonBar';

    // Normalize action bar
    const rawAction = cardAction.action;
    if (this.type === 'AlloyLinkBar') {
      this.action = rawAction instanceof LinkBarObject
        ? rawAction
        : rawAction
          ? new LinkBarObject(rawAction as LinkBarObjectConfig)
          : new LinkBarObject({});
    } else {
      this.action = rawAction instanceof ButtonBarObject
        ? rawAction
        : rawAction
          ? new ButtonBarObject(rawAction as ButtonBarObjectConfig)
          : new ButtonBarObject({});
    }
  }

  /**
   * Check if header should be rendered
   */
  hasHeader(): boolean {
    return this.header && (this.header.hasText() || (this.header.className?.trim()?.length > 0));
  }

  /**
   * Check if footer should be rendered
   */
  hasFooter(): boolean {
    return this.footer.hasText() || this.hasAction();
  }

  /**
   * Check if action bar exists
   */
  hasAction(): boolean {
    return !!this.action;
  }

  /**
   * Check if using split layout
   */
  isSplitLayout(): boolean {
    return this.layout === 'split' && this.leftFields.length > 0;
  }

  /**
   * Check if action bar is LinkBar type
   */
  isLinkBarAction(): boolean {
    return this.type === 'AlloyLinkBar';
  }

  /**
   * Get all fields (left + right) for data collection
   */
  getAllFields(): BlockObject[] {
    return [...this.leftFields, ...this.fields];
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): CardActionObjectConfig {
    return {
      id: this.id,
      className: this.className,
      layout: this.layout,
      leftColClass: this.leftColClass,
      rightColClass: this.rightColClass,
      type: this.type,
    };
  }
}
