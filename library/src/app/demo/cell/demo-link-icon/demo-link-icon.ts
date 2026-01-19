// src/app/demo/pages/cell/demo-link-icon/demo-link-icon.ts
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLinkIcon } from '../../../lib/cell/td-link-icon/td-link-icon';
import { TdLinkIconModel } from '../../../lib/cell/td-link-icon/td-link-icon.model';

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
  selector: 'demo-link-icon',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLinkIcon],
  templateUrl: './demo-link-icon.html',
  styleUrl: './demo-link-icon.css',
})
export class DemoLinkIcon implements OnInit {
  jsonText = '';
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
      // ignore
    }
  }
}
