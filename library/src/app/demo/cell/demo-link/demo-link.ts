// src/app/demo/pages/cell/demo-link/demo-link.ts
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLink } from '../../../lib/cell/td-link/td-link';
import { TdLinkModel } from '../../../lib/cell/td-link/td-link.model';

const DEFAULT_OBJ = {
  id: 'tdLink1',
  name: 'Open Docs',
  href: 'https://angular.dev/',
  className: 'link px-2 py-1 rounded',
  active: '',
  target: '_blank',
  title: 'Angular documentation',
};

@Component({
  selector: 'demo-link',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLink],
  templateUrl: './demo-link.html',
  styleUrl: './demo-link.css',
})
export class DemoLink implements OnInit {
  jsonText = '';
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

  ngOnInit(): void {
    this.jsonText = JSON.stringify(DEFAULT_OBJ, null, 2);
  }

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
