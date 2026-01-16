// src/lib/components/tissue/td-table/td-table.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableObject, ColumnObject } from './td-table.model';
import { OutputObject } from '../../../utils/id-helper';

/**
 * TdTableComponent
 * 
 * Renders a Bootstrap-style data table with columns and rows.
 */
@Component({
  selector: 'td-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-table.component.html',
  styleUrls: ['./td-table.component.css']
})
export class TdTableComponent implements OnInit, OnChanges {
  /**
   * Input: TableObject instance (required)
   */
  @Input() table!: TableObject;

  /**
   * Output: Emits row events
   */
  @Output() output = new EventEmitter<any>();

  // Sort state
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.table || !(this.table instanceof TableObject)) {
      throw new Error('TdTableComponent requires `table` prop (TableObject instance).');
    }
  }

  /**
   * Handle row click
   */
  onRowClick(row: Record<string, any>, index: number): void {
    const out = OutputObject.ok({
      id: this.table.id,
      type: 'table',
      action: 'rowClick',
      data: { row, index }
    });
    this.output.emit(out);
  }

  /**
   * Handle column sort
   */
  onSort(col: ColumnObject): void {
    if (!col.sortable) return;

    if (this.sortColumn === col.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col.key;
      this.sortDirection = 'asc';
    }

    const out = OutputObject.ok({
      id: this.table.id,
      type: 'table',
      action: 'sort',
      data: { column: col.key, direction: this.sortDirection }
    });
    this.output.emit(out);
  }

  /**
   * Get sort icon class
   */
  getSortIconClass(col: ColumnObject): string {
    if (!col.sortable) return '';
    if (this.sortColumn !== col.key) return 'fa-solid fa-sort text-muted';
    return this.sortDirection === 'asc' 
      ? 'fa-solid fa-sort-up' 
      : 'fa-solid fa-sort-down';
  }

  /**
   * Track by functions
   */
  trackByCol(index: number, col: ColumnObject): string {
    return col.key;
  }

  trackByRow(index: number, row: Record<string, any>): string {
    return this.table.getRowKey(row, index);
  }
}
