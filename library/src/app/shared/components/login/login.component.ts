import { Component } from '@angular/core';

@Component({
  selector: 'plra-login',
  standalone: true,
  template: `
    <div class="d-flex align-items-center justify-content-center" style="min-height:100vh;background:var(--color-surface);">
      <div class="text-center">
        <div style="width:60px;height:60px;background:#008A00;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:20px;margin:0 auto 16px;">TD</div>
        <h2 style="font-weight:700;margin-bottom:8px;">PLRA</h2>
        <p style="color:#6b7280;margin-bottom:24px;">Product Lending Rate Administration</p>
        <button class="btn btn-success btn-lg" style="background:#008A00;border:none;padding:10px 40px;font-weight:600;">
          <i class="fa-solid fa-right-to-bracket me-2"></i>Sign in with PingFederate
        </button>
      </div>
    </div>
  `
})
export class LoginComponent {}
