import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { AmountTierAdminView } from '../../../core/models/api.models';
import { RateMatrixComponent, MatrixTier, MatrixRow, PageChangeEvent } from '../../../shared/components/rate-matrix/rate-matrix';
import { RateFilterComponent, FilterState } from '../../../shared/components/rate-filter/rate-filter';
import { buildViewMatrix } from '../../../shared/components/matrix-data-builder';
import { TdButtonIcon } from '../../../lib/cell/td-button-icon/td-button-icon';
import { TdButtonIconModel } from '../../../lib/cell/td-button-icon/td-button-icon.model';
import { TdIconModel } from '../../../lib/cell/td-icon/td-icon.model';
import { OutputObject } from '../../../lib/share/output-object';

type Tab = 'view' | 'review';

@Component({
  selector: 'plra-reviewer-uloc',
  standalone: true,
  imports: [CommonModule, FormsModule, RateMatrixComponent, RateFilterComponent, TdButtonIcon],
  templateUrl: './reviewer-uloc.html',
  styleUrls: ['./reviewer-uloc.css']
})
export class ReviewerUlocComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);

  tab = signal<Tab>('view');
  tiers = signal<MatrixTier[]>([]);
  viewRows = signal<MatrixRow[]>([]);
  filteredViewRows = signal<MatrixRow[]>([]);
  reviewRows = signal<MatrixRow[]>([]);
  filteredReviewRows = signal<MatrixRow[]>([]);
  reviewSearch = '';
  viewSearch = '';
  visibleTierIds: number[] = [];
  currentPage = 0; pageSize = 20; totalElements = 0; totalPages = 0;
  reviewPage = 0; reviewSize = 20; reviewTotal = 0; reviewPages = 0;
  private filterParams: Record<string, any> = {};
  allSelected = false;
  reviewing = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');
  productName = '';

  private tierData: AmountTierAdminView[] = [];

  ngOnInit(): void {
    this.api.getProducts({ type: 'ULOC', size: 1 }).subscribe({
      next: (res: any) => {
        const p = res.content.find((x: any) => x.type === 'ULOC');
        if (!p) return;
        this.productName = p.name;
        this.api.getAmountTiers(p.name, { unpaged: true }).subscribe({
          next: (tierRes: any) => {
            this.tierData = tierRes.content;
            this.tiers.set(tierRes.content.map((t: any) => ({ id: t.id, name: t.name })));
            this.loadActive();
          }
        });
      }
    });
  }

  switchTab(tab: Tab): void {
    this.tab.set(tab);
    this.message.set('');
    this.loadActive();
  }

  private loadActive(): void {
    this.api.getUlocActive({ page: this.currentPage, size: this.pageSize }).subscribe({
      next: (r: any) => {
        this.totalElements = r.totalElements ?? 0;
        this.totalPages = r.totalPages ?? 0;
        const m = buildViewMatrix(this.tierData, r.content, 'ULOC');
        this.viewRows.set(m.matrixRows);
        this.filteredViewRows.set(m.matrixRows);
      }
    });
    // Load review tab data separately (paginated)
    this.api.getUlocActive({ page: this.reviewPage, size: this.reviewSize }).subscribe({
      next: (r: any) => {
        this.reviewTotal = r.totalElements ?? 0;
        this.reviewPages = r.totalPages ?? 0;
        const m = buildViewMatrix(this.tierData, r.content, 'ULOC');
        this.reviewRows.set(m.matrixRows.map((row: any) => ({ ...row, selected: false })));
        this.applyReviewFilter();
      }
    });
  }

  applyReviewFilter(): void {
    if (!this.reviewSearch) { this.filteredReviewRows.set(this.reviewRows()); return; }
    const term = this.reviewSearch.toLowerCase();
    this.filteredReviewRows.set(this.reviewRows().filter((r: any) => r.name.toLowerCase().includes(term)));
  }

  toggleAll(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    this.filteredReviewRows().forEach((r: any) => r.selected = checked);
    this.allSelected = checked;
  }

  submitReview(): void {
    const selected = this.reviewRows().filter((r: any) => r.selected);
    if (selected.length === 0) { this.showMsg(this.t.get('rates.select_rows') as string, 'info'); return; }

    const activeIds: number[] = [];
    for (const row of selected) {
      for (const cell of row.cells) {
        if (cell.activeId !== null && cell.activeId !== undefined && cell.activeId > 0) {
          activeIds.push(cell.activeId);
        }
      }
    }
    if (activeIds.length === 0) { this.showMsg('No active rates found for selected rows.', 'info'); return; }

    this.reviewing.set(true);
    let done = 0, errors = 0;
    for (const id of activeIds) {
      this.api.reviewUlocActive(id, 'Reviewed').subscribe({
        next: () => { done++; if (done + errors >= activeIds.length) this.onComplete(done, errors, selected.length); },
        error: () => { errors++; if (done + errors >= activeIds.length) this.onComplete(done, errors, selected.length); }
      });
    }
  }

  private onComplete(done: number, errors: number, rowCount: number): void {
    this.reviewing.set(false);
    this.reviewRows().forEach((r: any) => r.selected = false);
    this.allSelected = false;
    this.showMsg(`Reviewed ${rowCount} row(s) (${done} rate(s)).${errors > 0 ? ` ${errors} failed.` : ''}`, errors > 0 ? 'error' : 'success');
  }

  onViewFilter(f: FilterState): void {
    this.viewSearch = f.search;
    this.visibleTierIds = f.tierIds.map((id: string) => Number(id));
    const params: Record<string, any> = {};
    if (f.subCategoryIds.length > 0) params['subCategoryIds'] = f.subCategoryIds.join(',');
    this.filterParams = params;
    this.currentPage = 0;
    this.loadView();
  }

  loadView(): void {
    const params: Record<string, any> = { page: this.currentPage, size: this.pageSize, ...this.filterParams };
    this.api.getUlocActive(params).subscribe({
      next: (r: any) => {
        this.totalElements = r.totalElements ?? 0;
        this.totalPages = r.totalPages ?? 0;
        const m = buildViewMatrix(this.tierData, r.content, 'ULOC');
        this.viewRows.set(m.matrixRows);
        this.filteredViewRows.set(m.matrixRows);
      }
    });
  }

  onPageChange(e: PageChangeEvent): void {
    this.currentPage = e.page;
    this.pageSize = e.size;
    this.loadView();
  }

  onReviewPageChange(e: PageChangeEvent): void {
    this.reviewPage = e.page;
    this.reviewSize = e.size;
    const params: Record<string, any> = { page: this.reviewPage, size: this.reviewSize };
    this.api.getUlocActive(params).subscribe({
      next: (r: any) => {
        this.reviewTotal = r.totalElements ?? 0;
        this.reviewPages = r.totalPages ?? 0;
        const m = buildViewMatrix(this.tierData, r.content, 'ULOC');
        this.reviewRows.set(m.matrixRows.map((row: any) => ({ ...row, selected: false })));
        this.applyReviewFilter();
      }
    });
  }

  onReviewFilter(f: FilterState): void {
    this.reviewSearch = f.search;
    this.visibleTierIds = f.tierIds.map((id: string) => Number(id));
  }

  btn(id: string, icon: string, name: string, cls: string = 'btn btn-sm btn-outline-secondary', isActive: boolean = false, disabled: boolean = false): TdButtonIconModel {
    return new TdButtonIconModel({ id, name, className: cls, isActive, active: 'active', disabled, icon: new TdIconModel({ iconClass: icon }) });
  }

  private showMsg(msg: string, type: 'success' | 'error' | 'info'): void { this.message.set(msg); this.messageType.set(type); }
}
