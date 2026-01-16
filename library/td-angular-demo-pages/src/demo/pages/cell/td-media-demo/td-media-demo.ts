// src/demo/pages/tdmedia/tdmedia.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdMediaComponent } from '../../../../lib/components/cell/td-media/td-media';
import { MediaObject } from '../../../../lib/components/cell/td-media/td-media.model';

const DEFAULT_RAW: any = { name: "Demo" };
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-media',
  standalone: true,
  imports: [CommonModule, TdMediaComponent],
  templateUrl: './td-media-demo.html',
  styleUrls: ['./td-media-demo.css']
})
export class TdMediaDemoComponent {
  title = 'TdMedia';
  usageSnippet = `<td-media [media]="model" (output)="handleOutput($event)"></td-media>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): MediaObject {
    try {
      return new MediaObject(this.parsed);
    } catch (e: any) {
      return new MediaObject({ id: 'invalid', name: 'Invalid', items: [] });
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
