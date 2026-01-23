// demo-button-icon/demo-button-icon.ts
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdButtonIcon } from '../../../lib/cell/td-button-icon/td-button-icon';
import { TdButtonIconModel } from '../../../lib/cell/td-button-icon/td-button-icon.model';
import { TdIconModel } from '../../../lib/cell/td-icon/td-icon.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_WITH_LABEL = {
  id: 'tdBtnIcon01',
  name: 'Sync',
  title: 'Sync',
  className: 'btn btn-primary',
  isActive: false,
  active: 'active',
  disabled: false,
  ariaLabel: 'Sync now',
  tabIndex: 0,
  icon: new TdIconModel({
    iconClass: 'fa-solid fa-rotate',
    className: 'd-inline-flex align-items-center justify-content-center bg-light rounded-circle p-2',
  }),
};

const DEFAULT_ICON_ONLY = {
  id: 'tdBtnIcon02',
  // no name => icon-only
  title: 'Sync',
  className: 'btn btn-outline-primary',
  isActive: false,
  active: 'active',
  disabled: false,
  ariaLabel: 'Sync now',
  tabIndex: 0,
  icon: new TdIconModel({
    iconClass: 'fa-solid fa-rotate',
    className: 'd-inline-flex align-items-center justify-content-center bg-light rounded-circle p-2',
  }),
};

type DemoTab = 'label' | 'iconOnly';

@Component({
  selector: 'demo-button-icon',
  standalone: true,
  imports: [CommonModule, FormsModule, TdButtonIcon],
  templateUrl: './demo-button-icon.html',
  styleUrl: './demo-button-icon.css',
})
export class DemoButtonIcon implements OnInit {
  tab = signal<DemoTab>('label');

  inputJson = '';
  parseError = signal('');
  outputJson = signal('// Click the button to see output here…');
  parsed = signal<any>(DEFAULT_WITH_LABEL);

  outputShape = `{
  "id": "tdBtnIcon01",
  "type": "button-icon",
  "action": "click",
  "error": false,
  "data": {
    "name": "Sync" // name if provided, otherwise title
  }
}`;

  model = computed(() => {
    try {
      const safe = this.parsed() && typeof this.parsed() === 'object' ? this.parsed() : {};
      return new TdButtonIconModel(safe);
    } catch (err: any) {
      return new TdButtonIconModel({
        title: 'Invalid config',
        ariaLabel: 'Invalid config',
        className: 'btn btn-secondary',
        disabled: true,
        icon: new TdIconModel({
          iconClass: 'fa-solid fa-triangle-exclamation',
          className: 'd-inline-flex align-items-center justify-content-center bg-light rounded-circle p-2',
        }),
      });
    }
  });

  ngOnInit(): void {
    this.setTab('label');
  }

  setTab(next: DemoTab): void {
    this.tab.set(next);

    const obj = next === 'label' ? DEFAULT_WITH_LABEL : DEFAULT_ICON_ONLY;

    this.parsed.set(obj);
    this.inputJson = JSON.stringify(obj, null, 2);
    this.parseError.set('');
    this.outputJson.set('// Click the button to see output here…');
  }

  toggleActive(): void {
    const current = this.parsed();
    const next = { ...(current || {}), isActive: !current?.isActive };
    this.parsed.set(next);
    this.inputJson = JSON.stringify(next, null, 2);
    this.parseError.set('');
  }

  handleInputChange(val: string): void {
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed.set(obj);
      this.parseError.set('');
    } catch (err: any) {
      this.parseError.set(err.message || 'Invalid JSON.');
    }
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.outputJson.set(JSON.stringify(payload, null, 2));
  }

  handleReset(): void {
    this.setTab(this.tab());
  }

  handleFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson);
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parsed.set(obj);
      this.parseError.set('');
    } catch {
      // ignore
    }
  }

  clearOutput(): void {
    this.outputJson.set('// cleared');
  }
}
