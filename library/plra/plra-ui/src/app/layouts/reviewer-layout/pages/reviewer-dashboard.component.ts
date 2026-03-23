import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'plra-reviewer-dashboard', standalone: true, imports: [CommonModule, RouterModule, KpiCardComponent],
  template: `
    <header class="mb-4"><h1 style="font-size:22px;font-weight:700;display:flex;align-items:center;gap:10px;margin:0;"><i class="fa-solid fa-clipboard-check text-td-green"></i> Review Dashboard</h1><p class="text-muted" style="font-size:14px;margin:4px 0 0;">Review and approve pending rate changes</p></header>
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="ULOC Active" [value]="uloc()" icon="fa-solid fa-credit-card" color="green" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="ILOC Active" [value]="iloc()" icon="fa-solid fa-landmark" color="blue" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Pending" [value]="pending()" icon="fa-solid fa-clock" color="amber" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Prime Rate" value="6.95%" icon="fa-solid fa-chart-line" color="red" /></div>
    </div>
    <div class="row g-3">
      <div class="col-md-6"><a routerLink="../uloc" class="qc"><i class="fa-solid fa-credit-card text-td-green"></i> ULOC Rates</a></div>
      <div class="col-md-6"><a routerLink="../iloc" class="qc"><i class="fa-solid fa-landmark" style="color:var(--color-brand)"></i> ILOC Rates</a></div>
    </div>
  `,
  styles: [`.qc{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--border-color);border-radius:10px;padding:18px;text-decoration:none;color:var(--color-ink);font-weight:600;font-size:14px;transition:all .15s}.qc:hover{border-color:var(--td-green);box-shadow:0 4px 12px rgba(0,138,0,.08)}.qc i{font-size:20px}`]
})
export class ReviewerDashboardComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  uloc = signal(0); iloc = signal(0); pending = signal(0);
  ngOnInit(): void {
    this.api.getUlocActive({size:1}).subscribe({next:p=>this.uloc.set(p.totalElements)});
    this.api.getIlocActive({size:1}).subscribe({next:p=>this.iloc.set(p.totalElements)});
    this.api.getUlocDrafts({status:'PENDING',size:1}).subscribe({next:p=>this.pending.set(p.totalElements)});
  }
}
