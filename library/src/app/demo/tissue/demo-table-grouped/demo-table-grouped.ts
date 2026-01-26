import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdTable } from '../../../lib/tissue/td-table/td-table';
import { TableObject, ColumnConfig } from '../../../lib/tissue/td-table/td-table.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default Column Config ─────────────────────────── */

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'cvp', label: 'CVP', type: 'simple' },
  {
    key: 'lessThan5k',
    label: '<5k',
    type: 'grouped',
    subColumns: [
      { key: 'target', label: 'Target' },
      { key: 'floor', label: 'Floor' }
    ]
  },
  {
    key: 'from5kTo10k',
    label: '5-10k',
    type: 'grouped',
    subColumns: [
      { key: 'target', label: 'Target' },
      { key: 'floor', label: 'Floor' }
    ]
  },
  {
    key: 'from10kTo15k',
    label: '10-15k',
    type: 'grouped',
    subColumns: [
      { key: 'target', label: 'Target' },
      { key: 'floor', label: 'Floor' }
    ]
  },
  {
    key: 'from15kTo20k',
    label: '15-20k',
    type: 'grouped',
    subColumns: [
      { key: 'target', label: 'Target' },
      { key: 'floor', label: 'Floor' }
    ]
  },
  {
    key: 'moreThan20k',
    label: '>20k',
    type: 'grouped',
    subColumns: [
      { key: 'target', label: 'Target' },
      { key: 'floor', label: 'Floor' }
    ]
  },
  { key: 'effDate', label: 'Eff. Date', type: 'simple' },
  { key: 'expiry', label: 'Expiry', type: 'simple' }
];

/* ─────────────────────────── Default JSON Config ─────────────────────────── */

const DEFAULT_INPUT = JSON.stringify(
  {
    id: 'cvpPricingTable',
    name: 'CVP Pricing Matrix',
    className: 'table table-bordered align-middle',
    showIconColumn: false,
    columns: DEFAULT_COLUMNS,
    rows: [
      {
        id: 1,
        cvp: 'STF1',
        lessThan5k: { target: 2.50, floor: 2.10 },
        from5kTo10k: { target: 2.55, floor: 2.15 },
        from10kTo15k: { target: 2.60, floor: 2.20 },
        from15kTo20k: { target: 2.65, floor: 2.25 },
        moreThan20k: { target: 2.70, floor: 2.30 },
        effDate: '2025-06-01',
        expiry: null
      },
      {
        id: 2,
        cvp: 'STF2',
        lessThan5k: { target: 2.45, floor: 2.05 },
        from5kTo10k: { target: 2.50, floor: 2.10 },
        from10kTo15k: { target: 2.55, floor: 2.15 },
        from15kTo20k: { target: 2.60, floor: 2.20 },
        moreThan20k: { target: 2.65, floor: 2.25 },
        effDate: '2025-06-05',
        expiry: null
      },
      {
        id: 3,
        cvp: 'STF9',
        lessThan5k: { target: 2.52, floor: 2.12 },
        from5kTo10k: { target: 2.57, floor: 2.17 },
        from10kTo15k: { target: 2.62, floor: 2.22 },
        from15kTo20k: { target: 2.67, floor: 2.27 },
        moreThan20k: { target: 2.72, floor: 2.32 },
        effDate: '2025-06-09',
        expiry: null
      }
    ]
  },
  null,
  2
);

@Component({
  selector: 'demo-table-grouped',
  standalone: true,
  imports: [CommonModule, FormsModule, TdTable],
  templateUrl: './demo-table-grouped.html',
  styleUrls: ['./demo-table-grouped.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoTableGrouped {
  readonly tagSnippet = `<td-table [table]="tableModel" (output)="handleOutput($event)"></td-table>`;

  inputJson = DEFAULT_INPUT;
  parseError = '';
  outputJson = '// Click a sub-header to emit { type: \'column\', name, subColumn, dir }.\n// Click a row to emit { type: \'row\', id, row }.';
  model: TableObject;

  constructor(private cdr: ChangeDetectorRef) {
    this.model = this.parseModel(this.inputJson);
  }

  private parseModel(json: string): TableObject {
    try {
      this.parseError = '';
      const raw = JSON.parse(json);
      return new TableObject(raw);
    } catch (e: any) {
      this.parseError = e.message || String(e);
      return new TableObject({
        name: 'Invalid JSON',
        className: 'table table-bordered',
        columns: [],
        rows: [],
      });
    }
  }

  onJsonChange(value: string): void {
    this.inputJson = value;
    this.model = this.parseModel(value);
    this.cdr.markForCheck();
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.outputJson = JSON.stringify(payload, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(): void {
    this.inputJson = DEFAULT_INPUT;
    this.parseError = '';
    this.outputJson = '// Click a sub-header to emit { type: \'column\', name, subColumn, dir }.\n// Click a row to emit { type: \'row\', id, row }.';
    this.model = this.parseModel(this.inputJson);
    this.cdr.markForCheck();
  }

  clearOutput(): void {
    this.outputJson = '// cleared';
    this.cdr.markForCheck();
  }
}