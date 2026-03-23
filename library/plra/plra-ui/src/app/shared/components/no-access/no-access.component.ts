import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'plra-no-access',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="d-flex align-items-center justify-content-center" style="min-height:100vh;background:var(--color-surface);">
      <div class="text-center">
        <i class="fa-solid fa-lock" style="font-size:48px;color:#dc2626;margin-bottom:16px;"></i>
        <h2 style="font-weight:700;">Access Denied</h2>
        <p style="color:#6b7280;">You do not have the required AD group to access this page.</p>
        <a routerLink="/" class="btn btn-outline-secondary">Go Home</a>
      </div>
    </div>
  `
})
export class NoAccessComponent {}
