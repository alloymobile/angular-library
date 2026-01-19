import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdCardAction } from '../../../lib/tissue/td-card-action/td-card-action';
import { CardActionObject } from '../../../lib/tissue/td-card-action/td-card-action.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const CARD_ACTION_BUTTON = {
  id: 'demoCardActionBtn01',
  className: 'card border m-2 shadow',
  header: { id: 'headerBtn', className: 'card-header fw-semibold', name: 'Product Card (ButtonBar Action)' },
  body: { id: 'bodyBtn', className: 'card-body p-3' },
  fields: [
    {
      id: 'prod-img',
      colClass: 'col-12 mb-2',
      logo: { imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg', alt: 'Product', className: 'img-fluid d-block mx-auto', width: 80 },
    },
    { id: 'prod-title', colClass: 'col-12', className: 'fw-semibold fs-5 text-center', name: 'Widget Pro' },
    { id: 'prod-price', colClass: 'col-12', className: 'text-primary h5 text-center', name: '$49.99' },
    { id: 'prod-desc', colClass: 'col-12', className: 'small text-secondary text-center', name: 'High-quality widget with premium features.' },
  ],
  footer: { id: 'footerBtn', className: 'card-footer d-flex justify-content-between align-items-center py-2' },
  type: 'AlloyButtonBar',
  action: {
    type: 'AlloyButton',
    className: 'd-flex gap-2 justify-content-end w-100',
    buttonClass: '',
    buttons: [
      { id: 'wishlist', name: 'Wishlist', className: 'btn btn-outline-secondary btn-sm' },
      { id: 'addToCart', name: 'Add to Cart', className: 'btn btn-primary btn-sm' },
    ],
  },
};

const CARD_ACTION_LINK = {
  id: 'demoCardActionLink01',
  className: 'card border m-2 shadow',
  header: { id: 'headerLink', className: 'card-header fw-semibold', name: 'Article Card (LinkBar Action)' },
  body: { id: 'bodyLink', className: 'card-body p-3' },
  fields: [
    { id: 'art-title', colClass: 'col-12', className: 'fw-semibold fs-5', name: 'Getting Started with Angular' },
    { id: 'art-author', colClass: 'col-12', className: 'text-muted small mb-2', name: 'By Ada Lovelace • 5 min read' },
    { id: 'art-desc', colClass: 'col-12', className: 'small text-secondary', name: 'Learn the fundamentals of Angular framework including components, services, and routing...' },
  ],
  footer: { id: 'footerLink', className: 'card-footer d-flex justify-content-between align-items-center py-2' },
  type: 'AlloyLinkBar',
  action: {
    type: 'AlloyLinkIcon',
    className: 'd-flex gap-3 justify-content-end w-100',
    linkClass: '',
    links: [
      { id: 'share', name: 'Share', href: '#', icon: { iconClass: 'fa-solid fa-share-nodes' }, className: 'btn btn-link btn-sm p-0' },
      { id: 'bookmark', name: 'Save', href: '#', icon: { iconClass: 'fa-regular fa-bookmark' }, className: 'btn btn-link btn-sm p-0' },
      { id: 'readMore', name: 'Read More', href: '/articles/angular-intro', icon: { iconClass: 'fa-solid fa-arrow-right' }, className: 'btn btn-link btn-sm p-0' },
    ],
  },
};

const CARD_ACTION_QUANTITY = {
  id: 'demoCardActionQty01',
  className: 'card border m-2 shadow',
  header: { id: 'headerQty', className: 'card-header fw-semibold', name: 'Cart Item (with Quantity)' },
  body: { id: 'bodyQty', className: 'card-body p-3' },
  layout: 'split',
  leftColClass: 'col-4',
  rightColClass: 'col-8',
  leftFields: [
    {
      id: 'cart-img',
      colClass: 'col-12',
      logo: { imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg', alt: 'Product', className: 'img-fluid rounded' },
    },
  ],
  fields: [
    { id: 'cart-title', colClass: 'col-12', className: 'fw-semibold', name: 'Gadget X' },
    { id: 'cart-price', colClass: 'col-6', className: 'text-primary', name: '$199.99' },
    { id: 'cart-qty', colClass: 'col-6 text-end', quantity: { name: 'quantity', value: 2, min: 1, max: 10, step: 1 } },
    { id: 'cart-subtotal', colClass: 'col-12', className: 'small text-muted', name: 'Subtotal: $399.98' },
  ],
  footer: { id: 'footerQty', className: 'card-footer d-flex justify-content-end py-2' },
  type: 'AlloyButtonBar',
  action: {
    type: 'AlloyButtonIcon',
    className: 'd-flex gap-2',
    buttonClass: '',
    buttons: [
      { id: 'remove', name: 'Remove', icon: { iconClass: 'fa-solid fa-trash' }, className: 'btn btn-outline-danger btn-sm' },
      { id: 'update', name: 'Update', icon: { iconClass: 'fa-solid fa-check' }, className: 'btn btn-primary btn-sm' },
    ],
  },
};

const DEFAULT_BUTTON_JSON = JSON.stringify(CARD_ACTION_BUTTON, null, 2);
const DEFAULT_LINK_JSON = JSON.stringify(CARD_ACTION_LINK, null, 2);
const DEFAULT_QUANTITY_JSON = JSON.stringify(CARD_ACTION_QUANTITY, null, 2);

type TabKey = 'buttonBar' | 'linkBar' | 'quantity';

interface TabConfig {
  key: TabKey;
  label: string;
  defaultJson: string;
}

interface TabState {
  json: string;
  output: string;
  parseError: string;
}

@Component({
  selector: 'demo-card-action',
  standalone: true,
  imports: [CommonModule, FormsModule, TdCardAction],
  templateUrl: './demo-card-action.html',
  styleUrls: ['./demo-card-action.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoCardAction {
  readonly tagSnippet = `<td-card-action [cardAction]="cardActionModel" (output)="handleOutput($event)"></td-card-action>`;

  readonly TABS: TabConfig[] = [
    { key: 'buttonBar', label: 'ButtonBar Action', defaultJson: DEFAULT_BUTTON_JSON },
    { key: 'linkBar', label: 'LinkBar Action', defaultJson: DEFAULT_LINK_JSON },
    { key: 'quantity', label: 'With Quantity', defaultJson: DEFAULT_QUANTITY_JSON },
  ];

  activeTab: TabKey = 'buttonBar';
  defaultOutputMsg = '// Click action buttons to see output with all field values';

  tabStates: Record<TabKey, TabState> = {
    buttonBar: { json: DEFAULT_BUTTON_JSON, output: this.defaultOutputMsg, parseError: '' },
    linkBar: { json: DEFAULT_LINK_JSON, output: this.defaultOutputMsg, parseError: '' },
    quantity: { json: DEFAULT_QUANTITY_JSON, output: this.defaultOutputMsg, parseError: '' },
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find(t => t.key === this.activeTab)!;
  }

  get previewModel(): CardActionObject {
    try {
      this.tabStates[this.activeTab].parseError = '';
      return new CardActionObject(JSON.parse(this.currentTab.json));
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return this.makeFallbackCard();
    }
  }

  private makeFallbackCard(): CardActionObject {
    return new CardActionObject({
      className: 'card border m-2 shadow',
      header: { className: 'card-header bg-danger text-white', name: 'Error' },
      body: { className: 'card-body p-3' },
      fields: [{ className: 'text-danger', colClass: 'col-12', name: 'Could not parse input JSON.' }],
      footer: { className: 'card-footer' },
      action: { buttons: [] },
    });
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  onJsonChange(value: string): void {
    this.tabStates[this.activeTab].json = value;
    this.cdr.markForCheck();
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabStates[this.activeTab].output = JSON.stringify(payload, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(): void {
    const config = this.currentTabConfig;
    this.tabStates[this.activeTab].json = config.defaultJson;
    this.tabStates[this.activeTab].parseError = '';
    this.tabStates[this.activeTab].output = this.defaultOutputMsg;
    this.cdr.markForCheck();
  }

  clearOutput(): void {
    this.tabStates[this.activeTab].output = this.defaultOutputMsg;
    this.cdr.markForCheck();
  }
}
