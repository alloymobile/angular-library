// src/demo/pages/tissue/td-modal-toast-demo/td-modal-toast-demo.ts

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdModalToastComponent } from '../../../../lib/components/tissue/td-modal-toast/td-modal-toast';
import { ModalToastObject } from '../../../../lib/components/tissue/td-modal-toast/td-modal-toast.model';

const DEFAULT_RAW: any = {
  id: 'tdToast01',
  title: 'Saved',
  message: 'Your changes were saved successfully.',
  type: 'success',
  autohide: true,
  delay: 3500,
  position: 'top-0 end-0'
};

@Component({
  selector: 'td-demo-td-modal-toast',
  standalone: true,
  imports: [CommonModule, TdModalToastComponent],
  templateUrl: './td-modal-toast-demo.html',
  styleUrls: ['./td-modal-toast-demo.css']
})
export class TdModalToastDemoComponent {
  @ViewChild(TdModalToastComponent) toastCmp?: TdModalToastComponent;

  inputJson = JSON.stringify(DEFAULT_RAW, null, 2);
  parseError = '';
  outputJson = '// Show/hide the toast to see output here…';

  parsed: any = DEFAULT_RAW;

  get toastModel(): ModalToastObject {
    try {
      return new ModalToastObject(this.parsed);
    } catch {
      return new ModalToastObject({ title: 'Invalid JSON', message: 'Fix JSON', type: 'error' } as any);
    }
  }

  show(): void {
    this.toastCmp?.show();
  }

  hide(): void {
    this.toastCmp?.hide();
  }

  onInputChange(val: string): void {
    this.inputJson = val;
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed = obj;
      this.parseError = '';
    } catch (e: any) {
      this.parseError = String(e?.message || e || 'Invalid JSON.');
    }
  }

  onReset(): void {
    this.parsed = DEFAULT_RAW;
    this.inputJson = JSON.stringify(DEFAULT_RAW, null, 2);
    this.parseError = '';
    this.outputJson = '// Show/hide the toast to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.parsed = obj;
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parseError = '';
    } catch {}
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }
}
