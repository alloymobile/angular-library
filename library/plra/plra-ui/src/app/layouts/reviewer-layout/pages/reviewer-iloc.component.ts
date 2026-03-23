import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RateApiService } from '../../../core/services/rate-api.service';
import { RateMatrixComponent, MatrixTier, MatrixRow } from '../../../shared/components/rate-matrix/rate-matrix.component';
import { buildViewMatrix } from '../../../shared/components/matrix-data-builder';

@Component({
  selector: 'plra-reviewer-iloc', standalone: true,
  imports: [CommonModule, FormsModule, RateMatrixComponent],
  template: `
    <header class="mb-3">
      <h2 class="page-heading"><i class="fa-solid fa-landmark text-td-green me-2"></i>ILOC — Review</h2>
    </header>
    <ul class="nav td-tabs mb-3">
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='view'" (click)="tab.set('view')"><i class="fa-regular fa-eye me-1"></i>View Rates</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='review'" (click)="tab.set('review')"><i class="fa-solid fa-clipboard-check me-1"></i>Review</button></li>
    </ul>
    @if (tab() === 'view') {
      <input class="form-control form-control-sm mb-3" style="max-width:300px" placeholder="Search subcategory..." [(ngModel)]="search" />
      <plra-rate-matrix mode="view" productType="ILOC" [tiers]="tiers()" [rows]="activeRows()" [searchTerm]="search" />
    }
    @if (tab() === 'review') {
      <p class="text-muted mb-2" style="font-size:13px"><i class="fa-regular fa-clock me-1"></i>Pending submissions awaiting review</p>
      <plra-rate-matrix mode="view" productType="ILOC" [tiers]="tiers()" [rows]="pendingRows()" />
    }
  `,
  styles: [`.page-heading{font-size:20px;font-weight:700;display:flex;align-items:center;gap:6px;margin:0}.td-tabs{border-bottom:2px solid var(--border-color,#e5e7eb);gap:0}.td-tabs .nav-link{border:none;background:none;padding:10px 18px;font-size:14px;font-weight:600;color:var(--color-muted);border-bottom:2px solid transparent;margin-bottom:-2px;cursor:pointer}.td-tabs .nav-link.active{color:var(--td-green);border-bottom-color:var(--td-green)}`]
})
export class ReviewerIlocComponent implements OnInit {
  private api = inject(RateApiService);
  tab = signal<'view'|'review'>('view');
  tiers = signal<MatrixTier[]>([]);
  activeRows = signal<MatrixRow[]>([]);
  pendingRows = signal<MatrixRow[]>([]);
  search = '';

  ngOnInit(): void {
    this.api.getProducts({type:'ILOC',size:1}).subscribe({next: res => {
      const p = res.content.find(x => x.type === 'ILOC');
      if (!p) return;
      this.api.getAmountTiers(p.name, {unpaged:true}).subscribe({next: tierRes => {
        const t = tierRes.content;
        this.api.getIlocActive({size:100}).subscribe({next: r => {
          const m = buildViewMatrix(t, r.content, 'ILOC');
          this.tiers.set(m.matrixTiers);
          this.activeRows.set(m.matrixRows);
        }});
        this.api.getIlocDrafts({status:'PENDING',size:100}).subscribe({next: r => {
          const m = buildViewMatrix(t, r.content, 'ILOC');
          this.pendingRows.set(m.matrixRows);
        }});
      }});
    }});
  }
}
