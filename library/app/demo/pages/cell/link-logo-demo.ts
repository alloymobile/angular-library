import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLinkLogo } from '../../../lib/td-link-logo/td-link-logo';
import { TdLinkLogoModel } from '../../../lib/td-link-logo/td-link-logo.model';

const DEFAULT_OBJ = {
  id: 'tdLinkLogo1',
  name: 'TD UI',
  href: '/',
  logo: 'https://angular.dev/assets/icons/apple-touch-icon.png',
  width: 32,
  height: 32,
  className: 'px-2 py-1 rounded d-inline-block',
  active: 'bg-light',
  title: 'Homepage',
};

@Component({
  selector: 'link-logo-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLinkLogo],
  template: `
    <section id="link-logo" class="container py-3">
      <h3 class="mb-1 text-center">TdLinkLogo</h3>

      <!-- Row 1 — Code sample -->
      <div class="row mb-2">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>&lt;td-link-logo [model]="linkLogoModel"&gt;&lt;/td-link-logo&gt;</code>
          </pre>
        </div>
      </div>

      <!-- Row 2 — Live Output -->
      <div class="row mb-3">
        <div class="col-12 text-center">
          <span class="fw-semibold d-block mb-2">Logo Link</span>
          <div class="d-flex justify-content-center">
            <td-link-logo [model]="model()"></td-link-logo>
          </div>
        </div>
      </div>

      <!-- Row 3 — JSON editor -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-semibold">Logo JSON (editable)</span>
            <button
              type="button"
              (click)="formatJson()"
              class="btn btn-sm btn-outline-secondary">
              <i class="fa-solid fa-wand-magic-sparkles me-2" aria-hidden="true"></i>
              Format JSON
            </button>
          </div>

          <textarea
            class="form-control font-monospace"
            [class.is-invalid]="error()"
            rows="10"
            spellcheck="false"
            [(ngModel)]="jsonText"
            (ngModelChange)="handleChange($event)">
          </textarea>

          @if (error()) {
            <div class="invalid-feedback">{{ error() }}</div>
          } @else {
            <div class="form-text">
              Required: <code>href</code>, <code>logo</code>. Optional:
              <code>id</code>, <code>name</code>, <code>width</code>,
              <code>height</code>, <code>className</code>, <code>active</code>,
              <code>target</code>, <code>rel</code>, <code>title</code>.
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LinkLogoDemo {
  jsonText = JSON.stringify(DEFAULT_OBJ, null, 2);
  error = signal('');
  parsed = signal<any>(DEFAULT_OBJ);

  model = computed(() => {
    try {
      const safeHref = this.parsed()?.href ?? '/';
      return new TdLinkLogoModel({ ...this.parsed(), href: safeHref });
    } catch {
      return new TdLinkLogoModel(DEFAULT_OBJ);
    }
  });

  handleChange(val: string): void {
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed.set(obj);
      this.error.set('');
    } catch (err: any) {
      this.error.set(err.message || 'Invalid JSON.');
    }
  }

  formatJson(): void {
    try {
      const obj = JSON.parse(this.jsonText);
      this.jsonText = JSON.stringify(obj, null, 2);
      this.parsed.set(obj);
      this.error.set('');
    } catch {
      // ignore if invalid
    }
  }
}
