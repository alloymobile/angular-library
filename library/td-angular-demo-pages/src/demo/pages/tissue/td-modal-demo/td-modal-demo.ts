// src/demo/pages/tissue/td-modal-demo/td-modal-demo.ts

import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdModalComponent } from '../../../../lib/components/tissue/td-modal/td-modal';
import { ModalObject } from '../../../../lib/components/tissue/td-modal/td-modal.model';

const DEFAULT_RAW: any = {
  id: 'tdModal01',
  title: 'TdModal Demo',
  className: 'modal fade',
  centered: true,
  scrollable: false,
  staticBackdrop: false,
  closeButton: true,
  visible: false
};

@Component({
  selector: 'td-demo-td-modal',
  standalone: true,
  imports: [CommonModule, TdModalComponent],
  templateUrl: './td-modal-demo.html',
  styleUrls: ['./td-modal-demo.css']
})
export class TdModalDemoComponent {
  @ViewChild(TdModalComponent) modalCmp?: TdModalComponent;

  inputJson = JSON.stringify(DEFAULT_RAW, null, 2);
  parseError = '';
  outputJson = '// Open/close the modal to see output here…';

  parsed: any = DEFAULT_RAW;

  get modalModel(): ModalObject {
    try {
      return new ModalObject(this.parsed);
    } catch {
      return new ModalObject({ title: 'Invalid JSON', visible: false } as any);
    }
  }

  open(): void {
    this.parsed = { ...this.parsed, visible: true };
    this.inputJson = JSON.stringify(this.parsed, null, 2);
  }

  close(): void {
    this.parsed = { ...this.parsed, visible: false };
    this.inputJson = JSON.stringify(this.parsed, null, 2);
    this.modalCmp?.hide();
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
    this.outputJson = '// Open/close the modal to see output here…';
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
