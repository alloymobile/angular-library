import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { ProductAdminView } from '../../../core/models/api.models';

@Component({
  selector: 'plra-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, KpiCardComponent],
  templateUrl: './super-admin-dashboard.html',
  styleUrls: ['./super-admin-dashboard.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  prodCount = signal(0);
  catCount = signal(0);
  tierCount = signal(0);

  ngOnInit(): void {
    this.api.getProducts({ unpaged: true }).subscribe({
      next: (res) => {
        const prods = res.content;
        this.prodCount.set(prods.length);
        let catTotal = 0, tierTotal = 0;
        prods.forEach((p: ProductAdminView) => {
          this.api.getCategories(p.name, { unpaged: true }).subscribe({
            next: (r) => { catTotal += r.totalElements; this.catCount.set(catTotal); }
          });
          this.api.getAmountTiers(p.name, { unpaged: true }).subscribe({
            next: (r) => { tierTotal += r.totalElements; this.tierCount.set(tierTotal); }
          });
        });
      }
    });
  }
}
