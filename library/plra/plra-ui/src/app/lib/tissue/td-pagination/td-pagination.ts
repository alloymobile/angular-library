// td-pagination/td-pagination.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdPaginationModel } from './td-pagination.model';
import { OutputObject } from '../../share/output-object';

import { TdButtonIcon } from '../../cell/td-button-icon/td-button-icon';

interface PageWindowItem {
  type: 'page' | 'ellipsis';
  index?: number;
  key?: string;
}

@Component({
  selector: 'td-pagination',
  standalone: true,
  imports: [CommonModule, TdButtonIcon],
  templateUrl: './td-pagination.html',
  styleUrl: './td-pagination.css',
})
export class TdPagination implements OnChanges {
  @Input({ required: true }) pagination!: TdPaginationModel;
  @Output() output = new EventEmitter<OutputObject>();

  pageWindow: PageWindowItem[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination']) {
      this.ensurePagination();

      this.applyDisabledState(); // ✅ NEW (sets buttonIconModel.disabled)

      this.pageWindow = this.buildPageWindow(
        this.pagination.pageNumber,
        this.pagination.totalPages,
        this.pagination.windowSize
      );
    }
  }

  private ensurePagination(): void {
    if (!this.pagination || !(this.pagination instanceof TdPaginationModel)) {
      throw new Error('TdPagination requires `pagination` (TdPaginationModel instance).');
    }
  }

  private applyDisabledState(): void {
    const total = this.pagination.totalPages;
    const pn = this.pagination.pageNumber;

    const isFirst = total <= 0 ? true : pn <= 0;
    const isLast = total <= 0 ? true : pn >= total - 1;

    // ✅ set disabled on the embedded models
    this.pagination.firstBtn.disabled = isFirst;
    this.pagination.prevBtn.disabled = isFirst;
    this.pagination.nextBtn.disabled = isLast;
    this.pagination.lastBtn.disabled = isLast;
  }

  private buildPageWindow(current: number, total: number, windowSize: number): PageWindowItem[] {
    const items: PageWindowItem[] = [];

    if (total <= 0) return items;

    if (total <= windowSize) {
      for (let i = 0; i < total; i++) items.push({ type: 'page', index: i });
      return items;
    }

    const added = new Set<number>();
    const push = (i: number) => {
      if (i >= 0 && i < total && !added.has(i)) {
        items.push({ type: 'page', index: i });
        added.add(i);
      }
    };

    push(0);
    push(total - 1);

    const neighbor = 1;
    const left = Math.max(current - neighbor, 1);
    const right = Math.min(current + neighbor, total - 2);

    for (let i = left; i <= right; i++) push(i);

    items.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

    const final: PageWindowItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const prev = items[i - 1];
      const curr = items[i];

      if (i > 0 && (curr.index ?? 0) - (prev.index ?? 0) > 1) {
        final.push({ type: 'ellipsis', key: `el-${prev.index}-${curr.index}` });
      }
      final.push(curr);
    }

    return final;
  }

  private clampTarget(target: number): number {
    let t = typeof target === 'number' ? target : 0;
    if (t < 0) t = 0;
    if (this.pagination.totalPages > 0 && t > this.pagination.totalPages - 1) {
      t = this.pagination.totalPages - 1;
    }
    return t;
  }

  private emitPage(target: number): void {
    const t = this.clampTarget(target);

    this.output.emit(
      new OutputObject({
        id: this.pagination.id as string,
        type: 'pagination',
        action: 'Page',
        error: false,
        errorMessage: [],
        data: { pageNumber: t },
      })
    );
  }

  onNavigate(target: number, disabled: boolean): void {
    if (!disabled) this.emitPage(target);
  }

  // use pagination.first/last (or compute from pageNumber/totalPages if you prefer)
  onFirstClick(): void { this.onNavigate(0, this.pagination.pageNumber <= 0); }
  onPrevClick(): void { this.onNavigate(this.pagination.pageNumber - 1, this.pagination.pageNumber <= 0); }
  onNextClick(): void { this.onNavigate(this.pagination.pageNumber + 1, this.pagination.totalPages <= 0 ? true : this.pagination.pageNumber >= this.pagination.totalPages - 1); }
  onLastClick(): void { this.onNavigate(this.pagination.totalPages - 1, this.pagination.totalPages <= 0 ? true : this.pagination.pageNumber >= this.pagination.totalPages - 1); }

  getItemClasses(disabled: boolean, active: boolean): string {
    const classes = [this.pagination.itemClassName];
    if (disabled) classes.push(this.pagination.disabledClassName);
    if (active) classes.push(this.pagination.activeClassName);
    return classes.filter(Boolean).join(' ');
  }

  trackByItem(index: number, item: PageWindowItem): string {
    return item.type === 'ellipsis' ? (item.key ?? `ellipsis-${index}`) : `page-${item.index}`;
  }
}
