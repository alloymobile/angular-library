import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'plra-admin-dashboard', standalone: true, imports: [CommonModule, RouterModule, KpiCardComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
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
