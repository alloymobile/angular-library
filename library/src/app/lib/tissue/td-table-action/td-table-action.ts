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

import { TableActionObject, TableRow } from './td-table-action.model';
import { OutputObject } from '../../share';
import { TdButtonBar } from '../td-button-bar/td-button-bar';
import { ButtonBarObject } from '../td-button-bar/td-button-bar.model';

interface SortState {
  col: string;
  dir: 'asc' | 'desc';
}

@Component({
  selector: 'td-table-action',
  standalone: true,
  imports: [CommonModule, TdButtonBar],
  templateUrl: './td-table-action.html',
  styleUrls: ['./td-table-action.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdTableAction implements OnChanges {
  @Input({ required: true }) tableAction!: TableActionObject;
  @Output() output = new EventEmitter<OutputObject>();

  headerKeys: string[] = [];
  sort: SortState = { col: '', dir: 'asc' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableAction'] && this.tableAction) {
      this.headerKeys = this.tableAction.getHeaderKeys();
    }
  }

  /**
   * Handle column header click for sorting
   */
  onHeaderClick(colName: string): void {
    if (!colName) return;

    const nextDir: 'asc' | 'desc' =
      this.sort.col === colName && this.sort.dir === 'asc' ? 'desc' : 'asc';

    this.sort = { col: colName, dir: nextDir };

    const out = new OutputObject({
      id: this.tableAction.id,
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
   * Handle row click (navigate if link is set)
   */
  onRowClick(row: TableRow): void {
    if (this.tableAction.hasLink()) {
      const to = this.tableAction.buildRowLink(row);
      const out = new OutputObject({
        id: this.tableAction.id,
        type: 'row',
        action: 'Row',
        error: false,
        data: {
          to,
          ...row,
        },
      });
      this.output.emit(out);
    } else {
      const out = new OutputObject({
        id: this.tableAction.id,
        type: 'row',
        action: 'Row',
        error: false,
        data: {
          id: row.id,
        },
      });
      this.output.emit(out);
    }
  }

  /**
   * Handle cell click (navigate if link is set)
   */
  onCellClick(row: TableRow, event: Event): void {
    if (this.tableAction.hasLink()) {
      event.stopPropagation();
      this.onRowClick(row);
    }
  }

  /**
   * Handle action button click
   */
  onActionOutput(row: TableRow, innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.tableAction.id,
      type: 'table',
      action: innerOut.data?.['name'] as string || innerOut.action || 'action',
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...row,
        buttonData: innerOut.data,
      },
    });

    this.output.emit(out);
  }

  /**
   * Prettify column header label
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
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
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
   * Get row link URL
   */
  getRowLink(row: TableRow): string {
    return this.tableAction.buildRowLink(row);
  }

  /**
   * Check if row is clickable
   */
  isRowClickable(): boolean {
    return this.tableAction.hasLink();
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
