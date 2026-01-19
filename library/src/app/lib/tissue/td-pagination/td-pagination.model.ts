/**
 * PaginationObject - Model for pagination component
 *
 * Handles server-side pagination info including:
 * - Total pages and elements
 * - Current page number
 * - First/last page indicators
 */

import { generateId } from '../../share';

export interface PaginationObjectConfig {
  id?: string;
  name?: string;
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  activeClassName?: string;
  disabledClassName?: string;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  numberOfElements?: number;
  size?: number;
  number?: number;
  first?: boolean;
  empty?: boolean;
}

export class PaginationObject {
  readonly id: string;
  readonly name: string;
  readonly className: string;
  readonly listClassName: string;
  readonly itemClassName: string;
  readonly activeClassName: string;
  readonly disabledClassName: string;
  readonly totalPages: number;
  readonly totalElements: number;
  readonly size: number;
  readonly pageNumber: number;
  readonly numberOfElements: number;
  readonly empty: boolean;
  readonly first: boolean;
  readonly last: boolean;

  constructor(config: PaginationObjectConfig = {}) {
    this.id = config.id ?? generateId('pagination');
    this.name = config.name ?? '';
    this.className = config.className ?? 'd-flex justify-content-end align-items-center mt-2';
    this.listClassName = config.listClassName ?? 'pagination justify-content-end mb-0';
    this.itemClassName = config.itemClassName ?? 'page-item';
    this.activeClassName = config.activeClassName ?? 'active';
    this.disabledClassName = config.disabledClassName ?? 'disabled';

    // Server-side pagination info
    this.totalPages = typeof config.totalPages === 'number' && config.totalPages >= 0 ? config.totalPages : 0;
    this.totalElements = typeof config.totalElements === 'number' && config.totalElements >= 0 ? config.totalElements : 0;
    this.size = typeof config.size === 'number' ? config.size : 0;
    this.pageNumber = typeof config.number === 'number' && config.number >= 0 ? config.number : 0;
    this.numberOfElements = typeof config.numberOfElements === 'number' ? config.numberOfElements : 0;
    this.empty = !!config.empty;

    this.first = typeof config.first === 'boolean' ? config.first : this.pageNumber === 0;
    this.last = typeof config.last === 'boolean'
      ? config.last
      : this.totalPages > 0
        ? this.pageNumber >= this.totalPages - 1
        : true;
  }

  /**
   * Check if there are pages to display
   */
  hasPages(): boolean {
    return this.totalPages > 0;
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): PaginationObjectConfig {
    return {
      id: this.id,
      name: this.name,
      className: this.className,
      listClassName: this.listClassName,
      itemClassName: this.itemClassName,
      activeClassName: this.activeClassName,
      disabledClassName: this.disabledClassName,
      totalPages: this.totalPages,
      totalElements: this.totalElements,
      size: this.size,
      number: this.pageNumber,
      numberOfElements: this.numberOfElements,
      empty: this.empty,
      first: this.first,
      last: this.last,
    };
  }
}
