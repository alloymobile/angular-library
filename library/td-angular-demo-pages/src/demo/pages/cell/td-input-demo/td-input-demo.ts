import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdInputComponent } from '../../../../lib/components/cell/td-input/td-input';
import { InputObject } from '../../../../lib/components/cell/td-input/td-input.model';
import { TdInputDemoExample, TdInputDemoKey } from './td-input-demo.model';

const EXAMPLES: TdInputDemoExample[] = [
  {
    key: 'text',
    title: 'Text',
    raw: {
      name: 'fullName',
      type: 'text',
      label: 'Full name',
      placeholder: 'Enter full name',
      className: 'form-control',
      colClass: 'col-12 col-md-6 mx-auto',
      required: true,
      minLength: 2,
      maxLength: 40,
      layout: 'text'
    }
  },
  {
    key: 'icon',
    title: 'Icon',
    raw: {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'name@example.com',
      className: 'form-control',
      colClass: 'col-12 col-md-6 mx-auto',
      required: true,
      layout: 'icon',
      icon: { iconClass: 'fa-solid fa-envelope' }
    }
  },
  {
    key: 'floating',
    title: 'Floating',
    raw: {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Password',
      className: 'form-control',
      colClass: 'col-12 col-md-6 mx-auto',
      required: true,
      layout: 'floating',
      icon: { iconClass: 'fa-solid fa-lock' },
      passwordStrength: true
    }
  }
];

@Component({
  selector: 'td-demo-td-input',
  standalone: true,
  imports: [CommonModule, TdInputComponent],
  templateUrl: './td-input-demo.html',
  styleUrls: ['./td-input-demo.css']
})
export class TdInputDemoComponent {
  usageSnippet = `<td-input [input]="model" (output)="handleOutput($event)"></td-input>`;

  examples = EXAMPLES;
  activeKey: TdInputDemoKey = 'text';

  private rawByKey: Record<TdInputDemoKey, any> = {
    text: EXAMPLES.find(e => e.key === 'text')!.raw,
    icon: EXAMPLES.find(e => e.key === 'icon')!.raw,
    floating: EXAMPLES.find(e => e.key === 'floating')!.raw
  };

  private jsonByKey: Record<TdInputDemoKey, string> = {
    text: JSON.stringify(this.rawByKey.text, null, 2),
    icon: JSON.stringify(this.rawByKey.icon, null, 2),
    floating: JSON.stringify(this.rawByKey.floating, null, 2)
  };

  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  get inputJson(): string {
    return this.jsonByKey[this.activeKey];
  }

  set inputJson(val: string) {
    this.jsonByKey[this.activeKey] = val;
  }

  get parsed(): any {
    return this.rawByKey[this.activeKey];
  }

  set parsed(val: any) {
    this.rawByKey[this.activeKey] = val;
  }

  get model(): InputObject {
    try {
      return new InputObject(this.parsed);
    } catch {
      return new InputObject({
        name: 'invalid',
        label: 'Invalid',
        type: 'text',
        className: 'form-control',
        placeholder: 'Fix JSON',
        layout: 'text'
      } as any);
    }
  }

  setActive(key: TdInputDemoKey): void {
    this.activeKey = key;
    this.parseError = '';
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
    const example = this.examples.find(e => e.key === this.activeKey)!;
    this.parsed = example.raw;
    this.inputJson = JSON.stringify(example.raw, null, 2);
    this.parseError = '';
    this.outputJson = '// Interact with the component to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.parsed = obj;
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parseError = '';
    } catch {}
  }

  onClearOutput(): void {
    this.outputJson = '// cleared';
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }
}
