import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslationService } from '../../core/i18n/translation.service';
import { AuthService } from '../../shared/services/auth.service';
import { RateApiService } from '../../core/services/rate-api.service';
import { forkJoin } from 'rxjs';

interface NotifItem { label: string; count: number; route: string; }

@Component({
  selector: 'plra-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent implements OnInit {
  t = inject(TranslationService);
  auth = inject(AuthService);
  private api = inject(RateApiService);
  private router = inject(Router);

  totalCount = signal(0);
  items = signal<NotifItem[]>([]);
  dropdownOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.notif-wrap')) this.dropdownOpen.set(false);
  }

  ngOnInit(): void {
    this.loadDecisions();
  }

  private loadDecisions(): void {
    forkJoin([
      this.api.getUlocDrafts({ size: 500 }),
      this.api.getIlocDrafts({ size: 500 })
    ]).subscribe({
      next: ([uloc, iloc]) => {
        const ulocDecided = uloc.content.filter(d => d.status === 'APPROVED' || d.status === 'REJECTED').length;
        const ilocDecided = iloc.content.filter(d => d.status === 'APPROVED' || d.status === 'REJECTED').length;
        const list: NotifItem[] = [];
        if (ulocDecided > 0) list.push({ label: 'ULOC', count: ulocDecided, route: '/enter-rates/uloc' });
        if (ilocDecided > 0) list.push({ label: 'ILOC', count: ilocDecided, route: '/enter-rates/iloc' });
        this.items.set(list);
        this.totalCount.set(ulocDecided + ilocDecided);
      }
    });
  }

  toggleDropdown(): void {
    if (this.totalCount() === 0) return;
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  goTo(item: NotifItem): void {
    this.dropdownOpen.set(false);
    // Clear badge — admin has viewed the decisions
    this.totalCount.set(0);
    this.items.set([]);
    this.router.navigate([item.route], { queryParams: { tab: 'status' } });
  }
}
