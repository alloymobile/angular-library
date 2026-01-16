// src/demo/pages/tdquantity/tdquantity.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdQuantityComponent } from '../../../../lib/components/cell/td-quantity/td-quantity';
import { QuantityObject } from '../../../../lib/components/cell/td-quantity/td-quantity.model';

const DEFAULT_RAW: any = {
    label: "Quantity",
    colClass: "col-12 col-md-6 col-lg-4 mx-auto",
    className: "",

    name: "quantity",
    value: 1,
    min: 1,
    max: 8,
    step: 1,

    disabled: false,
    showRange: true,

    input: {
      type: "number",
      label: "",
      layout: "text",
      className: "form-control text-center"
    },

    decrease: {
      className: "btn btn-light text-muted",
      icon: { iconClass: "fa-solid fa-minus" },
      title: "Decrease",
      ariaLabel: "Decrease quantity"
    },

    increase: {
      className: "btn btn-light text-muted",
      icon: { iconClass: "fa-solid fa-plus" },
      title: "Increase",
      ariaLabel: "Increase quantity"
    }
  };
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-quantity',
  standalone: true,
  imports: [CommonModule, TdQuantityComponent],
  templateUrl: './td-quantity-demo.html',
  styleUrls: ['./td-quantity-demo.css']
})
export class TdQuantityDemoComponent {
  title = 'TdQuantity';
  usageSnippet = `<td-quantity [quantity]="model" (output)="handleOutput($event)"></td-quantity>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): QuantityObject {
    try {
      return new QuantityObject(this.parsed);
    } catch (e: any) {
      return new QuantityObject({ id: 'qty', name: 'Qty', value: 1 });
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
