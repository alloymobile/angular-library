// src/demo/pages/tdpagination/tdpagination.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdPaginationComponent } from '../../../../lib/components/tissue/td-pagination/td-pagination';
import { PaginationObject } from '../../../../lib/components/tissue/td-pagination/td-pagination.model';

const DEFAULT_RAW: any = {
    id: "vendorPagignation",
    name: "Vendors",
    className: "d-flex justify-content-end align-items-center mt-3",
    listClassName: "pagination justify-content-end mb-0",
    itemClassName: "page-item",
    activeClassName: "active",
    disabledClassName: "disabled",

    totalPages: 10,
    totalElements: 480,
    last: false,
    numberOfElements: 50,
    size: 50,
    number: 0,
    first: true,
    empty: false
  };
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-pagination',
  standalone: true,
  imports: [CommonModule, TdPaginationComponent],
  templateUrl: './td-pagination-demo.html',
  styleUrls: ['./td-pagination-demo.css']
})
export class TdPaginationDemoComponent {
  title = 'TdPagination';
  usageSnippet = `<td-pagination [pagination]="model" (output)="handleOutput($event)"></td-pagination>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): PaginationObject {
    try {
      return new PaginationObject(this.parsed);
    } catch (e: any) {
      return new PaginationObject({ page: 1, pageSize: 10, total: 0 });
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
