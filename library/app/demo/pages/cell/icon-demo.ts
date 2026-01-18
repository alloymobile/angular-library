import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdIcon } from '../../../lib/td-icon/td-icon';
import { TdIconModel } from '../../../lib/td-icon/td-icon.model';

// Font Awesome 6 Free icons - a curated list of common icons
const ALL_ICONS: { name: string; cls: string }[] = [
  // Solid icons
  { name: 'user', cls: 'fa-solid fa-user' },
  { name: 'house', cls: 'fa-solid fa-house' },
  { name: 'gear', cls: 'fa-solid fa-gear' },
  { name: 'star', cls: 'fa-solid fa-star' },
  { name: 'heart', cls: 'fa-solid fa-heart' },
  { name: 'bell', cls: 'fa-solid fa-bell' },
  { name: 'envelope', cls: 'fa-solid fa-envelope' },
  { name: 'magnifying-glass', cls: 'fa-solid fa-magnifying-glass' },
  { name: 'check', cls: 'fa-solid fa-check' },
  { name: 'xmark', cls: 'fa-solid fa-xmark' },
  { name: 'plus', cls: 'fa-solid fa-plus' },
  { name: 'minus', cls: 'fa-solid fa-minus' },
  { name: 'trash', cls: 'fa-solid fa-trash' },
  { name: 'pen', cls: 'fa-solid fa-pen' },
  { name: 'download', cls: 'fa-solid fa-download' },
  { name: 'upload', cls: 'fa-solid fa-upload' },
  { name: 'file', cls: 'fa-solid fa-file' },
  { name: 'folder', cls: 'fa-solid fa-folder' },
  { name: 'image', cls: 'fa-solid fa-image' },
  { name: 'video', cls: 'fa-solid fa-video' },
  { name: 'music', cls: 'fa-solid fa-music' },
  { name: 'calendar', cls: 'fa-solid fa-calendar' },
  { name: 'clock', cls: 'fa-solid fa-clock' },
  { name: 'location-dot', cls: 'fa-solid fa-location-dot' },
  { name: 'phone', cls: 'fa-solid fa-phone' },
  { name: 'cart-shopping', cls: 'fa-solid fa-cart-shopping' },
  { name: 'credit-card', cls: 'fa-solid fa-credit-card' },
  { name: 'lock', cls: 'fa-solid fa-lock' },
  { name: 'unlock', cls: 'fa-solid fa-unlock' },
  { name: 'key', cls: 'fa-solid fa-key' },
  { name: 'shield', cls: 'fa-solid fa-shield' },
  { name: 'eye', cls: 'fa-solid fa-eye' },
  { name: 'eye-slash', cls: 'fa-solid fa-eye-slash' },
  { name: 'comment', cls: 'fa-solid fa-comment' },
  { name: 'comments', cls: 'fa-solid fa-comments' },
  { name: 'share', cls: 'fa-solid fa-share' },
  { name: 'link', cls: 'fa-solid fa-link' },
  { name: 'bookmark', cls: 'fa-solid fa-bookmark' },
  { name: 'tag', cls: 'fa-solid fa-tag' },
  { name: 'tags', cls: 'fa-solid fa-tags' },
  { name: 'circle-info', cls: 'fa-solid fa-circle-info' },
  { name: 'circle-question', cls: 'fa-solid fa-circle-question' },
  { name: 'circle-exclamation', cls: 'fa-solid fa-circle-exclamation' },
  { name: 'circle-check', cls: 'fa-solid fa-circle-check' },
  { name: 'circle-xmark', cls: 'fa-solid fa-circle-xmark' },
  { name: 'triangle-exclamation', cls: 'fa-solid fa-triangle-exclamation' },
  { name: 'spinner', cls: 'fa-solid fa-spinner' },
  { name: 'rotate', cls: 'fa-solid fa-rotate' },
  { name: 'arrows-rotate', cls: 'fa-solid fa-arrows-rotate' },
  { name: 'bolt', cls: 'fa-solid fa-bolt' },
  { name: 'fire', cls: 'fa-solid fa-fire' },
  { name: 'sun', cls: 'fa-solid fa-sun' },
  { name: 'moon', cls: 'fa-solid fa-moon' },
  { name: 'cloud', cls: 'fa-solid fa-cloud' },
  { name: 'database', cls: 'fa-solid fa-database' },
  { name: 'server', cls: 'fa-solid fa-server' },
  { name: 'code', cls: 'fa-solid fa-code' },
  { name: 'terminal', cls: 'fa-solid fa-terminal' },
  { name: 'bug', cls: 'fa-solid fa-bug' },
  { name: 'rocket', cls: 'fa-solid fa-rocket' },
  { name: 'plane', cls: 'fa-solid fa-plane' },
  { name: 'car', cls: 'fa-solid fa-car' },
  { name: 'bicycle', cls: 'fa-solid fa-bicycle' },
  { name: 'building', cls: 'fa-solid fa-building' },
  { name: 'hospital', cls: 'fa-solid fa-hospital' },
  { name: 'graduation-cap', cls: 'fa-solid fa-graduation-cap' },
  { name: 'briefcase', cls: 'fa-solid fa-briefcase' },
  { name: 'chart-line', cls: 'fa-solid fa-chart-line' },
  { name: 'chart-bar', cls: 'fa-solid fa-chart-bar' },
  { name: 'chart-pie', cls: 'fa-solid fa-chart-pie' },
  { name: 'table', cls: 'fa-solid fa-table' },
  { name: 'list', cls: 'fa-solid fa-list' },
  { name: 'grip', cls: 'fa-solid fa-grip' },
  { name: 'bars', cls: 'fa-solid fa-bars' },
  { name: 'ellipsis', cls: 'fa-solid fa-ellipsis' },
  { name: 'ellipsis-vertical', cls: 'fa-solid fa-ellipsis-vertical' },
  { name: 'chevron-up', cls: 'fa-solid fa-chevron-up' },
  { name: 'chevron-down', cls: 'fa-solid fa-chevron-down' },
  { name: 'chevron-left', cls: 'fa-solid fa-chevron-left' },
  { name: 'chevron-right', cls: 'fa-solid fa-chevron-right' },
  { name: 'arrow-up', cls: 'fa-solid fa-arrow-up' },
  { name: 'arrow-down', cls: 'fa-solid fa-arrow-down' },
  { name: 'arrow-left', cls: 'fa-solid fa-arrow-left' },
  { name: 'arrow-right', cls: 'fa-solid fa-arrow-right' },
  { name: 'angle-up', cls: 'fa-solid fa-angle-up' },
  { name: 'angle-down', cls: 'fa-solid fa-angle-down' },
  { name: 'caret-up', cls: 'fa-solid fa-caret-up' },
  { name: 'caret-down', cls: 'fa-solid fa-caret-down' },
  { name: 'sort', cls: 'fa-solid fa-sort' },
  { name: 'filter', cls: 'fa-solid fa-filter' },
  { name: 'sliders', cls: 'fa-solid fa-sliders' },
  { name: 'copy', cls: 'fa-solid fa-copy' },
  { name: 'paste', cls: 'fa-solid fa-paste' },
  { name: 'scissors', cls: 'fa-solid fa-scissors' },
  { name: 'print', cls: 'fa-solid fa-print' },
  { name: 'floppy-disk', cls: 'fa-solid fa-floppy-disk' },
  { name: 'expand', cls: 'fa-solid fa-expand' },
  { name: 'compress', cls: 'fa-solid fa-compress' },
  { name: 'maximize', cls: 'fa-solid fa-maximize' },
  { name: 'minimize', cls: 'fa-solid fa-minimize' },
  // Regular icons
  { name: 'user (regular)', cls: 'fa-regular fa-user' },
  { name: 'star (regular)', cls: 'fa-regular fa-star' },
  { name: 'heart (regular)', cls: 'fa-regular fa-heart' },
  { name: 'bell (regular)', cls: 'fa-regular fa-bell' },
  { name: 'envelope (regular)', cls: 'fa-regular fa-envelope' },
  { name: 'file (regular)', cls: 'fa-regular fa-file' },
  { name: 'folder (regular)', cls: 'fa-regular fa-folder' },
  { name: 'calendar (regular)', cls: 'fa-regular fa-calendar' },
  { name: 'clock (regular)', cls: 'fa-regular fa-clock' },
  { name: 'eye (regular)', cls: 'fa-regular fa-eye' },
  { name: 'comment (regular)', cls: 'fa-regular fa-comment' },
  { name: 'bookmark (regular)', cls: 'fa-regular fa-bookmark' },
  // Brand icons
  { name: 'github', cls: 'fa-brands fa-github' },
  { name: 'twitter', cls: 'fa-brands fa-twitter' },
  { name: 'facebook', cls: 'fa-brands fa-facebook' },
  { name: 'instagram', cls: 'fa-brands fa-instagram' },
  { name: 'linkedin', cls: 'fa-brands fa-linkedin' },
  { name: 'youtube', cls: 'fa-brands fa-youtube' },
  { name: 'google', cls: 'fa-brands fa-google' },
  { name: 'apple', cls: 'fa-brands fa-apple' },
  { name: 'microsoft', cls: 'fa-brands fa-microsoft' },
  { name: 'amazon', cls: 'fa-brands fa-amazon' },
  { name: 'slack', cls: 'fa-brands fa-slack' },
  { name: 'discord', cls: 'fa-brands fa-discord' },
  { name: 'angular', cls: 'fa-brands fa-angular' },
  { name: 'react', cls: 'fa-brands fa-react' },
  { name: 'vuejs', cls: 'fa-brands fa-vuejs' },
  { name: 'node-js', cls: 'fa-brands fa-node-js' },
  { name: 'python', cls: 'fa-brands fa-python' },
  { name: 'java', cls: 'fa-brands fa-java' },
  { name: 'docker', cls: 'fa-brands fa-docker' },
  { name: 'aws', cls: 'fa-brands fa-aws' },
];

@Component({
  selector: 'icon-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdIcon],
  template: `
    <section id="icon" class="container py-3">
      <h3 class="mb-1 text-center">TdIcon</h3>

      <!-- Row 1 — Code sample (centered) -->
      <div class="row mb-2">
        <div class="col-12 d-flex align-items-center justify-content-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>&lt;td-icon [model]="iconModel"&gt;&lt;/td-icon&gt;</code>
          </pre>
        </div>
      </div>

      <!-- Row 2 — Rendered icon (centered) -->
      <div class="row mb-3">
        <div class="col-12 text-center">
          <span class="fw-semibold d-block mb-2">Icon</span>
          <div class="d-flex justify-content-center">
            <td-icon [model]="displayModel()"></td-icon>
          </div>

          <div class="form-text mt-2">
            Wrapper styling comes from <code>className</code> on the icon object.
          </div>
        </div>
      </div>

      <!-- Row 3 — Editable JSON (full width) -->
      <div class="row mb-2">
        <div class="col-12">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="fw-semibold">Icon JSON (editable)</span>
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
            [class.is-invalid]="jsonError()"
            rows="7"
            spellcheck="false"
            [(ngModel)]="jsonText"
            (ngModelChange)="handleJsonChange($event)">
          </textarea>

          @if (jsonError()) {
            <div class="invalid-feedback">{{ jsonError() }}</div>
          } @else {
            <div class="form-text">
              Required: <code>iconClass</code>. Optional: <code>id</code>, <code>className</code>.
            </div>
          }
        </div>
      </div>

      <!-- Search -->
      <div class="mb-3">
        <label for="iconSearch" class="form-label fw-semibold">
          Search Icons
        </label>
        <input
          id="iconSearch"
          type="search"
          class="form-control"
          placeholder="Type name (e.g., 'user', 'gear', 'arrow')"
          [(ngModel)]="query"
        />
      </div>

      <!-- Gallery — 12 icons per row, icon-only, click to select -->
      <div class="row g-2">
        @for (icon of filteredIcons(); track icon.cls) {
          <div class="col-1">
            <button
              type="button"
              class="btn w-100 d-flex align-items-center justify-content-center py-3"
              [class.btn-primary]="icon.cls === selectedIconClass()"
              [class.btn-outline-secondary]="icon.cls !== selectedIconClass()"
              [title]="icon.name"
              (click)="selectIcon(icon)">
              <i [class]="icon.cls + ' fa-lg'" aria-hidden="true"></i>
            </button>
          </div>
        }

        @if (filteredIcons().length === 0) {
          <div class="col-12">
            <div class="alert alert-warning mb-0">
              No icons match "{{ query }}".
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class IconDemo implements OnInit {
  query = '';
  jsonText = '';
  jsonError = signal('');
  selectedIconClass = signal('fa-solid fa-user');
  wrapperClassName = signal('d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle p-3 shadow-sm');

  filteredIcons = computed(() => {
    const q = this.query.trim().toLowerCase();
    if (!q) return ALL_ICONS;
    return ALL_ICONS.filter(
      (i) => i.name.toLowerCase().includes(q) || i.cls.toLowerCase().includes(q)
    );
  });

  displayModel = computed(() => {
    return new TdIconModel({
      iconClass: this.selectedIconClass() + ' fa-3x',
      className: this.wrapperClassName(),
    });
  });

  ngOnInit(): void {
    this.updateJsonText();
  }

  private updateJsonText(): void {
    this.jsonText = JSON.stringify(
      {
        iconClass: this.selectedIconClass(),
        className: this.wrapperClassName(),
      },
      null,
      2
    );
  }

  handleJsonChange(val: string): void {
    try {
      const parsed = JSON.parse(val);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('JSON must be an object.');
      }
      if (!parsed.iconClass || typeof parsed.iconClass !== 'string') {
        throw new Error('Missing or invalid "iconClass".');
      }

      this.selectedIconClass.set(parsed.iconClass);
      this.wrapperClassName.set(parsed.className || '');
      this.jsonError.set('');
    } catch (err: any) {
      this.jsonError.set(err.message || 'Invalid JSON.');
    }
  }

  formatJson(): void {
    try {
      const parsed = JSON.parse(this.jsonText);
      this.jsonText = JSON.stringify(parsed, null, 2);
      this.jsonError.set('');
    } catch (err: any) {
      this.jsonError.set(err.message || 'Invalid JSON.');
    }
  }

  selectIcon(icon: { name: string; cls: string }): void {
    this.selectedIconClass.set(icon.cls);
    this.updateJsonText();
    this.jsonError.set('');
  }
}
