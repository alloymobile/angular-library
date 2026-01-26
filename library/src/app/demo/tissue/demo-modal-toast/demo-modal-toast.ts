import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdModalToast } from '../../../lib/tissue/td-modal-toast/td-modal-toast';
import { TdModalToastModel } from '../../../lib/tissue/td-modal-toast/td-modal-toast.model';
import { OutputObject } from '../../../lib/share';

declare var bootstrap: any;

/* ─────────────────────────── Default JSON Configs ─────────────────────────── */

const DEFAULT_TOAST_OK = JSON.stringify(
  {
    id: 'demoModalToastOk',
    className: 'modal fade',
    action: 'Notice',
    title: 'Saved',
    message: 'Your changes have been saved successfully.',
    submit: {
      name: 'OK',
      className: 'btn btn-primary',
    },
  },
  null,
  2
);

const DEFAULT_TOAST_WARN = JSON.stringify(
  {
    id: 'demoModalToastWarn',
    className: 'modal fade',
    action: 'Warning',
    title: 'Unsaved Changes',
    message: 'You have unsaved changes. Please confirm before leaving.',
    submit: {
      name: 'OK',
      className: 'btn btn-warning',
    },
  },
  null,
  2
);

type TabKey = 'ok' | 'warn';

interface TabConfig {
  key: TabKey;
  label: string;
  defaultJson: string;
  modalId: string;
}

interface TabState {
  json: string;
  output: string;
  parseError: string;
}

@Component({
  selector: 'demo-modal-toast',
  standalone: true,
  imports: [CommonModule, FormsModule, TdModalToast],
  templateUrl: './demo-modal-toast.html',
  styleUrls: ['./demo-modal-toast.css'],
})
export class DemoModalToast {
  readonly tagSnippet =
    `<td-modal-toast [modalToast]="modalToastModel" (output)="handleOutput($event)"></td-modal-toast>`;

  readonly TABS: TabConfig[] = [
    { key: 'ok', label: 'Toast OK', defaultJson: DEFAULT_TOAST_OK, modalId: 'demoModalToastOk' },
    { key: 'warn', label: 'Toast Warning', defaultJson: DEFAULT_TOAST_WARN, modalId: 'demoModalToastWarn' },
  ];

  activeTab: TabKey = 'ok';
  defaultOutputMsg = '// Click OK to see OutputObject here';
  private isBrowser: boolean;

  tabStates: Record<TabKey, TabState> = {
    ok: { json: DEFAULT_TOAST_OK, output: this.defaultOutputMsg, parseError: '' },
    warn: { json: DEFAULT_TOAST_WARN, output: this.defaultOutputMsg, parseError: '' },
  };

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get currentTab(): TabState {
    return this.tabStates[this.activeTab];
  }

  get currentTabConfig(): TabConfig {
    return this.TABS.find(t => t.key === this.activeTab)!;
  }

  get modalToastModel(): TdModalToastModel {
    try {
      this.tabStates[this.activeTab].parseError = '';
      return new TdModalToastModel(JSON.parse(this.currentTab.json));
    } catch (e: any) {
      this.tabStates[this.activeTab].parseError = e?.message || String(e);

      return new TdModalToastModel({
        id: 'demoModalToastError',
        className: 'modal fade',
        action: 'Error',
        title: 'Invalid JSON',
        message: 'Fix the JSON and try again.',
        submit: { name: 'OK', className: 'btn btn-secondary' },
      });
    }
  }

  setActiveTab(tab: TabKey): void {
    this.activeTab = tab;
  }

  onJsonChange(value: string): void {
    this.tabStates[this.activeTab].json = value;
  }

  resetJson(): void {
    const cfg = this.currentTabConfig;
    this.tabStates[this.activeTab].json = cfg.defaultJson;
    this.tabStates[this.activeTab].parseError = '';
    this.tabStates[this.activeTab].output = this.defaultOutputMsg;
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function' ? (out as any).toJSON() : out;
    this.tabStates[this.activeTab].output = JSON.stringify(payload, null, 2);
  }

  openModal(): void {
    if (!this.isBrowser) return;

    const modalEl = document.getElementById(this.modalToastModel.id);
    if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
      instance.show();
    }
  }
}
