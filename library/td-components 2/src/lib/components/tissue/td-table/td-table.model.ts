// src/lib/components/tissue/td-table/td-table.model.ts

import { generateId } from '../../../utils/id-helper';

/**
 * ColumnConfig - Configuration for a table column
 */
export interface ColumnConfig {
  key: string;
  label?: string;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  render?: (value: any, row: any, index: number) => string;
}

export class ColumnObject {
  key: string;
  label: string;
  className: string;
  headerClassName: string;
  sortable: boolean;
  render?: (value: any, row: any, index: number) => string;

  constructor(col: ColumnConfig) {
    if (!col.key) {
      throw new Error('ColumnObject requires `key`.');
    }
    this.key = col.key;
    this.label = col.label ?? col.key;
    this.className = col.className ?? '';
    this.headerClassName = col.headerClassName ?? '';
    this.sortable = col.sortable ?? false;
    this.render = col.render;
  }
}

/**
 * TableConfig - Configuration for TdTable component
 */
export interface TableConfig {
  id?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  columns: ColumnConfig[];
  rows: Record<string, any>[];
  idKey?: string;
  striped?: boolean;
  bordered?: boolean;
  hover?: boolean;
  responsive?: boolean;
  emptyMessage?: string;
}

export class TableObject {
  id: string;
  className: string;
  headerClassName: string;
  bodyClassName: string;
  rowClassName: string;
  columns: ColumnObject[];
  rows: Record<string, any>[];
  idKey: string;
  striped: boolean;
  bordered: boolean;
  hover: boolean;
  responsive: boolean;
  emptyMessage: string;

  constructor(table: TableConfig) {
    if (!table.columns || !Array.isArray(table.columns) || table.columns.length === 0) {
      throw new Error('TableObject requires `columns` array.');
    }

    this.id = table.id ?? generateId('table');
    this.className = table.className ?? 'table';
    this.headerClassName = table.headerClassName ?? '';
    this.bodyClassName = table.bodyClassName ?? '';
    this.rowClassName = table.rowClassName ?? '';
    this.idKey = table.idKey ?? 'id';
    this.striped = table.striped ?? false;
    this.bordered = table.bordered ?? false;
    this.hover = table.hover ?? true;
    this.responsive = table.responsive ?? true;
    this.emptyMessage = table.emptyMessage ?? 'No data available';

    // Hydrate columns
    this.columns = table.columns.map(col =>
      col instanceof ColumnObject ? col : new ColumnObject(col)
    );

    // Store rows
    this.rows = Array.isArray(table.rows) ? table.rows : [];
  }

  /**
   * Get computed table class
   */
  getTableClass(): string {
    const classes = [this.className];
    if (this.striped) classes.push('table-striped');
    if (this.bordered) classes.push('table-bordered');
    if (this.hover) classes.push('table-hover');
    return classes.join(' ');
  }

  /**
   * Get cell value for rendering
   */
  getCellValue(row: Record<string, any>, col: ColumnObject, index: number): any {
    const value = row[col.key];
    if (col.render) {
      return col.render(value, row, index);
    }
    return value ?? '';
  }

  /**
   * Get row key for tracking
   */
  getRowKey(row: Record<string, any>, index: number): string {
    return row[this.idKey] ?? index.toString();
  }

  /**
   * Check if table has rows
   */
  hasRows(): boolean {
    return this.rows.length > 0;
  }
}
