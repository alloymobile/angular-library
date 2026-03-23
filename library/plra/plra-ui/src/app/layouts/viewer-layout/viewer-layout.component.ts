import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/i18n/translation.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'plra-viewer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- TD Green Banner -->
    <div class="td-banner">
      <a class="td-banner-logo" routerLink="dashboard">
        <span class="td-banner-shield">TD</span>
        <span>PLRA</span>
      </a>
      <div class="td-banner-nav">
        <span class="td-banner-role">View Rates</span>
      </div>
    </div>

    <!-- White Sidebar -->
    <nav class="td-sidebar">
      <a routerLink="dashboard" routerLinkActive="active" class="td-sidebar-item"><i class="fa-solid fa-gauge"></i><span>Dashboard</span></a>
      <div class="td-sidebar-divider"></div>
      <a routerLink="uloc" routerLinkActive="active" class="td-sidebar-item"><i class="fa-solid fa-credit-card"></i><span>ULOC</span></a>
      <a routerLink="iloc" routerLinkActive="active" class="td-sidebar-item"><i class="fa-solid fa-landmark"></i><span>ILOC</span></a>
    </nav>

    <!-- Top Bar -->
    <header class="td-topbar">
      <h1 class="td-topbar-title">{{ t.get('app.title') }} — View Rates</h1>
      <div class="td-topbar-right">
        <div class="td-lang-toggle">
          <button class="td-lang-btn" [class.active]="t.currentLang() === 'en'" (click)="t.setLanguage('en')">EN</button>
          <button class="td-lang-btn" [class.active]="t.currentLang() === 'fr'" (click)="t.setLanguage('fr')">FR</button>
        </div>
        <div class="td-user-pill">
          <div class="td-user-avatar">{{ auth.user().charAt(0).toUpperCase() }}</div>
          <span class="td-user-name">{{ auth.user() }}</span>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="td-content"><router-outlet /></main>
  `,
  styles: [`
    :host { display: block; }
    .td-banner-role { color:rgba(255,255,255,.7); font-size:12px; font-weight:500; margin-left:auto; }
  `]
})
export class ViewerLayoutComponent {
  t = inject(TranslationService);
  auth = inject(AuthService);
}
