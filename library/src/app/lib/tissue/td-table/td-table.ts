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

import { TableObject, TableRow } from './td-table.model';
import { OutputObject } from '../../share';

interface SortState {
  col: string;
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

  headerKeys: string[] = [];
  sort: SortState = { col: '', dir: 'asc' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table'] && this.table) {
      this.headerKeys = this.table.getHeaderKeys();
    }
  }

  /**
   * Handle column header click for sorting
   */
  onHeaderClick(colName: string): void {
    if (!colName) return;

    // Toggle direction if clicking same column
    const nextDir: 'asc' | 'desc' =
      this.sort.col === colName && this.sort.dir === 'asc' ? 'desc' : 'asc';

    this.sort = { col: colName, dir: nextDir };

    const out = new OutputObject({
      id: this.table.id,
      type: 'column',
      action: 'Sort',
      error: false,
      data: {
        name: colName,
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
   * Format cell value for display
   */
  formatCellValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  }

  /**
   * Check if column is currently sorted
   */
  isColumnActive(col: string): boolean {
    return this.sort.col === col;
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
  trackByColumn(index: number, key: string): string {
    return key;
  }
}
