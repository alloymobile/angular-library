import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationObject } from './td-pagination.model';
import { OutputObject, generateId } from '../../share';

interface PageWindowItem {
  type: 'page' | 'ellipsis';
  index?: number;
  key?: string;
}

@Component({
  selector: 'td-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-pagination.html',
  styleUrls: ['./td-pagination.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdPagination implements OnChanges {
  @Input({ required: true }) pagination!: PaginationObject;
  @Output() output = new EventEmitter<OutputObject>();

  pageWindow: PageWindowItem[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination'] && this.pagination) {
      this.pageWindow = this.buildPageWindow(this.pagination.pageNumber, this.pagination.totalPages);
    }
  }

  /**
   * Build page window with ellipses for large page counts
   */
  private buildPageWindow(current: number, total: number): PageWindowItem[] {
    const items: PageWindowItem[] = [];

    if (total <= 7) {
      for (let i = 0; i < total; i++) {
        items.push({ type: 'page', index: i });
      }
      return items;
    }

    const addedIndices = new Set<number>();
    const push = (i: number) => {
      if (i >= 0 && i < total && !addedIndices.has(i)) {
        items.push({ type: 'page', index: i });
        addedIndices.add(i);
      }
    };

    // Always include first and last
    push(0);
    push(total - 1);

    // Include current and neighbors
    const left = Math.max(current - 1, 1);
    const right = Math.min(current + 1, total - 2);

    for (let i = left; i <= right; i++) {
      push(i);
    }

    // Sort by index
    items.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

    // Insert ellipses where needed
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

  /**
   * Clamp target page number to valid range
   */
  private clampTarget(target: number): number {
    let t = typeof target === 'number' ? target : 0;
    if (t < 0) t = 0;
    if (this.pagination.totalPages > 0 && t > this.pagination.totalPages - 1) {
      t = this.pagination.totalPages - 1;
    }
    return t;
  }

  /**
   * Emit page change event
   */
  emitPage(target: number): void {
    const t = this.clampTarget(target);

    const out = OutputObject.ok({
      id: this.pagination.id,
      type: 'pagination',
      action: 'Page',
      data: {
        pageNumber: t,
      },
    });

    this.output.emit(out);
  }

  /**
   * Handle navigation button click
   */
  onNavigate(target: number, disabled: boolean): void {
    if (!disabled) {
      this.emitPage(target);
    }
  }

  /**
   * Get item CSS classes
   */
  getItemClasses(disabled: boolean, active: boolean): string {
    const classes = [this.pagination.itemClassName];
    if (disabled) classes.push(this.pagination.disabledClassName);
    if (active) classes.push(this.pagination.activeClassName);
    return classes.filter(Boolean).join(' ');
  }

  /**
   * Track by function for ngFor
   */
  trackByItem(index: number, item: PageWindowItem): string {
    return item.type === 'ellipsis' ? (item.key ?? `ellipsis-${index}`) : `page-${item.index}`;
  }
}
