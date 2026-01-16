// src/demo/pages/tdlink/tdlink.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdLinkComponent } from '../../../../lib/components/cell/td-link/td-link';
import { LinkObject } from '../../../../lib/components/cell/td-link/td-link.model';

const DEFAULT_RAW: any = { name: "Demo" };
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-link',
  standalone: true,
  imports: [CommonModule, TdLinkComponent],
  templateUrl: './td-link-demo.html',
  styleUrls: ['./td-link-demo.css']
})
export class TdLinkDemoComponent {
  title = 'TdLink';
  usageSnippet = `<td-link [link]="model" (output)="handleOutput($event)"></td-link>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): LinkObject {
    try {
      return new LinkObject(this.parsed);
    } catch (e: any) {
      return new LinkObject({ name: 'Invalid config', href: '#', className: 'btn btn-link' });
    }
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
    this.inputJson = DEFAULT_JSON;
    this.parsed = DEFAULT_RAW;
    this.parseError = '';
    this.outputJson = '// Interact with the component to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parsed = obj;
      this.parseError = '';
    } catch {
      // ignore
    }
  }

  onClearOutput(): void {
    this.outputJson = '// cleared';
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }

}

function to_pascal(s: string): string {
  return s.split('-').map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '').join('');
}
