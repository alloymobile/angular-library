import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../core/i18n/translation.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'plra-super-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="td-banner">
      <a class="td-banner-logo" routerLink="dashboard">
        <span class="td-banner-shield">TD</span>
        <span>PLRA</span>
      </a>
      <div class="td-banner-nav">
        <span class="td-banner-role">System Admin</span>
      </div>
    </div>

    <nav class="td-sidebar">
      <a routerLink="dashboard" routerLinkActive="active" class="td-sidebar-item">
        <i class="fa-solid fa-gauge"></i><span>Dashboard</span>
      </a>

      <div class="td-sidebar-section">RATES</div>
      <a routerLink="uloc-rates" routerLinkActive="active" class="td-sidebar-item">
        <i class="fa-solid fa-table-cells"></i><span>ULOC Rates</span>
      </a>
      <a routerLink="iloc-rates" routerLinkActive="active" class="td-sidebar-item">
        <i class="fa-solid fa-table-cells-large"></i><span>ILOC Rates</span>
      </a>

      <div class="td-sidebar-section">MASTER DATA</div>
      <a routerLink="uloc-settings" routerLinkActive="active" class="td-sidebar-item">
        <i class="fa-solid fa-credit-card"></i><span>ULOC</span>
      </a>
      <a routerLink="iloc-settings" routerLinkActive="active" class="td-sidebar-item">
        <i class="fa-solid fa-landmark"></i><span>ILOC</span>
      </a>
      <a routerLink="cvp-codes" routerLinkActive="active" class="td-sidebar-item">
        <i class="fa-solid fa-tags"></i><span>CVP Codes</span>
      </a>

      <div class="td-sidebar-divider"></div>
      <a routerLink="workflows" routerLinkActive="active" class="td-sidebar-item">
        <i class="fa-solid fa-code-branch"></i><span>Workflows</span>
      </a>
    </nav>

    <header class="td-topbar">
      <h1 class="td-topbar-title">{{ t.get('app.title') }} — System Administration</h1>
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

    <main class="td-content"><router-outlet /></main>
  `,
  styles: [`
    :host { display: block; }
    .td-banner-role { color:rgba(255,255,255,.7); font-size:12px; font-weight:500; margin-left:auto; }
    .td-sidebar-section {
      font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.8px;
      color:var(--color-muted,#9e9e9e); text-align:center; padding:12px 4px 4px; margin-top:4px;
    }
  `]
})
export class SuperAdminLayoutComponent {
  t = inject(TranslationService);
  auth = inject(AuthService);
}
