/**
 * TableObject - Model for data table with grouped headers support
 *
 * Handles table configuration including:
 * - Row data (flat and nested)
 * - Column configuration (simple and grouped)
 * - Icon for type column
 * - Sort indicator icon
 */

import { generateId, IconObject, IconObjectConfig } from '../../share';

/**
 * Sub-column configuration for grouped columns
 */
export interface SubColumnConfig {
  key: string;
  label?: string;
}

/**
 * Column configuration - supports both simple and grouped columns
 */
export interface ColumnConfig {
  /** Key in the row data object */
  key: string;
  /** Display label (defaults to prettified key) */
  label?: string;
  /** Column type: 'simple' for flat values, 'grouped' for nested objects */
  type: 'simple' | 'grouped';
  /** Sub-columns for grouped type (e.g., Target, Floor) */
  subColumns?: SubColumnConfig[];
}

/**
 * Table row - supports both flat and nested values
 */
export interface TableRow {
  id?: string | number;
  [key: string]: unknown;
}

/**
 * Configuration object for TableObject
 */
export interface TableObjectConfig {
  id?: string;
  className?: string;
  name?: string;
  rows?: TableRow[];
  /** Explicit column configuration for grouped headers */
  columns?: ColumnConfig[];
  icon?: IconObjectConfig | IconObject;
  sort?: IconObjectConfig | IconObject;
  /** Show/hide the icon column (default: true) */
  showIconColumn?: boolean;
}

/**
 * Processed column for internal use
 */
export interface ProcessedColumn {
  key: string;
  label: string;
  type: 'simple' | 'grouped';
  subColumns: { key: string; label: string }[];
  colspan: number;
}

export class TableObject {
  readonly id: string;
  readonly className: string;
  readonly name: string;
  readonly rows: TableRow[];
  readonly columns: ColumnConfig[];
  readonly icon: IconObject;
  readonly sort: IconObject;
  readonly showIconColumn: boolean;

  constructor(table: TableObjectConfig = {}) {
    this.id = table.id ?? generateId('table');
    this.className = typeof table.className === 'string' ? table.className : 'table';
    this.name = typeof table.name === 'string' ? table.name : 'Table';

    // Shallow copy of rows to avoid external mutation
    this.rows = Array.isArray(table.rows) ? table.rows.slice() : [];

    // Column configuration
    this.columns = Array.isArray(table.columns) ? table.columns : [];

    // Show icon column option
    this.showIconColumn = table.showIconColumn !== false;

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
   * Check if table has explicit column configuration
   */
  hasColumnConfig(): boolean {
    return this.columns.length > 0;
  }

  /**
   * Check if table has any grouped columns
   */
  hasGroupedColumns(): boolean {
    return this.columns.some(col => col.type === 'grouped');
  }

  /**
   * Get header keys from first row (excluding 'id')
   * Used as fallback when no column config provided
   */
  getHeaderKeys(): string[] {
    if (this.rows.length === 0) return [];
    return Object.keys(this.rows[0]).filter(k => k !== 'id');
  }

  /**
   * Get processed columns with computed properties
   */
  getProcessedColumns(): ProcessedColumn[] {
    return this.columns.map(col => {
      const subCols = col.type === 'grouped' && col.subColumns
        ? col.subColumns.map(sub => ({
            key: sub.key,
            label: sub.label || this.prettifyKey(sub.key)
          }))
        : [];

      return {
        key: col.key,
        label: col.label || this.prettifyKey(col.key),
        type: col.type,
        subColumns: subCols,
        colspan: col.type === 'grouped' ? Math.max(subCols.length, 1) : 1
      };
    });
  }

  /**
   * Get total column count (for colspan calculations)
   */
  getTotalColumnCount(): number {
    const processed = this.getProcessedColumns();
    let count = processed.reduce((sum, col) => sum + col.colspan, 0);
    if (this.showIconColumn) count += 1;
    return count;
  }

  /**
   * Prettify a key for display
   * camelCase / snake_case → "Camel Case"
   */
  private prettifyKey(key: string): string {
    if (typeof key !== 'string') return '';
    const withSpaces = key
      .replace(/_/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
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
      columns: this.columns,
      showIconColumn: this.showIconColumn,
    };
  }
}