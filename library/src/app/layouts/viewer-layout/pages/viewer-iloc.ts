import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { AmountTierAdminView } from '../../../core/models/api.models';
import { RateMatrixComponent, MatrixTier, MatrixRow, PageChangeEvent } from '../../../shared/components/rate-matrix/rate-matrix';
import { RateFilterComponent, FilterState } from '../../../shared/components/rate-filter/rate-filter';
import { buildViewMatrix } from '../../../shared/components/matrix-data-builder';

@Component({
  selector: 'plra-viewer-iloc', standalone: true,
  imports: [CommonModule, RateMatrixComponent, RateFilterComponent],
  templateUrl: './viewer-iloc.html', styleUrls: ['./viewer-iloc.css']
})
export class ViewerIlocComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  tiers = signal<MatrixTier[]>([]);
  rows = signal<MatrixRow[]>([]);
  productName = '';
  searchTerm = '';
  visibleTierIds: number[] = [];
  currentPage = 0; pageSize = 20; totalElements = 0; totalPages = 0;
  private tierData: AmountTierAdminView[] = [];
  private filterParams: Record<string, any> = {};

  ngOnInit(): void {
    this.api.getProducts({ type: 'ILOC', size: 1 }).subscribe({ next: (res: any) => {
      const p = res.content.find((x: any) => x.type === 'ILOC');
      if (!p) return;
      this.productName = p.name;
      this.api.getAmountTiers(p.name, { unpaged: true }).subscribe({ next: (tierRes: any) => {
        this.tierData = tierRes.content;
        this.tiers.set(tierRes.content.map((t: any) => ({ id: t.id, name: t.name })));
        this.loadActive();
      }});
    }});
  }

  private loadActive(): void {
    const params: Record<string, any> = { page: this.currentPage, size: this.pageSize, ...this.filterParams };
    this.api.getIlocActive(params).subscribe({ next: (r: any) => {
      this.totalElements = r.totalElements ?? 0;
      this.totalPages = r.totalPages ?? 0;
      this.rows.set(buildViewMatrix(this.tierData, r.content, 'ILOC').matrixRows);
    }});
  }

  onFilter(f: FilterState): void {
    this.searchTerm = f.search;
    this.visibleTierIds = f.tierIds.map((id: string) => Number(id));
    this.filterParams = {};
    if (f.subCategoryIds.length > 0) this.filterParams['subCategoryIds'] = f.subCategoryIds.join(',');
    this.currentPage = 0;
    this.loadActive();
  }

  onPageChange(e: PageChangeEvent): void {
    this.currentPage = e.page;
    this.pageSize = e.size;
    this.loadActive();
  }
}
