import { Component, ChangeDetectorRef, OnChanges, SimpleChanges, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdCardAction } from '../../../lib/tissue/td-card-action/td-card-action';
import { TdCardActionModel } from '../../../lib/tissue/td-card-action/td-card-action.model';
import { OutputObject } from '../../../lib/share';

import { TdButtonBarModel } from '../../../lib/tissue/td-button-bar/td-button-bar.model';
import { TdLinkBarModel } from '../../../lib/tissue/td-link-bar/td-link-bar.model';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */
/* NOTE: action is MODEL ONLY now. Demo hydrates action model separately. */

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
  type: 'AlloyButtonBar'
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
  type: 'AlloyLinkBar'
};

/* quantity removed from BlockObject / td-card-action rendering */
const CARD_ACTION_SPLIT = {
  id: 'demoCardActionSplit01',
  className: 'card border m-2 shadow',
  header: { id: 'headerSplit', className: 'card-header fw-semibold', name: 'Split Card (Action in Footer)' },
  body: { id: 'bodySplit', className: 'card-body p-3' },
  layout: 'split',
  leftColClass: 'col-4',
  rightColClass: 'col-8',
  leftFields: [
    {
      id: 'split-img',
      colClass: 'col-12',
      logo: { imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg', alt: 'Product', className: 'img-fluid rounded' },
    },
  ],
  fields: [
    { id: 'split-title', colClass: 'col-12', className: 'fw-semibold', name: 'Gadget X' },
    { id: 'split-price', colClass: 'col-12', className: 'text-primary', name: '$199.99' },
    { id: 'split-note', colClass: 'col-12', className: 'small text-muted', name: 'Action bar below triggers output.' },
  ],
  footer: { id: 'footerSplit', className: 'card-footer d-flex justify-content-end py-2' },
  type: 'AlloyButtonBar'
};

const BUTTON_ACTION_MODEL_CFG = {
  type: 'AlloyButton',
  className: 'd-flex gap-2 justify-content-end w-100',
  buttonClass: '',
  buttons: [
    { id: 'wishlist', name: 'Wishlist', className: 'btn btn-outline-secondary btn-sm' },
    { id: 'addToCart', name: 'Add to Cart', className: 'btn btn-primary btn-sm' },
  ],
};

const LINK_ACTION_MODEL_CFG = {
  type: 'AlloyLinkIcon',
  className: 'd-flex gap-3 justify-content-end w-100',
  linkClass: '',
  links: [
    { id: 'share', name: 'Share', href: '#', icon: { iconClass: 'fa-solid fa-share-nodes' }, className: 'btn btn-link btn-sm p-0' },
    { id: 'bookmark', name: 'Save', href: '#', icon: { iconClass: 'fa-regular fa-bookmark' }, className: 'btn btn-link btn-sm p-0' },
    { id: 'readMore', name: 'Read More', href: '/articles/angular-intro', icon: { iconClass: 'fa-solid fa-arrow-right' }, className: 'btn btn-link btn-sm p-0' },
  ],
};

const SPLIT_ACTION_MODEL_CFG = {
  type: 'AlloyButtonIcon',
  className: 'd-flex gap-2',
  buttonClass: '',
  buttons: [
    { id: 'remove', name: 'Remove', icon: { iconClass: 'fa-solid fa-trash' }, className: 'btn btn-outline-danger btn-sm' },
    { id: 'update', name: 'Update', icon: { iconClass: 'fa-solid fa-check' }, className: 'btn btn-primary btn-sm' },
  ],
};

const DEFAULT_BUTTON_JSON = JSON.stringify(CARD_ACTION_BUTTON, null, 2);
const DEFAULT_LINK_JSON = JSON.stringify(CARD_ACTION_LINK, null, 2);
const DEFAULT_SPLIT_JSON = JSON.stringify(CARD_ACTION_SPLIT, null, 2);

type TabKey = 'buttonBar' | 'linkBar' | 'split';

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
  styleUrls: ['./demo-card-action.css']
})
export class DemoCardAction {
  readonly tagSnippet =
    `<td-card-action [cardAction]="cardActionModel" (output)="handleOutput($event)"></td-card-action>`;

  readonly TABS: TabConfig[] = [
    { key: 'buttonBar', label: 'ButtonBar Action', defaultJson: DEFAULT_BUTTON_JSON },
    { key: 'linkBar', label: 'LinkBar Action', defaultJson: DEFAULT_LINK_JSON },
    { key: 'split', label: 'Split Layout', defaultJson: DEFAULT_SPLIT_JSON }
  ];

  activeTab: TabKey = 'buttonBar';
  defaultOutputMsg = '// Click action buttons/links to see output with all field values';

  tabStates: Record<TabKey, TabState> = {
    buttonBar: { json: DEFAULT_BUTTON_JSON, output: this.defaultOutputMsg, parseError: '' },
    linkBar: { json: DEFAULT_LINK_JSON, output: this.defaultOutputMsg, parseError: '' },
    split: { json: DEFAULT_SPLIT_JSON, output: this.defaultOutputMsg, parseError: '' }
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find(t => t.key === this.activeTab)!;
  }

  get cardActionModel(): TdCardActionModel {
    try {
      this.tabStates[this.activeTab].parseError = '';

      const base = JSON.parse(this.currentTab.json);

      const type = typeof base.type === 'string' ? base.type : 'AlloyButtonBar';

      const actionModel =
        type === 'AlloyLinkBar'
          ? new TdLinkBarModel(LINK_ACTION_MODEL_CFG as any)
          : type === 'AlloyButtonBar' && this.activeTab === 'split'
            ? new TdButtonBarModel(SPLIT_ACTION_MODEL_CFG as any)
            : new TdButtonBarModel(BUTTON_ACTION_MODEL_CFG as any);

      return new TdCardActionModel({
        ...base,
        type,
        action: actionModel
      });
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return this.makeFallbackCard();
    }
  }

  private makeFallbackCard(): TdCardActionModel {
    const fallbackAction = new TdButtonBarModel({ type: 'AlloyButton', className: '', buttons: [] } as any);

    return new TdCardActionModel({
      className: 'card border m-2 shadow',
      header: { className: 'card-header bg-danger text-white', name: 'Error' },
      body: { className: 'card-body p-3' },
      fields: [{ className: 'text-danger', colClass: 'col-12', name: 'Could not parse input JSON.' }],
      footer: { className: 'card-footer' },
      type: 'AlloyButtonBar',
      action: fallbackAction
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
