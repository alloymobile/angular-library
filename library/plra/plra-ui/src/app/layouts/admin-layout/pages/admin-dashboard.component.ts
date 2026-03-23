import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'plra-admin-dashboard', standalone: true, imports: [CommonModule, RouterModule, KpiCardComponent],
  template: `
    <header class="mb-4"><h1 style="font-size:22px;font-weight:700;display:flex;align-items:center;gap:10px;margin:0;"><i class="fa-solid fa-pen-ruler text-td-green"></i> Admin Dashboard</h1><p class="text-muted" style="font-size:14px;margin:4px 0 0;">Create, edit, and manage rate entries</p></header>
    <div class="row g-3 mb-4">
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="ULOC Drafts" [value]="ulocDrafts()" icon="fa-solid fa-file-pen" color="green" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="ILOC Drafts" [value]="ilocDrafts()" icon="fa-solid fa-file-pen" color="blue" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Prime Rate" value="6.95%" icon="fa-solid fa-chart-line" color="amber" /></div>
      <div class="col-sm-6 col-lg-3"><plra-kpi-card title="Workflows" [value]="workflows()" icon="fa-solid fa-code-branch" color="purple" /></div>
    </div>
    <div class="row g-3">
      <div class="col-md-4"><a routerLink="../uloc" class="qc"><i class="fa-solid fa-credit-card text-td-green"></i> ULOC Rate Entry</a></div>
      <div class="col-md-4"><a routerLink="../iloc" class="qc"><i class="fa-solid fa-landmark" style="color:var(--color-brand)"></i> ILOC Rate Entry</a></div>
      <div class="col-md-4"><a routerLink="../workflows" class="qc"><i class="fa-solid fa-code-branch" style="color:#7c3aed"></i> Workflows</a></div>
    </div>
  `,
  styles: [`.qc{display:flex;align-items:center;gap:10px;background:#fff;border:1px solid var(--border-color);border-radius:10px;padding:16px;text-decoration:none;color:var(--color-ink);font-weight:600;font-size:13px;transition:all .15s}.qc:hover{border-color:var(--td-green);box-shadow:0 4px 12px rgba(0,138,0,.08)}.qc i{font-size:18px}`]
})
export class AdminDashboardComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  ulocDrafts = signal(0); ilocDrafts = signal(0); workflows = signal(0);
  ngOnInit(): void {
    this.api.getUlocDrafts({size:1}).subscribe({next:p=>this.ulocDrafts.set(p.totalElements)});
    this.api.getIlocDrafts({size:1}).subscribe({next:p=>this.ilocDrafts.set(p.totalElements)});
    this.api.getWorkflows({size:1}).subscribe({next:p=>this.workflows.set(p.totalElements)});
  }
}
