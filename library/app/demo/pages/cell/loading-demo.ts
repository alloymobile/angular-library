import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLoading } from '../../../lib/td-loading/td-loading';
import { TdLoadingModel } from '../../../lib/td-loading/td-loading.model';

const DEFAULT_OBJ = {
  id: 'tdLoading1',
  message: 'Loading data...',
  icon: {
    iconClass: 'fa-solid fa-spinner fa-3x fa-spin',
    className: '',
  },
  overlayClass: 'd-flex align-items-center justify-content-center bg-dark bg-opacity-25 w-100 h-100 rounded',
  contentClass: 'text-center p-4 rounded bg-white shadow',
  messageClass: 'mt-3 text-muted',
  ariaLabel: 'Loading demo overlay',
  visible: true,
};

@Component({
  selector: 'loading-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLoading],
  template: `
    <section id="loading" class="container py-3">
      <h3 class="mb-1 text-center">TdLoading</h3>

      <!-- Row 1 — Code example -->
      <div class="row mb-2">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>&lt;td-loading [model]="loadingModel"&gt;&lt;/td-loading&gt;</code>
          </pre>
        </div>
      </div>

      <!-- Row 2 — Rendered output -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-semibold">Loading overlay</span>

            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              (click)="toggleVisibleInJson()"
              [disabled]="!!error()"
              [title]="error() ? 'Fix JSON first' : 'Toggles data.visible in the JSON'">
              {{ isVisible() ? 'Set visible=false' : 'Set visible=true' }}
            </button>
          </div>

          <div
            class="position-relative border rounded"
            style="min-height: 180px;">
            <!-- Overlay area (inside a local container) -->
            <div class="position-absolute top-0 start-0 w-100 h-100">
              <td-loading [model]="model()"></td-loading>
            </div>

            <!-- Underlying content for demo -->
            <div class="p-3 text-muted small">
              This is your underlying content. The <code>TdLoading</code>
              overlay appears on top of this area when
              <code>visible === true</code> in the JSON.
            </div>
          </div>
        </div>
      </div>

      <!-- Row 3 — Editable JSON -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-semibold">Loading JSON (editable)</span>

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
            <div class="invalid-feedback d-block">{{ error() }}</div>
          } @else {
            <div class="form-text">
              The textbox is the playground — this JSON is the source of truth.
              <ul class="mb-0">
                <li>
                  <code>visible</code> – set <code>false</code> to hide the overlay.
                </li>
                <li>
                  <code>message</code> – text under the icon (default: <code>"Loading..."</code>).
                </li>
                <li>
                  <code>icon.iconClass</code> – Font Awesome classes.
                </li>
                <li>
                  <code>icon.className</code> – extra icon classes (use <code>""</code> to ignore).
                </li>
                <li>
                  <code>overlayClass</code>, <code>contentClass</code>,
                  <code>messageClass</code> – Bootstrap class overrides.
                </li>
                <li>
                  <code>id</code> – optional predictable DOM id. If omitted,
                  TdLoading generates an SSR-safe id internally.
                </li>
                <li>
                  <code>ariaLabel</code> – accessible label for screen readers.
                </li>
              </ul>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class LoadingDemo {
  jsonText = JSON.stringify(DEFAULT_OBJ, null, 2);
  error = signal('');
  parsed = signal<any>(DEFAULT_OBJ);

  isVisible = computed(() => {
    const data = this.parsed();
    return typeof data?.visible === 'boolean' ? data.visible : true;
  });

  model = computed(() => {
    try {
      return new TdLoadingModel(this.parsed());
    } catch (e: any) {
      this.error.set(String(e?.message || e));
      return new TdLoadingModel(DEFAULT_OBJ);
    }
  });

  handleChange(val: string): void {
    try {
      const obj = JSON.parse(val || '{}');
      this.parsed.set(obj);
      this.error.set('');
    } catch (e: any) {
      this.error.set(String(e?.message || e));
    }
  }

  formatJson(): void {
    try {
      this.jsonText = JSON.stringify(JSON.parse(this.jsonText), null, 2);
    } catch {
      // ignore bad json until user fixes it
    }
  }

  toggleVisibleInJson(): void {
    try {
      const obj = JSON.parse(this.jsonText || '{}');
      const current = typeof obj.visible === 'boolean' ? obj.visible : true;
      obj.visible = !current;
      this.jsonText = JSON.stringify(obj, null, 2);
      this.parsed.set(obj);
    } catch {
      // ignore; user can fix JSON
    }
  }
}
