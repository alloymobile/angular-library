/**
 * CardObject - Model for card component
 *
 * Supports single and split layouts with:
 * - Header section
 * - Body with fields (BlockObjects)
 * - Footer section
 */

import { generateId, BlockObject, BlockObjectConfig } from '../../share';

export interface CardObjectConfig {
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
}

export class CardObject {
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

  constructor(card: CardObjectConfig = {}) {
    this.id = card.id ?? generateId('card');
    this.className = typeof card.className === 'string' ? card.className : 'card border m-2 shadow';
    this.layout = card.layout === 'split' ? 'split' : 'single';
    this.leftColClass = typeof card.leftColClass === 'string' ? card.leftColClass : 'col-12 col-sm-4';
    this.rightColClass = typeof card.rightColClass === 'string' ? card.rightColClass : 'col-12 col-sm-8';

    // Header
    const rawHeader = card.header ?? {};
    this.header = rawHeader instanceof BlockObject ? rawHeader : new BlockObject(rawHeader);

    // Body wrapper
    const rawBody = card.body ?? {};
    this.body = rawBody instanceof BlockObject ? rawBody : new BlockObject(rawBody);

    // Left fields (for split layout)
    const rawLeftFields = Array.isArray(card.leftFields) ? card.leftFields : [];
    this.leftFields = rawLeftFields.map(f =>
      f instanceof BlockObject ? f : new BlockObject(f || {})
    );

    // Main fields
    const rawFields = Array.isArray(card.fields) ? card.fields : [];
    if (rawFields.length === 0) {
      throw new Error('CardObject requires at least one field in `fields`.');
    }
    this.fields = rawFields.map(f =>
      f instanceof BlockObject ? f : new BlockObject(f || {})
    );

    // Footer
    const rawFooter = card.footer ?? {};
    this.footer = rawFooter instanceof BlockObject ? rawFooter : new BlockObject(rawFooter);
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
    return this.footer && (this.footer.hasText() || (this.footer.className?.trim()?.length > 0));
  }

  /**
   * Check if using split layout
   */
  isSplitLayout(): boolean {
    return this.layout === 'split' && this.leftFields.length > 0;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): CardObjectConfig {
    return {
      id: this.id,
      className: this.className,
      layout: this.layout,
      leftColClass: this.leftColClass,
      rightColClass: this.rightColClass,
    };
  }
}
