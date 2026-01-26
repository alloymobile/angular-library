/**
 * TdTableActionModel - Model for data table with row actions
 *
 * Features:
 * - Backward compatible: works with flat key-value rows (legacy mode)
 * - Grouped column headers (new mode with explicit column config)
 * - Mixed cell types: text, icon-text, input, status
 * - Row selection checkboxes
 * - Action buttons per row
 *
 * Rules:
 * - This model hydrates ONLY its own direct fields.
 * - Embedded models are the responsibility of the embedded model constructors.
 *   - icon/sort -> IconObject
 *   - actions   -> TdButtonBarModel
 */

import { generateId, IconObject, IconObjectConfig } from '../../share';
import { TdButtonBarModel } from '../td-button-bar/td-button-bar.model';
import { TdIconModel } from '../../cell/td-icon/td-icon.model';

/* ─────────────────────────── Cell Type Definitions ─────────────────────────── */

export type CellType = 'text' | 'icon-text' | 'input' | 'status';

export interface StatusConfig {
  value: string;
  variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'primary';
}

export interface IconTextCellConfig {
  icon: { iconClass: string; className?: string } | TdIconModel;
  value: string | number | null;
}

export interface InputCellConfig {
  id?: string;
  name?: string;
  type?: 'text' | 'number';
  value?: string | number | null;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
}

/* ─────────────────────────── Column Configuration ─────────────────────────── */

export interface SubColumnConfig {
  key: string;
  label?: string;
  cellType?: CellType;
  width?: string;
}

export interface ColumnConfig {
  key: string;
  label?: string;
  type: 'simple' | 'grouped';
  cellType?: CellType;
  subColumns?: SubColumnConfig[];
  width?: string;
}

/* ─────────────────────────── Processed Column (Internal) ─────────────────────────── */

export interface ProcessedColumn {
  key: string;
  label: string;
  type: 'simple' | 'grouped';
  cellType: CellType;
  subColumns: { key: string; label: string; cellType: CellType; width?: string }[];
  colspan: number;
  width?: string;
}

/* ─────────────────────────── Row Definition ─────────────────────────── */

export interface TdTableRow {
  id?: string | number;
  selected?: boolean;
  [key: string]: unknown;
}

/* ─────────────────────────── Model Configuration ─────────────────────────── */

export interface TdTableActionConfig {
  id?: string;
  className?: string;
  name?: string;
  rows?: TdTableRow[];
  columns?: ColumnConfig[];
  icon?: IconObjectConfig | IconObject;
  sort?: IconObjectConfig | IconObject;
  link?: string;
  actions?: TdButtonBarModel | any;
  actionsHeader?: string;
  showCheckboxColumn?: boolean;
  showIconColumn?: boolean;
}

/* ─────────────────────────── Main Model Class ─────────────────────────── */

export class TdTableActionModel {
  readonly id: string;
  readonly className: string;
  readonly name: string;
  readonly rows: TdTableRow[];
  readonly columns: ColumnConfig[];
  readonly icon: IconObject;
  readonly sort: IconObject;
  readonly link: string;
  readonly actions: TdButtonBarModel;
  readonly actionsHeader: string;
  readonly showCheckboxColumn: boolean;
  readonly showIconColumn: boolean;

  constructor(cfg: TdTableActionConfig = {}) {
    this.id = typeof cfg.id === 'string' && cfg.id.trim()
      ? cfg.id
      : generateId('table-action');

    this.className = typeof cfg.className === 'string'
      ? cfg.className
      : 'table table-hover';

    this.name = typeof cfg.name === 'string' ? cfg.name : 'Table';
    this.link = typeof cfg.link === 'string' ? cfg.link : '';
    this.actionsHeader = typeof cfg.actionsHeader === 'string' ? cfg.actionsHeader : 'Actions';

    // Column configuration (new feature)
    this.columns = Array.isArray(cfg.columns) ? cfg.columns : [];

    // Shallow copy of rows with selection support
    this.rows = Array.isArray(cfg.rows)
      ? cfg.rows.map(row => ({ ...row, selected: row.selected ?? false }))
      : [];

    // Options for checkbox and icon columns
    this.showCheckboxColumn = cfg.showCheckboxColumn ?? false;
    this.showIconColumn = cfg.showIconColumn !== false; // Default: true for backward compatibility

    // Default icons
    const defaultRowIcon: IconObjectConfig = { iconClass: 'fa-solid fa-user' };
    const defaultSortIcon: IconObjectConfig = { iconClass: 'fa-solid fa-arrow-down' };

    this.icon = cfg.icon instanceof IconObject
      ? cfg.icon
      : new IconObject(cfg.icon || defaultRowIcon);

    this.sort = cfg.sort instanceof IconObject
      ? cfg.sort
      : new IconObject(cfg.sort || defaultSortIcon);

    // Actions -> TdButtonBarModel
    if (cfg.actions instanceof TdButtonBarModel) {
      this.actions = cfg.actions;
    } else if (cfg.actions && typeof cfg.actions === 'object') {
      this.actions = new TdButtonBarModel(cfg.actions);
    } else {
      this.actions = new TdButtonBarModel({});
    }
  }

  /* ─────────────────────────── Basic Checks ─────────────────────────── */

  hasRows(): boolean {
    return this.rows.length > 0;
  }

  hasActions(): boolean {
    return Array.isArray(this.actions.buttons) && this.actions.buttons.length > 0;
  }

  hasLink(): boolean {
    return this.link.trim().length > 0;
  }

  /* ─────────────────────────── Column Mode Checks ─────────────────────────── */

  /**
   * Check if explicit column configuration is provided (new mode)
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

  /* ─────────────────────────── Header Keys (Legacy Mode) ─────────────────────────── */

  /**
   * Get header keys from first row (excluding 'id' and 'selected')
   * Used as fallback when no column config provided
   */
  getHeaderKeys(): string[] {
    if (this.rows.length === 0) return [];
    return Object.keys(this.rows[0]).filter(k => k !== 'id' && k !== 'selected');
  }

  /* ─────────────────────────── Processed Columns (New Mode) ─────────────────────────── */

  /**
   * Get processed columns with computed properties
   */
  getProcessedColumns(): ProcessedColumn[] {
    return this.columns.map(col => {
      const subCols = col.type === 'grouped' && col.subColumns
        ? col.subColumns.map(sub => ({
            key: sub.key,
            label: sub.label || this.prettifyKey(sub.key),
            cellType: sub.cellType || 'text',
            width: sub.width
          }))
        : [];

      return {
        key: col.key,
        label: col.label || this.prettifyKey(col.key),
        type: col.type,
        cellType: col.cellType || 'text',
        subColumns: subCols,
        colspan: col.type === 'grouped' ? Math.max(subCols.length, 1) : 1,
        width: col.width
      };
    });
  }

  /**
   * Get total column count (for colspan calculations)
   */
  getTotalColumnCount(): number {
    if (this.hasColumnConfig()) {
      const processed = this.getProcessedColumns();
      let count = processed.reduce((sum, col) => sum + col.colspan, 0);
      if (this.showCheckboxColumn) count += 1;
      if (this.showIconColumn) count += 1;
      if (this.hasActions()) count += 1;
      return count;
    } else {
      // Legacy mode
      let count = this.getHeaderKeys().length;
      if (this.showCheckboxColumn) count += 1;
      if (this.showIconColumn) count += 1;
      if (this.hasActions()) count += 1;
      return count;
    }
  }

  /* ─────────────────────────── Row Selection ─────────────────────────── */

  getSelectedRows(): TdTableRow[] {
    return this.rows.filter(row => row.selected);
  }

  areAllSelected(): boolean {
    return this.rows.length > 0 && this.rows.every(row => row.selected);
  }

  areSomeSelected(): boolean {
    return this.rows.some(row => row.selected) && !this.areAllSelected();
  }

  /* ─────────────────────────── URL Building ─────────────────────────── */

  buildRowLink(row: TdTableRow): string {
    if (!this.link) return '';

    return this.link.replace(/\{(\w+)\}/g, (_match, field) => {
      const value = row[field];
      if (value === null || value === undefined) return '';
      return encodeURIComponent(String(value));
    });
  }

  /* ─────────────────────────── Utilities ─────────────────────────── */

  private prettifyKey(key: string): string {
    if (typeof key !== 'string') return '';
    const withSpaces = key
      .replace(/_/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }

  /* ─────────────────────────── Serialization ─────────────────────────── */

  toJSON(): any {
    return {
      id: this.id,
      className: this.className,
      name: this.name,
      link: this.link,
      actionsHeader: this.actionsHeader,
      showCheckboxColumn: this.showCheckboxColumn,
      showIconColumn: this.showIconColumn,
      columns: this.columns,
      rows: this.rows,
    };
  }
}