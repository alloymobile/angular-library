import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  TdTableActionModel,
  TdTableRow,
  ProcessedColumn,
  CellType,
  IconTextCellConfig,
  InputCellConfig,
  StatusConfig
} from './td-table-action.model';

import { OutputObject } from '../../share';
import { TdButtonBar } from '../td-button-bar/td-button-bar';
import { TdIconText } from '../../cell/td-icon-text/td-icon-text';
import { TdIconTextModel } from '../../cell/td-icon-text/td-icon-text.model';

/* ─────────────────────────── Sort State Interface ─────────────────────────── */

interface SortState {
  col: string;
  subCol?: string;
  dir: 'asc' | 'desc';
}

/* ─────────────────────────── Cell Definition Interface ─────────────────────────── */

interface CellDefinition {
  colKey: string;
  subColKey?: string;
  cellType: CellType;
  width?: string;
}

/* ─────────────────────────── Component ─────────────────────────── */

@Component({
  selector: 'td-table-action',
  standalone: true,
  imports: [CommonModule, FormsModule, TdButtonBar, TdIconText],
  templateUrl: './td-table-action.html',
  styleUrls: ['./td-table-action.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdTableAction implements OnChanges {
  @Input({ required: true }) tableAction!: TdTableActionModel;
  @Output() output = new EventEmitter<OutputObject>();

  /** Legacy header keys (used when no column config) */
  headerKeys: string[] = [];

  /** Processed columns with computed properties */
  processedColumns: ProcessedColumn[] = [];

  /** Current sort state */
  sort: SortState = { col: '', dir: 'asc' };

  /** Whether table uses grouped columns */
  hasGroupedColumns = false;

  /** Track input values per row: Map<rowId, Map<fieldPath, value>> */
  inputValues: Map<string | number, Map<string, any>> = new Map();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableAction'] && this.tableAction) {
      if (this.tableAction.hasColumnConfig()) {
        // New mode: explicit column configuration
        this.processedColumns = this.tableAction.getProcessedColumns();
        this.hasGroupedColumns = this.tableAction.hasGroupedColumns();
        this.headerKeys = [];
        this.initializeInputValues();
      } else {
        // Legacy mode: derive headers from row keys
        this.headerKeys = this.tableAction.getHeaderKeys();
        this.processedColumns = [];
        this.hasGroupedColumns = false;
      }
      this.sort = { col: '', dir: 'asc' };
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* INPUT VALUE MANAGEMENT                                                       */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  private initializeInputValues(): void {
    this.inputValues.clear();

    for (const row of this.tableAction.rows) {
      const rowInputs = new Map<string, any>();

      for (const col of this.processedColumns) {
        if (col.type === 'grouped' && col.subColumns.length > 0) {
          for (const subCol of col.subColumns) {
            if (subCol.cellType === 'input') {
              const cellData = this.getCellData(row, col.key, subCol.key);
              const inputConfig = cellData as InputCellConfig;
              const fieldPath = `${col.key}.${subCol.key}`;
              rowInputs.set(fieldPath, inputConfig?.value ?? null);
            }
          }
        } else if (col.cellType === 'input') {
          const cellData = this.getCellData(row, col.key);
          const inputConfig = cellData as InputCellConfig;
          rowInputs.set(col.key, inputConfig?.value ?? null);
        }
      }

      if (row.id !== undefined) {
        this.inputValues.set(row.id, rowInputs);
      }
    }
  }

  getInputValue(rowId: string | number | undefined, fieldPath: string): any {
    if (rowId === undefined) return null;
    return this.inputValues.get(rowId)?.get(fieldPath) ?? null;
  }

  onInputChange(row: TdTableRow, fieldPath: string, event: Event, inputCfg: InputCellConfig): void {
    const target = event.target as HTMLInputElement;
    const value = target.type === 'number'
      ? (target.value === '' ? null : parseFloat(target.value))
      : target.value;

    if (row.id !== undefined) {
      let rowInputs = this.inputValues.get(row.id);
      if (!rowInputs) {
        rowInputs = new Map();
        this.inputValues.set(row.id, rowInputs);
      }
      rowInputs.set(fieldPath, value);
    }

    // Forward input event as-is (matching TdInput output format)
    const out = new OutputObject({
      id: inputCfg.id || `${this.tableAction.id}_${row.id}_${fieldPath}`,
      type: 'input',
      action: 'change',
      error: false,
      errorMessage: [],
      data: {
        name: fieldPath,
        value: value,
        rowId: row.id,
        errors: []
      }
    });

    this.output.emit(out);
  }

  onInputBlur(row: TdTableRow, fieldPath: string, event: Event, inputCfg: InputCellConfig): void {
    const target = event.target as HTMLInputElement;
    const value = target.type === 'number'
      ? (target.value === '' ? null : parseFloat(target.value))
      : target.value;

    // Forward blur event as-is (matching TdInput output format)
    const out = new OutputObject({
      id: inputCfg.id || `${this.tableAction.id}_${row.id}_${fieldPath}`,
      type: 'input',
      action: 'blur',
      error: false,
      errorMessage: [],
      data: {
        name: fieldPath,
        value: value,
        rowId: row.id,
        errors: []
      }
    });

    this.output.emit(out);
  }

  /* ─────────────────────────── Row Data with Input Values ─────────────────────────── */

  getRowWithInputs(row: TdTableRow): any {
    if (row.id === undefined) return { ...row };

    const rowInputs = this.inputValues.get(row.id);
    const result: any = { ...row };

    if (rowInputs) {
      rowInputs.forEach((value, fieldPath) => {
        const parts = fieldPath.split('.');
        if (parts.length === 2) {
          const [colKey, subColKey] = parts;
          if (!result[colKey] || typeof result[colKey] !== 'object') {
            result[colKey] = { ...(row[colKey] as object || {}) };
          } else {
            result[colKey] = { ...result[colKey] };
          }
          if (result[colKey][subColKey] && typeof result[colKey][subColKey] === 'object') {
            result[colKey][subColKey] = { ...result[colKey][subColKey], value };
          } else {
            result[colKey][subColKey] = { value };
          }
        } else {
          if (result[fieldPath] && typeof result[fieldPath] === 'object') {
            result[fieldPath] = { ...result[fieldPath], value };
          } else {
            result[fieldPath] = { value };
          }
        }
      });
    }

    return result;
  }

  getAllInputValues(row: TdTableRow): { [key: string]: any } {
    if (row.id === undefined) return {};

    const rowInputs = this.inputValues.get(row.id);
    const result: { [key: string]: any } = {};

    if (rowInputs) {
      rowInputs.forEach((value, fieldPath) => {
        result[fieldPath] = value;
      });
    }

    return result;
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* CHECKBOX SELECTION                                                           */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  onSelectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;

    for (const row of this.tableAction.rows) {
      row.selected = checked;
    }

    const out = new OutputObject({
      id: this.tableAction.id,
      type: 'selection',
      action: checked ? 'SelectAll' : 'DeselectAll',
      error: false,
      data: {
        selected: checked,
        rows: this.tableAction.getSelectedRows()
      }
    });

    this.output.emit(out);
    this.cdr.markForCheck();
  }

  onRowSelect(row: TdTableRow, event: Event): void {
    const target = event.target as HTMLInputElement;
    row.selected = target.checked;

    const out = new OutputObject({
      id: this.tableAction.id,
      type: 'selection',
      action: 'RowSelect',
      error: false,
      data: {
        rowId: row.id,
        selected: row.selected,
        row: row,
        selectedRows: this.tableAction.getSelectedRows()
      }
    });

    this.output.emit(out);
    this.cdr.markForCheck();
  }

  get isAllSelected(): boolean {
    return this.tableAction.areAllSelected();
  }

  get isIndeterminate(): boolean {
    return this.tableAction.areSomeSelected();
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* HEADER CLICK (SORTING)                                                       */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  onHeaderClick(colKey: string, subColKey?: string): void {
    if (!colKey) return;

    const isSameColumn = this.sort.col === colKey && this.sort.subCol === subColKey;
    const nextDir: 'asc' | 'desc' = isSameColumn && this.sort.dir === 'asc' ? 'desc' : 'asc';

    this.sort = { col: colKey, subCol: subColKey, dir: nextDir };

    const out = new OutputObject({
      id: this.tableAction.id,
      type: 'column',
      action: 'Sort',
      error: false,
      data: {
        name: colKey,
        subColumn: subColKey || null,
        dir: nextDir
      }
    });

    this.output.emit(out);
  }

  isColumnActive(colKey: string, subColKey?: string): boolean {
    return this.sort.col === colKey && this.sort.subCol === subColKey;
  }

  isDescending(): boolean {
    return this.sort.dir === 'desc';
  }

  getSortIconStyle(): { [key: string]: string } {
    return {
      transform: this.isDescending() ? 'rotate(180deg)' : 'none',
      transition: 'transform 120ms'
    };
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* ROW CLICK                                                                    */
  /* ═══════════════════════════════════════════════════════════════════════════ */

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
          ...this.getRowWithInputs(row)
        }
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
        row: this.getRowWithInputs(row)
      }
    });

    this.output.emit(out);
  }

  onCellClick(row: TdTableRow, event: Event): void {
    if (this.tableAction.hasLink()) {
      event.stopPropagation();
      this.onRowClick(row);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* ACTION BUTTON OUTPUT                                                         */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  onActionOutput(row: TdTableRow, innerOut: OutputObject): void {
    // Get button name from innerOut
    const buttonName = (innerOut.data?.['name'] as string) || innerOut.action || 'action';

    // Build flat row data with current input values merged
    const rowData = this.getRowDataWithInputs(row);

    const out = new OutputObject({
      id: this.tableAction.id,
      type: 'table',
      action: buttonName,
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: rowData
    });

    this.output.emit(out);
  }

  /**
   * Get flat row data with input values merged in
   */
/**
 * Get flat row data with input values merged in (extracts only values, not configs)
 */
private getRowDataWithInputs(row: TdTableRow): { [key: string]: any } {
  const result: { [key: string]: any } = {};

  // Copy basic row properties (excluding 'selected')
  for (const key of Object.keys(row)) {
    if (key === 'selected') continue;
    const value = row[key];

    // For nested objects (grouped columns), extract values only
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nested: { [k: string]: any } = {};
      for (const subKey of Object.keys(value as object)) {
        const subValue = (value as Record<string, any>)[subKey];
        // Extract value from cell config objects (icon-text, input, status)
        if (subValue && typeof subValue === 'object') {
          if ('value' in subValue) {
            // icon-text or input config: extract value
            nested[subKey] = subValue.value;
          } else if ('variant' in subValue && 'value' in subValue === false) {
            // status config without value field
            nested[subKey] = subValue;
          } else {
            nested[subKey] = subValue;
          }
        } else {
          nested[subKey] = subValue;
        }
      }
      result[key] = nested;
    } else {
      result[key] = value;
    }
  }

  // Merge current input values (these override the extracted values)
  if (row.id !== undefined) {
    const rowInputs = this.inputValues.get(row.id);
    if (rowInputs) {
      rowInputs.forEach((inputValue, fieldPath) => {
        const parts = fieldPath.split('.');
        if (parts.length === 2) {
          const [colKey, subColKey] = parts;
          if (!result[colKey]) result[colKey] = {};
          if (typeof result[colKey] === 'object') {
            result[colKey][subColKey] = inputValue;
          }
        } else {
          result[fieldPath] = inputValue;
        }
      });
    }
  }

  return result;
}

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* CELL DATA HELPERS                                                            */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  getCellData(row: TdTableRow, colKey: string, subColKey?: string): unknown {
    const value = row[colKey];

    if (subColKey && value && typeof value === 'object') {
      return (value as Record<string, unknown>)[subColKey];
    }

    return value;
  }

  getCellDefinitions(): CellDefinition[] {
    const cells: CellDefinition[] = [];

    for (const col of this.processedColumns) {
      if (col.type === 'grouped' && col.subColumns.length > 0) {
        for (const sub of col.subColumns) {
          cells.push({
            colKey: col.key,
            subColKey: sub.key,
            cellType: sub.cellType,
            width: sub.width
          });
        }
      } else {
        cells.push({
          colKey: col.key,
          cellType: col.cellType,
          width: col.width
        });
      }
    }

    return cells;
  }

  getFieldPath(colKey: string, subColKey?: string): string {
    return subColKey ? `${colKey}.${subColKey}` : colKey;
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* CELL TYPE CHECKS                                                             */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  isTextCell(cellType: CellType): boolean {
    return cellType === 'text';
  }

  isIconTextCell(cellType: CellType): boolean {
    return cellType === 'icon-text';
  }

  isInputCell(cellType: CellType): boolean {
    return cellType === 'input';
  }

  isStatusCell(cellType: CellType): boolean {
    return cellType === 'status';
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* CELL RENDERING HELPERS                                                       */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  prettifyLabel(key: string): string {
    if (typeof key !== 'string') return '';
    const withSpaces = key.replace(/_/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }

  formatCellValue(value: unknown): string {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  }

  getIconTextModel(cellData: unknown): TdIconTextModel | null {
    if (!cellData || typeof cellData !== 'object') return null;

    const config = cellData as IconTextCellConfig;
    if (!config.icon) return null;

    return new TdIconTextModel({
      icon: config.icon,
      value: config.value
    });
  }

  getInputConfig(cellData: unknown): InputCellConfig {
    if (!cellData || typeof cellData !== 'object') {
      return { type: 'text', value: null, placeholder: '—' };
    }
    return cellData as InputCellConfig;
  }

  getStatusConfig(cellData: unknown): StatusConfig | null {
    if (!cellData || typeof cellData !== 'object') return null;
    return cellData as StatusConfig;
  }

  getStatusClass(status: StatusConfig | null): string {
    if (!status) return 'badge bg-secondary';

    const variantMap: Record<string, string> = {
      success: 'badge bg-success',
      warning: 'badge bg-warning text-dark',
      danger: 'badge bg-danger',
      info: 'badge bg-info text-dark',
      secondary: 'badge bg-secondary',
      primary: 'badge bg-primary'
    };

    return variantMap[status.variant] || 'badge bg-secondary';
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* SUB-COLUMNS FOR SECOND HEADER ROW                                            */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  getAllSubColumns(): { parentKey: string; key: string; label: string; cellType: CellType; width?: string }[] {
    const subCols: { parentKey: string; key: string; label: string; cellType: CellType; width?: string }[] = [];

    for (const col of this.processedColumns) {
      if (col.type === 'grouped' && col.subColumns.length > 0) {
        for (const sub of col.subColumns) {
          subCols.push({
            parentKey: col.key,
            key: sub.key,
            label: sub.label,
            cellType: sub.cellType,
            width: sub.width
          });
        }
      }
    }

    return subCols;
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* UTILITIES                                                                    */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  isRowClickable(): boolean {
    return this.tableAction.hasLink();
  }

  getRowLink(row: TdTableRow): string {
    return this.tableAction.buildRowLink(row);
  }

  /* ═══════════════════════════════════════════════════════════════════════════ */
  /* TRACK BY FUNCTIONS                                                           */
  /* ═══════════════════════════════════════════════════════════════════════════ */

  trackByRow(index: number, row: TdTableRow): string | number {
    return row.id ?? index;
  }

  trackByColumn(index: number, col: ProcessedColumn | string): string {
    return typeof col === 'string' ? col : col.key;
  }

  trackBySubColumn(index: number, subCol: { key: string }): string {
    return subCol.key;
  }

  trackByCell(index: number, cell: CellDefinition): string {
    return cell.subColKey ? `${cell.colKey}.${cell.subColKey}` : cell.colKey;
  }
}