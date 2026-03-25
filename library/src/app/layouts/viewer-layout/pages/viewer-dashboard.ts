import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { KpiCardComponent } from '../../../shared/components/kpi-card/kpi-card.component';
import { ProductAdminView } from '../../../core/models/api.models';

@Component({
  selector: 'plra-viewer-dashboard', standalone: true, imports: [CommonModule, RouterModule, KpiCardComponent],
  templateUrl: './viewer-dashboard.html',
  styleUrls: ['./viewer-dashboard.css']
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
