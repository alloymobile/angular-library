// td-table-action.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdTableActionModel, TdTableRow } from './td-table-action.model';
import { OutputObject } from '../../share';

import { TdButtonBar } from '../td-button-bar/td-button-bar';

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
})
export class TdTableAction implements OnChanges {
  @Input({ required: true }) tableAction!: TdTableActionModel;
  @Output() output = new EventEmitter<OutputObject>();

  headerKeys: string[] = [];
  sort: SortState = { col: '', dir: 'asc' };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableAction'] && this.tableAction) {
      this.headerKeys = this.tableAction.getHeaderKeys();
      this.sort = { col: '', dir: 'asc' };
    }
  }

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

  onRowClick(row: TdTableRow): void {
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
      return;
    }

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

  onCellClick(row: TdTableRow, event: Event): void {
    if (this.tableAction.hasLink()) {
      event.stopPropagation();
      this.onRowClick(row);
    }
  }

  onActionOutput(row: TdTableRow, innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.tableAction.id,
      type: 'table',
      action: (innerOut.data?.['name'] as string) || innerOut.action || 'action',
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...row,
        buttonData: innerOut.data,
      },
    });

    this.output.emit(out);
  }

  prettifyLabel(key: string): string {
    if (typeof key !== 'string') return '';
    const withSpaces = key.replace(/_/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }

  formatCellValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  }

  isColumnActive(col: string): boolean {
    return this.sort.col === col;
  }

  isDescending(): boolean {
    return this.sort.dir === 'desc';
  }

  getSortIconStyle(): { [key: string]: string } {
    return {
      transform: this.isDescending() ? 'rotate(180deg)' : 'none',
      transition: 'transform 120ms',
    };
  }

  getRowLink(row: TdTableRow): string {
    return this.tableAction.buildRowLink(row);
  }

  isRowClickable(): boolean {
    return this.tableAction.hasLink();
  }

  trackByRow(index: number, row: TdTableRow): string | number {
    return row.id ?? index;
  }

  trackByColumn(index: number, key: string): string {
    return key;
  }
}
