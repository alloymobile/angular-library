import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';

@Component({
  selector: 'plra-reviewer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, KpiCardComponent],
  templateUrl: './reviewer-dashboard.html',
  styleUrls: ['./reviewer-dashboard.css']
})
export class ReviewerDashboardComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  ulocActive = signal(0);
  ilocActive = signal(0);

  ngOnInit(): void {
    this.api.getUlocActive({ size: 1 }).subscribe({ next: r => this.ulocActive.set(r.totalElements) });
    this.api.getIlocActive({ size: 1 }).subscribe({ next: r => this.ilocActive.set(r.totalElements) });
  }
}
