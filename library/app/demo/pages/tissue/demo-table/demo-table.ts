import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdTable } from '../../../../lib/tissue/td-table/td-table';
import { TableObject } from '../../../../lib/tissue/td-table/td-table.model';
import { OutputObject } from '../../../../lib/share';

/* ─────────────────────────── Default JSON Config ─────────────────────────── */

const DEFAULT_INPUT = JSON.stringify(
  {
    id: 'userTable01',
    name: 'Users',
    className: 'table table-hover align-middle',
    rows: [
      { id: 1, name: 'Ada Lovelace', role: 'Admin', joined: '2023-12-01' },
      { id: 2, name: 'Linus Torvalds', role: 'User', joined: '2024-04-15' },
      { id: 3, name: 'Margaret Hamilton', role: 'Owner', joined: '2022-07-22' },
    ],
  },
  null,
  2
);

@Component({
  selector: 'demo-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TdTable],
  templateUrl: './demo-table.html',
  styleUrls: ['./demo-table.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoTable {
  readonly tagSnippet = `<td-table [table]="tableModel" (output)="handleOutput($event)"></td-table>`;

  inputJson = DEFAULT_INPUT;
  parseError = '';
  outputJson = '// Click a header to emit { type: \'column\', name, dir }.\n// Click a row to emit { type: \'row\', id }.';
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
        className: 'table table-striped',
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
    this.outputJson = '// Click a header to emit { type: \'column\', name, dir }.\n// Click a row to emit { type: \'row\', id }.';
    this.model = this.parseModel(this.inputJson);
    this.cdr.markForCheck();
  }

  clearOutput(): void {
    this.outputJson = '// cleared';
    this.cdr.markForCheck();
  }
}
