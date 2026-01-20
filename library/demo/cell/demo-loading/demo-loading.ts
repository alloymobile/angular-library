// demo-loading/demo-loading.ts
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdLoading } from '../../../lib/cell/td-loading/td-loading';
import { TdLoadingModel } from '../../../lib/cell/td-loading/td-loading.model';
import { TdIconModel } from '../../../lib/cell/td-icon/td-icon.model';

const DEFAULT_OBJ = {
  id: 'tdLoading1',
  message: 'Loading data...',
  icon: new TdIconModel({
    iconClass: 'fa-solid fa-spinner fa-3x fa-spin',
    className: '',
  }),
  overlayClass:
    'd-flex align-items-center justify-content-center bg-dark bg-opacity-25 w-100 h-100 rounded',
  contentClass: 'text-center p-4 rounded bg-white shadow',
  messageClass: 'mt-3 text-muted',
  ariaLabel: 'Loading demo overlay',
  visible: true,
};

@Component({
  selector: 'demo-loading',
  standalone: true,
  imports: [CommonModule, FormsModule, TdLoading],
  templateUrl: './demo-loading.html',
  styleUrl: './demo-loading.css',
})
export class DemoLoading implements OnInit {
  jsonText = '';
  error = signal('');
  parsed = signal<any>(DEFAULT_OBJ);

  ngOnInit(): void {
    this.jsonText = JSON.stringify(DEFAULT_OBJ, null, 2);
  }

  isVisible = computed(() => {
    const data = this.parsed();
    return typeof data?.visible === 'boolean' ? data.visible : true;
  });

  // IMPORTANT: computed must be pure (NO error.set() inside)
  loading = computed(() => {
    try {
      return new TdLoadingModel(this.parsed());
    } catch {
      return new TdLoadingModel(DEFAULT_OBJ);
    }
  });

  handleChange(val: string): void {
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed.set(obj);
      this.error.set('');
    } catch (e: any) {
      this.error.set(String(e?.message || e));
    }
  }

  formatJson(): void {
    try {
      const obj = JSON.parse(this.jsonText);
      this.jsonText = JSON.stringify(obj, null, 2);
      this.parsed.set(obj);
      this.error.set('');
    } catch {
      // ignore until user fixes JSON
    }
  }

  toggleVisibleInJson(): void {
    try {
      const obj = JSON.parse(this.jsonText || '{}');
      const current = typeof obj.visible === 'boolean' ? obj.visible : true;
      obj.visible = !current;
      this.jsonText = JSON.stringify(obj, null, 2);
      this.parsed.set(obj);
      this.error.set('');
    } catch {
      // ignore
    }
  }
}
