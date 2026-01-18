import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLink } from '../../../lib/td-link/td-link';
import { TdLinkModel } from '../../../lib/td-link/td-link.model';

const DEFAULT_OBJ = {
  id: 'tdLink1',
  name: 'Open Docs',
  href: 'https://angular.dev/',
  className: 'link px-2 py-1 rounded',
  active: 'bg-light',
  target: '_blank',
  title: 'Angular documentation',
};

@Component({
  selector: 'link-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLink],
  template: `
    <section id="link" class="container py-3">
      <h3 class="mb-1 text-center">TdLink</h3>

      <!-- Row 1 — Code example -->
      <div class="row mb-2">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>&lt;td-link [model]="linkModel"&gt;&lt;/td-link&gt;</code>
          </pre>
        </div>
      </div>

      <!-- Row 2 — Rendered output -->
      <div class="row mb-3">
        <div class="col-12 text-center">
          <span class="fw-semibold d-block mb-2">Link</span>
          <div class="d-flex justify-content-center">
            <td-link [model]="model()"></td-link>
          </div>
        </div>
      </div>

      <!-- Row 3 — Editable JSON -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-semibold">Link JSON (editable)</span>

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
              Required: <code>href</code>, <code>name</code>. Optional:
              <code>id</code>, <code>className</code>, <code>active</code>,
              <code>target</code>, <code>rel</code>, <code>title</code>.
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LinkDemo {
  jsonText = JSON.stringify(DEFAULT_OBJ, null, 2);
  error = signal('');
  parsed = signal<any>(DEFAULT_OBJ);

  model = computed(() => {
    try {
      return new TdLinkModel(this.parsed());
    } catch (err: any) {
      this.error.set(err.message || 'Invalid TdLinkModel config.');
      return new TdLinkModel(DEFAULT_OBJ);
    }
  });

  handleChange(val: string): void {
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') {
        throw new Error('JSON must be an object.');
      }
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
      this.error.set('');
      this.parsed.set(obj);
    } catch {
      // ignore
    }
  }
}
