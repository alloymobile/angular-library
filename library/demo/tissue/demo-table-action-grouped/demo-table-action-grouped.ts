import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdTableAction } from '../../../lib/tissue/td-table-action/td-table-action';
import {
  TdTableActionModel,
  ColumnConfig,
  TdTableRow
} from '../../../lib/tissue/td-table-action/td-table-action.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Column Configuration ─────────────────────────── */

const DEFAULT_COLUMNS: ColumnConfig[] = [
  {
    key: 'cvp',
    label: 'CVP',
    type: 'simple',
    cellType: 'text',
    width: '80px'
  },
  {
    key: 'lessThan5k',
    label: '<5k',
    type: 'grouped',
    subColumns: [
      { key: 'current', label: 'Current', cellType: 'icon-text', width: '90px' },
      { key: 'new', label: 'New', cellType: 'input', width: '90px' },
      { key: 'discretion', label: 'Discretion', cellType: 'input', width: '100px' }
    ]
  },
  {
    key: 'moreThan20k',
    label: '>20k',
    type: 'grouped',
    subColumns: [
      { key: 'current', label: 'Current', cellType: 'icon-text', width: '90px' },
      { key: 'new', label: 'New', cellType: 'input', width: '90px' },
      { key: 'discretion', label: 'Discretion', cellType: 'input', width: '100px' }
    ]
  },
  {
    key: 'effDate',
    label: 'Eff. Date',
    type: 'simple',
    cellType: 'text',
    width: '100px'
  },
  {
    key: 'expiry',
    label: 'Expiry',
    type: 'simple',
    cellType: 'text',
    width: '100px'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'simple',
    cellType: 'status',
    width: '100px'
  }
];

/* ─────────────────────────── Sample Row Data ─────────────────────────── */

const DEFAULT_ROWS: TdTableRow[] = [
  {
    id: 1,
    cvp: 'STF1',
    lessThan5k: {
      current: { icon: { iconClass: 'fa-solid fa-lock' }, value: 2.50 },
      new: { type: 'number', value: null, placeholder: '—', step: 0.01 },
      discretion: { type: 'number', value: null, placeholder: '—', step: 0.01 }
    },
    moreThan20k: {
      current: { icon: { iconClass: 'fa-solid fa-lock' }, value: 2.70 },
      new: { type: 'number', value: null, placeholder: '—', step: 0.01 },
      discretion: { type: 'number', value: null, placeholder: '—', step: 0.01 }
    },
    effDate: '2025-06-01',
    expiry: null,
    status: { value: 'Active', variant: 'success' }
  },
  {
    id: 2,
    cvp: 'STF2',
    lessThan5k: {
      current: { icon: { iconClass: 'fa-solid fa-lock' }, value: 2.45 },
      new: { type: 'number', value: null, placeholder: '—', step: 0.01 },
      discretion: { type: 'number', value: null, placeholder: '—', step: 0.01 }
    },
    moreThan20k: {
      current: { icon: { iconClass: 'fa-solid fa-lock' }, value: 2.65 },
      new: { type: 'number', value: null, placeholder: '—', step: 0.01 },
      discretion: { type: 'number', value: null, placeholder: '—', step: 0.01 }
    },
    effDate: '2025-06-05',
    expiry: null,
    status: { value: 'Active', variant: 'success' }
  },
  {
    id: 3,
    cvp: 'STF9',
    lessThan5k: {
      current: { icon: { iconClass: 'fa-solid fa-lock' }, value: 2.52 },
      new: { type: 'number', value: null, placeholder: '—', step: 0.01 },
      discretion: { type: 'number', value: null, placeholder: '—', step: 0.01 }
    },
    moreThan20k: {
      current: { icon: { iconClass: 'fa-solid fa-lock' }, value: 2.72 },
      new: { type: 'number', value: null, placeholder: '—', step: 0.01 },
      discretion: { type: 'number', value: null, placeholder: '—', step: 0.01 }
    },
    effDate: '2025-06-09',
    expiry: '2025-07-01',
    status: { value: 'Expiring', variant: 'warning' }
  },
  {
    id: 4,
    cvp: 'PRM2',
    lessThan5k: {
      current: { icon: { iconClass: 'fa-solid fa-lock' }, value: 2.85 },
      new: { type: 'number', value: null, placeholder: '—', step: 0.01 },
      discretion: { type: 'number', value: null, placeholder: '—', step: 0.01 }
    },
    moreThan20k: {
      current: { icon: { iconClass: 'fa-solid fa-lock' }, value: 3.05 },
      new: { type: 'number', value: null, placeholder: '—', step: 0.01 },
      discretion: { type: 'number', value: null, placeholder: '—', step: 0.01 }
    },
    effDate: '2025-06-10',
    expiry: null,
    status: { value: 'Active', variant: 'success' }
  }
];

/* ─────────────────────────── Default JSON Config ─────────────────────────── */

const DEFAULT_INPUT = JSON.stringify(
  {
    id: 'cvpPricingEditor',
    name: 'CVP Pricing Editor',
    className: 'table table-bordered align-middle',
    showCheckboxColumn: true,
    showIconColumn: false,
    actionsHeader: 'Actions',
    columns: DEFAULT_COLUMNS,
    rows: DEFAULT_ROWS,
    actions: {
      className: 'btn-group btn-group-sm',
      buttons: [
        {
          icon: { iconClass: 'fa-solid fa-arrows-left-right' },
          name: 'compare',
          className: 'btn btn-outline-secondary btn-sm',
          title: 'Compare'
        },
        {
          icon: { iconClass: 'fa-solid fa-rotate' },
          name: 'refresh',
          className: 'btn btn-outline-secondary btn-sm',
          title: 'Refresh'
        },
        {
          icon: { iconClass: 'fa-solid fa-trash' },
          name: 'delete',
          className: 'btn btn-outline-secondary btn-sm',
          title: 'Delete'
        }
      ]
    }
  },
  null,
  2
);

/* ─────────────────────────── Component ─────────────────────────── */

@Component({
  selector: 'demo-table-action-grouped',
  standalone: true,
  imports: [CommonModule, FormsModule, TdTableAction],
  templateUrl: './demo-table-action-grouped.html',
  styleUrls: ['./demo-table-action-grouped.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoTableActionGrouped {
  readonly tagSnippet = `<td-table-action [tableAction]="model" (output)="handleOutput($event)"></td-table-action>`;

  inputJson = DEFAULT_INPUT;
  parseError = '';
  outputJson = '// Interact with the table to see output events:\n// - Select rows (checkbox)\n// - Sort columns (header click)\n// - Edit inputs (New, Discretion)\n// - Click action buttons';
  model: TdTableActionModel;

  constructor(private cdr: ChangeDetectorRef) {
    this.model = this.parseModel(this.inputJson);
  }

  private parseModel(json: string): TdTableActionModel {
    try {
      this.parseError = '';
      const raw = JSON.parse(json);
      return new TdTableActionModel(raw);
    } catch (e: any) {
      this.parseError = e.message || String(e);
      return new TdTableActionModel({
        name: 'Invalid JSON',
        className: 'table table-bordered',
        columns: [],
        rows: []
      });
    }
  }

  onJsonChange(value: string): void {
    this.inputJson = value;
    this.model = this.parseModel(value);
    this.cdr.markForCheck();
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function'
      ? (out as any).toJSON()
      : out;
    this.outputJson = JSON.stringify(payload, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(): void {
    this.inputJson = DEFAULT_INPUT;
    this.parseError = '';
    this.outputJson = '// Interact with the table to see output events:\n// - Select rows (checkbox)\n// - Sort columns (header click)\n// - Edit inputs (New, Discretion)\n// - Click action buttons';
    this.model = this.parseModel(this.inputJson);
    this.cdr.markForCheck();
  }

  clearOutput(): void {
    this.outputJson = '// cleared';
    this.cdr.markForCheck();
  }
}