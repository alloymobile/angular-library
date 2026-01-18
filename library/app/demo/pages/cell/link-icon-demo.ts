import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLinkIcon } from '../../../lib/td-link-icon/td-link-icon';
import { TdLinkIconModel } from '../../../lib/td-link-icon/td-link-icon.model';

const DEFAULT_OBJ = {
  id: 'tdLinkIcon1',
  href: '#home',
  icon: {
    iconClass: 'fa-solid fa-house',
    className: 'd-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle p-2',
  },
  name: 'Home',
  className: 'px-2 py-1 rounded d-inline-block',
  active: 'bg-light',
  title: 'Go Home',
};

@Component({
  selector: 'link-icon-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLinkIcon],
  template: `
    <section id="link-icon" class="container py-3">
      <h3 class="mb-1 text-center">TdLinkIcon</h3>

      <div class="row mb-2">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>&lt;td-link-icon [model]="linkIconModel"&gt;&lt;/td-link-icon&gt;</code>
          </pre>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-12 text-center">
          <span class="fw-semibold d-block mb-2">Link Icon</span>
          <div class="d-flex justify-content-center">
            <td-link-icon [model]="model()"></td-link-icon>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-semibold">LinkIcon JSON (editable)</span>
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
            rows="12"
            spellcheck="false"
            [(ngModel)]="jsonText"
            (ngModelChange)="handleChange($event)">
          </textarea>

          @if (error()) {
            <div class="invalid-feedback">{{ error() }}</div>
          } @else {
            <div class="form-text">
              Required: <code>href</code>, <code>icon.iconClass</code>. Optional:
              <code>id</code>, <code>name</code>, <code>className</code>,
              <code>active</code>, <code>target</code>, <code>rel</code>,
              <code>title</code>, and for icon wrapper styling: <code>icon.className</code>.
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LinkIconDemo {
  jsonText = JSON.stringify(DEFAULT_OBJ, null, 2);
  error = signal('');
  parsed = signal<any>(DEFAULT_OBJ);

  model = computed(() => {
    try {
      const safeHref = this.parsed()?.href ?? '#';
      return new TdLinkIconModel({ ...this.parsed(), href: safeHref });
    } catch {
      return new TdLinkIconModel(DEFAULT_OBJ);
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
      // ignore
    }
  }
}
