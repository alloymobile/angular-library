import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/i18n/translation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'plra-top-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="plra-topbar">
      <div class="topbar-left">
        <h1 class="topbar-title">{{ t.get('app.title') }}</h1>
      </div>
      <div class="topbar-right">
        <button class="topbar-btn" title="Notifications"><i class="fa-regular fa-bell"></i></button>
        <div class="lang-toggle">
          <button class="lang-btn" [class.active]="t.currentLang() === 'en'" (click)="t.setLanguage('en')">EN</button>
          <button class="lang-btn" [class.active]="t.currentLang() === 'fr'" (click)="t.setLanguage('fr')">FR</button>
        </div>
        <div class="user-pill">
          <div class="user-avatar">{{ auth.user().charAt(0).toUpperCase() }}</div>
          <span class="user-name d-none d-md-inline">{{ auth.user() }}</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .plra-topbar { position:fixed; top:0; left:var(--sidebar-width,68px); right:0; height:var(--topbar-height,56px); background:#fff; border-bottom:1px solid var(--border-color,#e2e6ea); display:flex; align-items:center; justify-content:space-between; padding:0 20px; z-index:999; }
    .topbar-title { font-size:16px; font-weight:600; color:var(--td-dark,#1d1d1d); margin:0; }
    .topbar-right { display:flex; align-items:center; gap:12px; }
    .topbar-btn { background:none; border:1px solid var(--border-color,#e2e6ea); border-radius:8px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; color:var(--color-muted,#6b7280); cursor:pointer; transition:all .15s; }
    .topbar-btn:hover { background:#f3f4f6; color:var(--td-dark); }
    .lang-toggle { display:flex; border:1px solid var(--border-color); border-radius:6px; overflow:hidden; }
    .lang-btn { padding:4px 10px; font-size:12px; font-weight:600; border:none; background:#fff; color:var(--color-muted); cursor:pointer; transition:all .15s; }
    .lang-btn.active { background:var(--td-green,#008A00); color:#fff; }
    .user-pill { display:flex; align-items:center; gap:8px; padding:4px 10px 4px 4px; border:1px solid var(--border-color); border-radius:20px; }
    .user-avatar { width:28px; height:28px; border-radius:50%; background:var(--td-green); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; }
    .user-name { font-size:13px; font-weight:500; color:var(--td-dark); }
  `]
})
export class TopBarComponent {
  t = inject(TranslationService);
  auth = inject(AuthService);
}
