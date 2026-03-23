import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { ProductAdminView } from '../../../core/models/api.models';

@Component({
  selector: 'plra-viewer-dashboard', standalone: true, imports: [CommonModule, RouterModule, KpiCardComponent],
  template: `
    <header class="mb-4">
      <h1 style="font-size:22px;font-weight:700;display:flex;align-items:center;gap:10px;margin:0;"><i class="fa-solid fa-eye text-td-green"></i> Dashboard</h1>
      <p class="text-muted" style="font-size:14px;margin:4px 0 0;">Read-only access to published rates</p>
    </header>
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="ULOC Active" [value]="ulocCount()" icon="fa-solid fa-credit-card" color="green" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="ILOC Active" [value]="ilocCount()" icon="fa-solid fa-landmark" color="blue" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Products" [value]="prodCount()" icon="fa-solid fa-boxes-stacked" color="purple" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Prime Rate" value="6.95%" icon="fa-solid fa-chart-line" color="amber" /></div>
    </div>
    <div class="row g-3">
      <div class="col-md-6"><a routerLink="../uloc" class="qc"><i class="fa-solid fa-credit-card text-td-green"></i><div><div class="fw-semibold">ULOC Rates</div><div class="text-muted small">View unsecured line of credit rates</div></div></a></div>
      <div class="col-md-6"><a routerLink="../iloc" class="qc"><i class="fa-solid fa-landmark" style="color:var(--color-brand)"></i><div><div class="fw-semibold">ILOC Rates</div><div class="text-muted small">View investment line of credit rates</div></div></a></div>
    </div>
  `,
  styles: [`.qc{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid var(--border-color);border-radius:10px;padding:20px;text-decoration:none;color:var(--color-ink);transition:all .15s}.qc:hover{border-color:var(--td-green);box-shadow:0 4px 12px rgba(0,138,0,.08)}.qc i{font-size:28px}`]
})
export class ViewerDashboardComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  ulocCount = signal(0); ilocCount = signal(0); prodCount = signal(0);
  ngOnInit(): void {
    this.api.getProducts({unpaged:true}).subscribe({next:r=>this.prodCount.set(r.totalElements)});
    this.api.getUlocActive({size:1}).subscribe({next:r=>this.ulocCount.set(r.totalElements)});
    this.api.getIlocActive({size:1}).subscribe({next:r=>this.ilocCount.set(r.totalElements)});
  }
}
