import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RateApiService } from '../../../core/services/rate-api.service';
import { RateMatrixComponent, MatrixTier, MatrixRow } from '../../../shared/components/rate-matrix/rate-matrix.component';
import { buildViewMatrix } from '../../../shared/components/matrix-data-builder';

@Component({
  selector: 'plra-viewer-iloc', standalone: true,
  imports: [CommonModule, FormsModule, RateMatrixComponent],
  template: `
    <header class="mb-3">
      <h2 class="page-heading"><i class="fa-solid fa-landmark text-td-green me-2"></i>ILOC — View Rates</h2>
      <p class="page-subtitle">Active investment line of credit rates</p>
    </header>
    <div class="d-flex align-items-center gap-2 mb-3">
      <input class="form-control form-control-sm" style="max-width:300px" placeholder="Search subcategory..." [(ngModel)]="search" (ngModelChange)="onSearch()" />
    </div>
    <plra-rate-matrix mode="view" productType="ILOC" [tiers]="tiers()" [rows]="rows()" [searchTerm]="search" />
  `,
  styles: [`.page-heading{font-size:20px;font-weight:700;display:flex;align-items:center;gap:6px;margin:0}.page-subtitle{font-size:13px;color:var(--color-muted);margin:4px 0 0}`]
})
export class ViewerIlocComponent implements OnInit {
  private api = inject(RateApiService);
  tiers = signal<MatrixTier[]>([]);
  rows = signal<MatrixRow[]>([]);
  search = '';

  ngOnInit(): void {
    this.api.getProducts({type:'ILOC',size:1}).subscribe({next: res => {
      const p = res.content.find(x => x.type === 'ILOC');
      if (!p) return;
      this.api.getAmountTiers(p.name, {unpaged:true}).subscribe({next: tierRes => {
        this.api.getIlocActive({size:100}).subscribe({next: rateRes => {
          const { matrixTiers, matrixRows } = buildViewMatrix(tierRes.content, rateRes.content, 'ILOC');
          this.tiers.set(matrixTiers);
          this.rows.set(matrixRows);
        }});
      }});
    }});
  }
  onSearch(): void { /* searchTerm binding triggers re-filter in component */ }
}
