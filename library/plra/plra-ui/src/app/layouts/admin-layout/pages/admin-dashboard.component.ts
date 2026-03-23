import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'plra-admin-dashboard', standalone: true, imports: [CommonModule, RouterModule, KpiCardComponent],
  template: `
    <header class="mb-4"><h1 style="font-size:22px;font-weight:700;display:flex;align-items:center;gap:10px;margin:0;"><i class="fa-solid fa-pen-ruler text-td-green"></i> {{ t.get('pages.administration') }}</h1><p class="text-muted" style="font-size:14px;margin:4px 0 0;">{{ t.get('rates.enter_rates') }}</p></header>
    <div class="row g-3 mb-4">
      <div class="col-sm-6"><plra-kpi-card [title]="t.get('dashboard.uloc_drafts')" [value]="ulocDrafts()" icon="fa-solid fa-file-pen" color="green" /></div>
      <div class="col-sm-6"><plra-kpi-card [title]="t.get('dashboard.iloc_drafts')" [value]="ilocDrafts()" icon="fa-solid fa-file-pen" color="blue" /></div>
    </div>
    <div class="row g-3">
      <div class="col-md-6"><a routerLink="../uloc" class="qc"><i class="fa-solid fa-credit-card text-td-green"></i> ULOC</a></div>
      <div class="col-md-6"><a routerLink="../iloc" class="qc"><i class="fa-solid fa-landmark" style="color:var(--color-brand)"></i> ILOC</a></div>
    </div>
  `,
  styles: [`.qc{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--border-color);border-radius:10px;padding:16px;text-decoration:none;color:var(--color-ink);font-weight:600;font-size:14px;transition:all .15s}.qc:hover{border-color:var(--td-green);box-shadow:0 4px 12px rgba(0,138,0,.08)}.qc i{font-size:18px}`]
})
export class AdminDashboardComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  ulocDrafts = signal(0); ilocDrafts = signal(0);
  ngOnInit(): void {
    this.api.getUlocDrafts({status:'DRAFT',size:1}).subscribe({next:p=>this.ulocDrafts.set(p.totalElements)});
    this.api.getIlocDrafts({status:'DRAFT',size:1}).subscribe({next:p=>this.ilocDrafts.set(p.totalElements)});
  }
}
