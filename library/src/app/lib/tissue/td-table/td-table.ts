import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableObject, TableRow, ProcessedColumn } from './td-table.model';
import { OutputObject } from '../../share';

interface SortState {
  col: string;
  subCol?: string;
  dir: 'asc' | 'desc';
}

@Component({
  selector: 'td-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-table.html',
  styleUrls: ['./td-table.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdTable implements OnChanges {
  @Input({ required: true }) table!: TableObject;
  @Output() output = new EventEmitter<OutputObject>();

  /** Fallback header keys (used when no column config) */
  headerKeys: string[] = [];

  /** Processed columns with computed properties */
  processedColumns: ProcessedColumn[] = [];

  /** Current sort state */
  sort: SortState = { col: '', dir: 'asc' };

  /** Whether table uses grouped columns */
  hasGroupedColumns = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table'] && this.table) {
      if (this.table.hasColumnConfig()) {
        this.processedColumns = this.table.getProcessedColumns();
        this.hasGroupedColumns = this.table.hasGroupedColumns();
      } else {
        // Fallback to legacy behavior
        this.headerKeys = this.table.getHeaderKeys();
        this.hasGroupedColumns = false;
      }
    }
  }

  /**
   * Handle column header click for sorting (simple columns)
   */
  onHeaderClick(colKey: string, subColKey?: string): void {
    if (!colKey) return;

    const isSameColumn = this.sort.col === colKey && this.sort.subCol === subColKey;
    const nextDir: 'asc' | 'desc' = isSameColumn && this.sort.dir === 'asc' ? 'desc' : 'asc';

    this.sort = { col: colKey, subCol: subColKey, dir: nextDir };

    const out = new OutputObject({
      id: this.table.id,
      type: 'column',
      action: 'Sort',
      error: false,
      data: {
        name: colKey,
        subColumn: subColKey || null,
        dir: nextDir,
      },
    });

    this.output.emit(out);
  }

  /**
   * Handle row click
   */
  onRowClick(row: TableRow): void {
    const out = new OutputObject({
      id: this.table.id,
      type: 'row',
      action: 'Row',
      error: false,
      data: {
        id: row.id,
        row: row,
      },
    });

    this.output.emit(out);
  }

  /**
   * Prettify column header label
   * camelCase / snake_case → "Camel Case"
   */
  prettifyLabel(key: string): string {
    if (typeof key !== 'string') return '';
    const withSpaces = key
      .replace(/_/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }

  /**
   * Get cell value - handles both simple and nested values
   */
  getCellValue(row: TableRow, colKey: string, subColKey?: string): unknown {
    const value = row[colKey];

    if (subColKey && value && typeof value === 'object') {
      return (value as Record<string, unknown>)[subColKey];
    }

    return value;
  }

  /**
   * Format cell value for display
   */
  formatCellValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  }

  /**
   * Check if column is currently sorted
   */
  isColumnActive(colKey: string, subColKey?: string): boolean {
    return this.sort.col === colKey && this.sort.subCol === subColKey;
  }

  /**
   * Check if sort direction is descending
   */
  isDescending(): boolean {
    return this.sort.dir === 'desc';
  }

  /**
   * Get sort icon transform style
   */
  getSortIconStyle(): { [key: string]: string } {
    return {
      transform: this.isDescending() ? 'rotate(180deg)' : 'none',
      transition: 'transform 120ms',
    };
  }

  /**
   * Track by function for rows
   */
  trackByRow(index: number, row: TableRow): string | number {
    return row.id ?? index;
  }

  /**
   * Track by function for columns
   */
  trackByColumn(index: number, col: ProcessedColumn | string): string {
    return typeof col === 'string' ? col : col.key;
  }

  /**
   * Track by function for sub-columns
   */
  trackBySubColumn(index: number, subCol: { key: string; label: string }): string {
    return subCol.key;
  }

  /**
   * Get all sub-columns for the second header row
   */
  getAllSubColumns(): { parentKey: string; key: string; label: string }[] {
    const subCols: { parentKey: string; key: string; label: string }[] = [];

    for (const col of this.processedColumns) {
      if (col.type === 'grouped' && col.subColumns.length > 0) {
        for (const sub of col.subColumns) {
          subCols.push({
            parentKey: col.key,
            key: sub.key,
            label: sub.label
          });
        }
      }
    }

    return subCols;
  }

  /**
   * Get flat list of all cell definitions for a row
   */
  getCellDefinitions(): { colKey: string; subColKey?: string }[] {
    const cells: { colKey: string; subColKey?: string }[] = [];

    for (const col of this.processedColumns) {
      if (col.type === 'grouped' && col.subColumns.length > 0) {
        for (const sub of col.subColumns) {
          cells.push({ colKey: col.key, subColKey: sub.key });
        }
      } else {
        cells.push({ colKey: col.key });
      }
    }

    return cells;
  }
}