// src/demo/pages/tissue/td-card-action-demo/td-card-action-demo.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdCardActionComponent } from '../../../../lib/components/tissue/td-card-action/td-card-action';
import { CardActionObject } from '../../../../lib/components/tissue/td-card-action/td-card-action.model';

const DEFAULT_RAW: any = {
  "id": "tdCardAction01",
  "className": "",
  "actionsPosition": "bottom",
  "card": {
    "id": "tdCard01",
    "className": "card border shadow-sm",
    "name": "Ada Lovelace",
    "description": "Admin \u00b7 Active since 2020",
    "tags": [
      {
        "id": "tag1",
        "name": "Active",
        "className": "badge bg-success"
      },
      {
        "id": "tag2",
        "name": "Admin",
        "className": "badge bg-primary"
      }
    ]
  },
  "actions": {
    "type": "TdButton",
    "className": "nav gap-2",
    "buttonClass": "nav-item",
    "selected": "active",
    "title": {
      "name": "Actions",
      "className": "fw-semibold me-2"
    },
    "buttons": [
      {
        "id": "edit",
        "name": "Edit",
        "className": "btn btn-sm btn-outline-primary"
      },
      {
        "id": "delete",
        "name": "Delete",
        "className": "btn btn-sm btn-outline-danger"
      }
    ]
  }
};
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-card-action',
  standalone: true,
  imports: [CommonModule, TdCardActionComponent],
  templateUrl: './td-card-action-demo.html',
  styleUrls: ['./td-card-action-demo.css']
})
export class TdCardActionDemoComponent {
  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Click an action button to see output here…';

  parsed: any = DEFAULT_RAW;

  get model(): CardActionObject {
    try {
      return new CardActionObject(this.parsed);
    } catch {
      return new CardActionObject({ card: { name: 'Invalid' }, actions: { buttons: [] } } as any);
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
    this.outputJson = '// Click an action button to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parsed = obj;
      this.parseError = '';
    } catch {}
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }
}
