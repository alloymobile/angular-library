// src/app/demo/shell/demo-link-logo/demo-link-logo.ts
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLinkLogo } from '../../../lib/cell/td-link-logo/td-link-logo';
import { TdLinkLogoModel } from '../../../lib/cell/td-link-logo/td-link-logo.model';

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
  selector: 'demo-link-logo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLinkLogo],
  templateUrl: './demo-link-logo.html',
  styleUrl: './demo-link-logo.css',
})
export class DemoLinkLogo implements OnInit {
  jsonText = '';
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

  ngOnInit(): void {
    this.jsonText = JSON.stringify(DEFAULT_OBJ, null, 2);
  }

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
