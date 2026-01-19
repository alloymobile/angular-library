/**
 * TableObject - Model for basic data table
 *
 * Handles table configuration including:
 * - Row data
 * - Column headers (derived from first row)
 * - Icon for type column
 * - Sort indicator icon
 */

import { generateId, IconObject, IconObjectConfig } from '../../share';

export interface TableRow {
  id?: string | number;
  [key: string]: unknown;
}

export interface TableObjectConfig {
  id?: string;
  className?: string;
  name?: string;
  rows?: TableRow[];
  icon?: IconObjectConfig | IconObject;
  sort?: IconObjectConfig | IconObject;
}

export class TableObject {
  readonly id: string;
  readonly className: string;
  readonly name: string;
  readonly rows: TableRow[];
  readonly icon: IconObject;
  readonly sort: IconObject;

  constructor(table: TableObjectConfig = {}) {
    this.id = table.id ?? generateId('table');
    this.className = typeof table.className === 'string' ? table.className : 'table';
    this.name = typeof table.name === 'string' ? table.name : 'table';

    // Shallow copy of rows to avoid external mutation
    this.rows = Array.isArray(table.rows) ? table.rows.slice() : [];

    // Default icons
    const defaultRowIcon: IconObjectConfig = { iconClass: 'fa-solid fa-user' };
    const defaultSortIcon: IconObjectConfig = { iconClass: 'fa-solid fa-arrow-down' };

    this.icon = table.icon instanceof IconObject
      ? table.icon
      : new IconObject(table.icon || defaultRowIcon);

    this.sort = table.sort instanceof IconObject
      ? table.sort
      : new IconObject(table.sort || defaultSortIcon);
  }

  /**
   * Check if table has rows
   */
  hasRows(): boolean {
    return this.rows.length > 0;
  }

  /**
   * Get header keys from first row (excluding 'id')
   */
  getHeaderKeys(): string[] {
    if (this.rows.length === 0) return [];
    return Object.keys(this.rows[0]).filter(k => k !== 'id');
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): TableObjectConfig {
    return {
      id: this.id,
      className: this.className,
      name: this.name,
      rows: this.rows,
    };
  }
}
