/**
 * TagObject - Model for tag/badge elements
 *
 * Used for labels, badges, headings, and category indicators.
 */

import { generateId } from './id-helper';

export interface TagObjectConfig {
  id?: string;
  name?: string;
  className?: string;
  title?: string;
}

export class TagObject {
  readonly id: string;
  readonly name: string;
  readonly className: string;
  readonly title: string;

  constructor(tag: TagObjectConfig = {}) {
    this.id = tag.id ?? generateId('tag');
    this.name = typeof tag.name === 'string' ? tag.name : '';
    this.className = typeof tag.className === 'string' ? tag.className : 'badge bg-secondary';
    this.title = typeof tag.title === 'string' ? tag.title : '';
  }

  /**
   * Check if tag has displayable content
   */
  hasContent(): boolean {
    return this.name.trim().length > 0;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): TagObjectConfig {
    return {
      id: this.id,
      name: this.name,
      className: this.className,
      title: this.title,
    };
  }
}
