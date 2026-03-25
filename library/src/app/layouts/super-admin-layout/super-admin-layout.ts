import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { TranslationService } from '../../core/i18n/translation.service';
import { AuthService } from '../../shared/services/auth.service';
import { RateApiService } from '../../core/services/rate-api.service';
import { forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';

interface NotifItem { label: string; count: number; route: string; }

@Component({
  selector: 'plra-super-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './super-admin-layout.html',
  styleUrls: ['./super-admin-layout.css']
})
export class SuperAdminLayoutComponent implements OnInit {
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
    this.loadPending();
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.loadPending();
      this.dropdownOpen.set(false);
    });
  }

  private loadPending(): void {
    forkJoin([
      this.api.getUlocDrafts({ status: 'PENDING', size: 1 }),
      this.api.getIlocDrafts({ status: 'PENDING', size: 1 })
    ]).subscribe({
      next: ([uloc, iloc]) => {
        const list: NotifItem[] = [];
        if (uloc.totalElements > 0) list.push({ label: 'ULOC', count: uloc.totalElements, route: '/approve-rates/uloc-rates' });
        if (iloc.totalElements > 0) list.push({ label: 'ILOC', count: iloc.totalElements, route: '/approve-rates/iloc-rates' });
        this.items.set(list);
        this.totalCount.set(uloc.totalElements + iloc.totalElements);
      }
    });
  }

  toggleDropdown(): void {
    if (this.totalCount() === 0) return;
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  goTo(item: NotifItem): void {
    this.dropdownOpen.set(false);
    this.router.navigate([item.route], { queryParams: { tab: 'approve' } });
  }
}
