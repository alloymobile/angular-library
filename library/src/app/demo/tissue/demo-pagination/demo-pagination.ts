import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdPagination } from '../../../lib/tissue/td-pagination/td-pagination';
import { TdPaginationModel } from '../../../lib/tissue/td-pagination/td-pagination.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Config ─────────────────────────── */

const DEFAULT_PAGINATION_JSON = JSON.stringify(
  {
    id: 'vendorPagination',
    name: 'Vendors',
    className: 'd-flex justify-content-end align-items-center mt-3',
    listClassName: 'pagination justify-content-end mb-0',
    itemClassName: 'page-item',
    activeClassName: 'active',
    disabledClassName: 'disabled',

    totalPages: 10,
    totalElements: 480,
    last: false,
    numberOfElements: 50,
    size: 50,
    pageNumber: 0,
    first: true,
    empty: false,
  },
  null,
  2
);

@Component({
  selector: 'demo-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule, TdPagination],
  templateUrl: './demo-pagination.html',
  styleUrls: ['./demo-pagination.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPagination {
  readonly tagSnippet = `<td-pagination [pagination]="paginationModel" (output)="handleOutput($event)"></td-pagination>`;

  paginationJson = DEFAULT_PAGINATION_JSON;
  parseError = '';
  outputJson = '// Click First / Previous / numbered pages / Next / Last to see OutputObject here…';
  model: TdPaginationModel;

  constructor(private cdr: ChangeDetectorRef) {
    this.model = this.parseModel(this.paginationJson);
  }

  private parseModel(json: string): TdPaginationModel {
    try {
      this.parseError = '';
      const raw = JSON.parse(json || '{}');
      return new TdPaginationModel(raw);
    } catch (e: any) {
      this.parseError = e.message || String(e);
      return new TdPaginationModel({
        name: 'Fallback',
        totalPages: 1,
        totalElements: 0,
        last: true,
        numberOfElements: 0,
        size: 50,
        pageNumber: 0,
        first: true,
        empty: true,
      });
    }
  }

  onJsonChange(value: string): void {
    this.paginationJson = value;
    this.model = this.parseModel(value);
    this.cdr.markForCheck();
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.outputJson = JSON.stringify(payload, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(): void {
    this.paginationJson = DEFAULT_PAGINATION_JSON;
    this.parseError = '';
    this.outputJson = '// Click First / Previous / numbered pages / Next / Last to see OutputObject here…';
    this.model = this.parseModel(this.paginationJson);
    this.cdr.markForCheck();
  }

  formatJson(): void {
    try {
      const parsed = JSON.parse(this.paginationJson);
      this.paginationJson = JSON.stringify(parsed, null, 2);
      this.cdr.markForCheck();
    } catch {
      // ignore; parse error already shown
    }
  }

  clearOutput(): void {
    this.outputJson = '// cleared';
    this.cdr.markForCheck();
  }
}
