import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { ProductAdminView } from '../../../core/models/api.models';

@Component({
  selector: 'plra-super-admin-dashboard', standalone: true, imports: [CommonModule, RouterModule, KpiCardComponent],
  template: `
    <header class="mb-4">
      <h1 style="font-size:22px;font-weight:700;display:flex;align-items:center;gap:10px;margin:0;">
        <i class="fa-solid fa-crown" style="color:#7c3aed"></i> System Administration
      </h1>
      <p class="text-muted" style="font-size:14px;margin:4px 0 0;">Master data, rate management, and audit overview</p>
    </header>
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Products" [value]="prodCount()" icon="fa-solid fa-boxes-stacked" color="green" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Categories" [value]="catCount()" icon="fa-solid fa-tags" color="blue" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Amount Tiers" [value]="tierCount()" icon="fa-solid fa-layer-group" color="purple" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Prime Rate" value="6.95%" icon="fa-solid fa-chart-line" color="amber" /></div>
    </div>

    <h5 class="fw-bold mb-3" style="font-size:16px;">Master Data</h5>
    <div class="d-flex flex-wrap gap-2 mb-4">
      <a routerLink="../uloc-settings" class="qc"><i class="fa-solid fa-credit-card"></i> ULOC Settings</a>
      <a routerLink="../iloc-settings" class="qc"><i class="fa-solid fa-landmark"></i> ILOC Settings</a>
      <a routerLink="../cvp-codes" class="qc"><i class="fa-solid fa-tags"></i> CVP Codes</a>
    </div>

    <h5 class="fw-bold mb-3" style="font-size:16px;">Rate Management</h5>
    <div class="d-flex flex-wrap gap-2 mb-4">
      <a routerLink="../uloc-rates" class="qc"><i class="fa-solid fa-table-cells"></i> ULOC Rates (CVP × Tier)</a>
      <a routerLink="../iloc-rates" class="qc"><i class="fa-solid fa-table-cells-large"></i> ILOC Rates (SubCat × Tier)</a>
      <a routerLink="../workflows" class="qc"><i class="fa-solid fa-code-branch"></i> Workflows</a>
    </div>
  `,
  styles: [`.qc{display:flex;align-items:center;gap:10px;padding:12px 20px;background:#fff;border:1px solid var(--border-color);border-radius:10px;text-decoration:none;color:var(--color-ink);font-size:14px;font-weight:600;transition:all .15s}.qc:hover{border-color:var(--td-green);color:var(--td-green);background:#f0fdf4}.qc i{font-size:16px;color:var(--color-muted)}.qc:hover i{color:var(--td-green)}`]
})
export class SuperAdminDashboardComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  prodCount = signal(0);
  catCount = signal(0);
  tierCount = signal(0);

  ngOnInit(): void {
    this.api.getProducts({unpaged: true}).subscribe({
      next: (res) => {
        const prods = res.content;
        this.prodCount.set(prods.length);
        let catTotal = 0;
        let tierTotal = 0;
        prods.forEach((p: ProductAdminView) => {
          this.api.getCategories(p.name, {unpaged: true}).subscribe({
            next: (r) => { catTotal += r.totalElements; this.catCount.set(catTotal); }
          });
          this.api.getAmountTiers(p.name, {unpaged: true}).subscribe({
            next: (r) => { tierTotal += r.totalElements; this.tierCount.set(tierTotal); }
          });
        });
      }
    });
  }
}
