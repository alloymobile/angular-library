import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdTableAction } from '../../../../lib/tissue/td-table-action/td-table-action';
import { TableActionObject } from '../../../../lib/tissue/td-table-action/td-table-action.model';
import { OutputObject } from '../../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const DEFAULT_TABLE_ACTION = JSON.stringify(
  {
    id: 'vendorTable01',
    name: 'Vendors',
    className: 'table table-hover align-middle',
    link: '/vendors/{id}',
    rows: [
      { id: 1, slug: 'acme', name: 'ACME Corp', category: 'Supplies', status: 'Active' },
      { id: 2, slug: 'globex', name: 'Globex Inc', category: 'Services', status: 'Pending' },
      { id: 3, slug: 'initech', name: 'Initech', category: 'Consulting', status: 'Active' },
    ],
    actions: {
      type: 'AlloyButtonIcon',
      className: 'd-flex gap-1 justify-content-end',
      buttonClass: '',
      buttons: [
        {
          id: 'edit',
          name: '',
          icon: { iconClass: 'fa-solid fa-pen-to-square' },
          className: 'btn btn-sm btn-outline-primary',
          ariaLabel: 'Edit',
          title: 'Edit',
        },
        {
          id: 'delete',
          name: '',
          icon: { iconClass: 'fa-solid fa-trash' },
          className: 'btn btn-sm btn-outline-danger',
          ariaLabel: 'Delete',
          title: 'Delete',
        },
      ],
    },
  },
  null,
  2
);

const DEFAULT_TABLE_NO_LINK = JSON.stringify(
  {
    id: 'productTable01',
    name: 'Products',
    className: 'table table-striped align-middle',
    rows: [
      { id: 101, sku: 'WDG-001', name: 'Widget Pro', price: '$49.99', stock: 150 },
      { id: 102, sku: 'WDG-002', name: 'Widget Basic', price: '$29.99', stock: 300 },
      { id: 103, sku: 'GAD-001', name: 'Gadget X', price: '$199.99', stock: 45 },
    ],
    actions: {
      type: 'AlloyButtonIcon',
      className: 'd-flex gap-1 justify-content-end',
      buttonClass: '',
      buttons: [
        {
          id: 'view',
          name: '',
          icon: { iconClass: 'fa-solid fa-eye' },
          className: 'btn btn-sm btn-outline-secondary',
          ariaLabel: 'View',
          title: 'View details',
        },
        {
          id: 'addToCart',
          name: '',
          icon: { iconClass: 'fa-solid fa-cart-plus' },
          className: 'btn btn-sm btn-outline-success',
          ariaLabel: 'Add to cart',
          title: 'Add to cart',
        },
      ],
    },
  },
  null,
  2
);

type TabType = 'withLink' | 'noLink';

interface TabState {
  json: string;
  output: string;
  parseError: string;
  model: TableActionObject;
}

@Component({
  selector: 'demo-table-action',
  standalone: true,
  imports: [CommonModule, FormsModule, TdTableAction],
  templateUrl: './demo-table-action.html',
  styleUrls: ['./demo-table-action.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoTableAction {
  activeTab: TabType = 'withLink';

  readonly tagSnippet = `<td-table-action [tableAction]="tableActionModel" (output)="handleOutput($event)"></td-table-action>`;

  tabs: Record<TabType, TabState> = {
    withLink: this.createTabState(DEFAULT_TABLE_ACTION),
    noLink: this.createTabState(DEFAULT_TABLE_NO_LINK),
  };

  constructor(private cdr: ChangeDetectorRef) {}

  private createTabState(json: string): TabState {
    return {
      json,
      output: '// Click header to sort, row to navigate, or action button to emit…',
      parseError: '',
      model: this.parseModel(json),
    };
  }

  private parseModel(json: string): TableActionObject {
    try {
      const parsed = JSON.parse(json);
      return new TableActionObject(parsed);
    } catch (e) {
      return new TableActionObject({
        name: 'Invalid JSON',
        className: 'table table-striped',
        rows: [],
      });
    }
  }

  get currentTab(): TabState {
    return this.tabs[this.activeTab];
  }

  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  onJsonChange(value: string): void {
    const tab = this.tabs[this.activeTab];
    tab.json = value;
    try {
      tab.parseError = '';
      tab.model = new TableActionObject(JSON.parse(value));
    } catch (e: any) {
      tab.parseError = e.message || String(e);
    }
    this.cdr.markForCheck();
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabs[this.activeTab].output = JSON.stringify(payload, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(): void {
    const defaults: Record<TabType, string> = {
      withLink: DEFAULT_TABLE_ACTION,
      noLink: DEFAULT_TABLE_NO_LINK,
    };
    const tab = this.tabs[this.activeTab];
    tab.json = defaults[this.activeTab];
    tab.parseError = '';
    tab.output = '// Click header to sort, row to navigate, or action button to emit…';
    tab.model = this.parseModel(tab.json);
    this.cdr.markForCheck();
  }

  clearOutput(): void {
    this.tabs[this.activeTab].output = '// cleared';
    this.cdr.markForCheck();
  }

  getTabLabel(tab: TabType): string {
    return tab === 'withLink' ? 'With Row Link' : 'Without Link';
  }
}
