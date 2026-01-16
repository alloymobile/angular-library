// src/demo/pages/tdtable/tdtable.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdTableComponent } from '../../../../lib/components/tissue/td-table/td-table';
import { TableObject } from '../../../../lib/components/tissue/td-table/td-table.model';

const DEFAULT_RAW: any = {
    // `id` is optional; TableObject will auto-generate with generateId("table")
    id: "userTable01",
    name: "Users",
    className: "table table-hover align-middle",

    // icon and sort are optional:
    //   icon -> <td> leading icon in each row (defaults to "fa-solid fa-user")
    //   sort -> header sort indicator icon (defaults to "fa-solid fa-arrow-down")

    rows: [
      { id: 1, name: "Ada Lovelace", role: "Admin",    joined: "2023-12-01" },
      { id: 2, name: "Linus Torvalds", role: "User",   joined: "2024-04-15" },
      { id: 3, name: "Margaret Hamilton", role: "Owner", joined: "2022-07-22" }
    ]
  };
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-table',
  standalone: true,
  imports: [CommonModule, TdTableComponent],
  templateUrl: './td-table-demo.html',
  styleUrls: ['./td-table-demo.css']
})
export class TdTableDemoComponent {
  title = 'TdTable';
  usageSnippet = `<td-table [table]="model" (output)="handleOutput($event)"></td-table>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): TableObject {
    try {
      return new TableObject(this.parsed);
    } catch (e: any) {
      return new TableObject({ name: 'Invalid JSON', className: 'table table-striped', rows: [] });
    }
  }

  onInputChange(val: string): void {
    this.inputJson = val;
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed = obj;
      this.parseError = '';
    } catch (e: any) {
      this.parseError = String(e?.message || e || 'Invalid JSON.');
    }
  }

  onReset(): void {
    this.inputJson = DEFAULT_JSON;
    this.parsed = DEFAULT_RAW;
    this.parseError = '';
    this.outputJson = '// Interact with the component to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parsed = obj;
      this.parseError = '';
    } catch {
      // ignore
    }
  }

  onClearOutput(): void {
    this.outputJson = '// cleared';
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }

}

function to_pascal(s: string): string {
  return s.split('-').map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '').join('');
}
