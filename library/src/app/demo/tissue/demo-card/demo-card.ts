import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdCard } from '../../../lib/tissue/td-card/td-card';
import { CardObject } from '../../../lib/tissue/td-card/td-card.model';
import { OutputObject } from '../../../lib/share';

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const CARD_TEXT_ONLY = {
  id: 'demoTextCard01',
  className: 'card border m-2 shadow',
  header: { id: 'demoTextHeader', className: 'card-header fw-semibold', name: 'Simple Text Card' },
  body: { id: 'demoTextBody', className: 'card-body p-3' },
  fields: [
    { id: 'txt-title', colClass: 'col-12', className: 'fw-semibold fs-5 mb-1', name: 'Ada Lovelace' },
    { id: 'txt-role', colClass: 'col-12', className: 'text-muted mb-1', name: 'Pioneer of computing' },
    { id: 'txt-note', colClass: 'col-12', className: 'small text-secondary', name: 'This card demonstrates a simple layout with only text fields.' },
  ],
  footer: { id: 'demoTextFooter', className: 'card-footer text-muted small', name: 'Footer (optional) — text only' },
};

const CARD_ICON_TEXT = {
  id: 'demoIconTextCard01',
  className: 'card border m-2 shadow',
  header: { id: 'demoIconTextHeader', className: 'card-header fw-semibold', name: 'Icon + Text Card' },
  body: { id: 'demoIconTextBody', className: 'card-body p-3' },
  fields: [
    { id: 'icon-user', colClass: 'col-auto d-flex align-items-center', className: 'me-2', icon: { iconClass: 'fa-solid fa-user fa-2x' } },
    { id: 'icon-title', colClass: 'col', className: 'fw-semibold fs-5 mb-1', name: 'User Profile' },
    { id: 'icon-desc', colClass: 'col-12', className: 'small text-secondary mb-1', name: 'This card shows how to combine an icon field and a text field in the same row using Bootstrap grid classes.' },
  ],
  footer: { id: 'demoIconTextFooter', className: 'card-footer text-muted small', name: 'Icon and text are separate fields.' },
};

const CARD_IMAGE_TEXT = {
  id: 'demoImageTextCard01',
  className: 'card border m-2 shadow',
  header: { id: 'demoImageTextHeader', className: 'card-header fw-semibold', name: 'Image + Text Card' },
  body: { id: 'demoImageTextBody', className: 'card-body p-3' },
  fields: [
    {
      id: 'img-logo',
      colClass: 'col-12',
      className: 'mb-2',
      logo: { imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg', alt: 'Angular logo', className: 'img-fluid d-block mx-auto', width: 100, height: 100 },
    },
    { id: 'img-title', colClass: 'col-12', className: 'fw-semibold fs-5 mb-1 text-center', name: 'Angular' },
    { id: 'img-desc', colClass: 'col-12', className: 'small text-secondary text-center', name: 'This card demonstrates how a field with a LogoObject is rendered as a responsive image above supporting text.' },
  ],
  footer: { id: 'demoImageTextFooter', className: 'card-footer text-muted small', name: 'Logo fields use LogoObject under the hood.' },
};

const CARD_TAGS_STACK = {
  id: 'demoTagsCard01',
  className: 'card border m-2 shadow',
  header: { id: 'demoTagsHeader', className: 'card-header fw-semibold', name: 'Tags Stack Card' },
  body: { id: 'demoTagsBody', className: 'card-body p-3' },
  fields: [
    {
      id: 'tags-img',
      colClass: 'col-4',
      className: 'd-flex align-items-start',
      logo: { imageUrl: 'https://angular.io/assets/images/logos/angular/angular.svg', alt: 'Angular logo', className: 'img-fluid rounded', width: 80 },
    },
    {
      id: 'tags-lines',
      colClass: 'col-8',
      className: 'd-flex flex-column',
      tags: [
        { id: 'tags-title', name: 'Angular', className: 'fw-semibold' },
        { id: 'tags-sub', name: 'Component library', className: 'text-secondary small' },
        { id: 'tags-meta', name: 'Image left • 3 lines right (tags stack)', className: 'text-secondary small' },
      ],
    },
  ],
  footer: { id: 'demoTagsFooter', className: 'card-footer text-muted small', name: 'Fields can render `tags` (TagObject[]) as a vertical stack.' },
};

const CARD_QUANTITY = {
  id: 'demoQuantityCard01',
  className: 'card border m-2 shadow',
  header: { id: 'demoQuantityHeader', className: 'card-header fw-semibold', name: 'Quantity Field Card' },
  body: { id: 'demoQuantityBody', className: 'card-body p-3' },
  fields: [
    { id: 'qty-title', colClass: 'col-12', className: 'fw-semibold fs-5 mb-2', name: 'Widget Pro' },
    { id: 'qty-price', colClass: 'col-6', className: 'text-primary h5', name: '$49.99' },
    { id: 'qty-field', colClass: 'col-6 text-end', quantity: { name: 'qty', value: 1, min: 1, max: 10, step: 1 } },
    { id: 'qty-desc', colClass: 'col-12', className: 'small text-secondary mt-2', name: 'Use + / - to adjust quantity. Emits via output callback.' },
  ],
  footer: { id: 'demoQuantityFooter', className: 'card-footer text-muted small', name: 'Quantity fields use QuantityObject.' },
};

const CARD_BUTTON_ICON = {
  id: 'demoButtonIconCard01',
  className: 'card border m-2 shadow',
  header: { id: 'demoButtonIconHeader', className: 'card-header fw-semibold', name: 'ButtonIcon Field Card' },
  body: { id: 'demoButtonIconBody', className: 'card-body p-3' },
  fields: [
    { id: 'btnI-title', colClass: 'col-12', className: 'fw-semibold fs-5 mb-2', name: 'Actions' },
    {
      id: 'btnI-edit',
      colClass: 'col-auto',
      buttonIcon: { id: 'editBtn', name: 'Edit', icon: { iconClass: 'fa-solid fa-pen-to-square' }, className: 'btn btn-outline-primary' },
    },
    {
      id: 'btnI-delete',
      colClass: 'col-auto',
      buttonIcon: { id: 'deleteBtn', name: 'Delete', icon: { iconClass: 'fa-solid fa-trash' }, className: 'btn btn-outline-danger' },
    },
    { id: 'btnI-desc', colClass: 'col-12', className: 'small text-secondary mt-2', name: 'Clicking these buttons emits via output callback.' },
  ],
  footer: { id: 'demoButtonIconFooter', className: 'card-footer text-muted small', name: 'ButtonIcon fields for inline actions.' },
};

const DEFAULT_TEXT_ONLY_JSON = JSON.stringify(CARD_TEXT_ONLY, null, 2);
const DEFAULT_ICON_TEXT_JSON = JSON.stringify(CARD_ICON_TEXT, null, 2);
const DEFAULT_IMAGE_TEXT_JSON = JSON.stringify(CARD_IMAGE_TEXT, null, 2);
const DEFAULT_TAGS_STACK_JSON = JSON.stringify(CARD_TAGS_STACK, null, 2);
const DEFAULT_QUANTITY_JSON = JSON.stringify(CARD_QUANTITY, null, 2);
const DEFAULT_BUTTON_ICON_JSON = JSON.stringify(CARD_BUTTON_ICON, null, 2);

type TabKey = 'text' | 'icontext' | 'imagetext' | 'tags' | 'quantity' | 'buttonicon';

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
  selector: 'demo-card',
  standalone: true,
  imports: [CommonModule, FormsModule, TdCard],
  templateUrl: './demo-card.html',
  styleUrls: ['./demo-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoCard {
  readonly tagSnippet = `<td-card [card]="cardModel" (output)="handleOutput($event)"></td-card>`;

  readonly TABS: TabConfig[] = [
    { key: 'text', label: 'Text Only', defaultJson: DEFAULT_TEXT_ONLY_JSON },
    { key: 'icontext', label: 'Icon + Text', defaultJson: DEFAULT_ICON_TEXT_JSON },
    { key: 'imagetext', label: 'Image + Text', defaultJson: DEFAULT_IMAGE_TEXT_JSON },
    { key: 'tags', label: 'Tags', defaultJson: DEFAULT_TAGS_STACK_JSON },
    { key: 'quantity', label: 'Quantity', defaultJson: DEFAULT_QUANTITY_JSON },
    { key: 'buttonicon', label: 'ButtonIcon', defaultJson: DEFAULT_BUTTON_ICON_JSON },
  ];

  activeTab: TabKey = 'text';
  defaultOutputMsg = '// Click interactive fields to see output';

  tabStates: Record<TabKey, TabState> = {
    text: { json: DEFAULT_TEXT_ONLY_JSON, output: this.defaultOutputMsg, parseError: '' },
    icontext: { json: DEFAULT_ICON_TEXT_JSON, output: this.defaultOutputMsg, parseError: '' },
    imagetext: { json: DEFAULT_IMAGE_TEXT_JSON, output: this.defaultOutputMsg, parseError: '' },
    tags: { json: DEFAULT_TAGS_STACK_JSON, output: this.defaultOutputMsg, parseError: '' },
    quantity: { json: DEFAULT_QUANTITY_JSON, output: this.defaultOutputMsg, parseError: '' },
    buttonicon: { json: DEFAULT_BUTTON_ICON_JSON, output: this.defaultOutputMsg, parseError: '' },
  };

  constructor(private cdr: ChangeDetectorRef) {}

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find(t => t.key === this.activeTab)!;
  }

  get previewModel(): CardObject {
    try {
      this.tabStates[this.activeTab].parseError = '';
      return new CardObject(JSON.parse(this.currentTab.json));
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e.message || String(e);
      return this.makeFallbackCard();
    }
  }

  private makeFallbackCard(): CardObject {
    return new CardObject({
      className: 'card border m-2 shadow',
      header: { className: 'card-header bg-danger text-white', name: 'Error' },
      body: { className: 'card-body p-3' },
      fields: [{ className: 'text-danger', colClass: 'col-12', name: 'Could not parse input JSON.' }],
      footer: { className: 'card-footer text-muted small', name: 'Fix the JSON to preview.' },
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
