import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdTabForm } from '../../../lib/tissue/td-tab-form/td-tab-form';
import { TdTabFormModel } from '../../../lib/tissue/td-tab-form/td-tab-form.model';
import { OutputObject } from '../../../lib/share';

/* -------------------------------------------------------
 * Sample Card Configs
 * ----------------------------------------------------- */

const SAMPLE_CARD_1 = {
  id: 'demoTextCard01',
  className: 'card border m-2 shadow',
  header: {
    id: 'demoTextHeader',
    className: 'card-header fw-semibold',
    name: 'Simple Text Card',
  },
  body: {
    id: 'demoTextBody',
    className: 'card-body p-3',
  },
  fields: [
    {
      id: 'txt-title',
      colClass: 'col-12',
      className: 'fw-semibold fs-5 mb-1',
      name: 'Ada Lovelace',
    },
    {
      id: 'txt-role',
      colClass: 'col-12',
      className: 'text-muted mb-1',
      name: 'Pioneer of computing',
    },
    {
      id: 'txt-note',
      colClass: 'col-12',
      className: 'small text-secondary',
      name: 'This card demonstrates a simple layout with only text fields.',
    },
  ],
  footer: {
    id: 'demoTextFooter',
    className: 'card-footer text-muted small',
    name: 'Footer (optional) — text only',
  },
};

const SAMPLE_CARD_2 = {
  id: 'demoTextCard02',
  className: 'card border m-2 shadow',
  header: {
    id: 'demoTextHeader2',
    className: 'card-header fw-semibold',
    name: 'Second Text Card',
  },
  body: {
    id: 'demoTextBody2',
    className: 'card-body p-3',
  },
  fields: [
    {
      id: 'txt2-title',
      colClass: 'col-12',
      className: 'fw-semibold fs-5 mb-1',
      name: 'Grace Hopper',
    },
    {
      id: 'txt2-role',
      colClass: 'col-12',
      className: 'text-muted mb-1',
      name: 'Compiler & COBOL Pioneer',
    },
    {
      id: 'txt2-note',
      colClass: 'col-12',
      className: 'small text-secondary',
      name: 'This card demonstrates Tab type: cards (list of TdCard).',
    },
  ],
  footer: {
    id: 'demoTextFooter2',
    className: 'card-footer text-muted small',
    name: 'Footer (optional) — text only',
  },
};

/* -------------------------------------------------------
 * Base Tabs Configuration
 * ----------------------------------------------------- */

const BASE_TABS = [
  {
    id: 'tab-inputs',
    key: 'inputs',
    type: 'inputs',
    title: 'Inputs',
    subtitle: 'Enter account + company details.',
    order: 1,
    required: true,
    stage: 'registration',
    status: 'in_progress',
    icon: { iconClass: 'fa-regular fa-pen-to-square' },
    inputClass: 'col-12 col-md-8 col-lg-6 mx-auto',
    inputs: [
      {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'you@example.com',
        layout: 'floating',
        icon: { iconClass: 'fa-regular fa-envelope' },
        required: true,
        value: '',
        className: 'form-control',
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Create a password',
        layout: 'floating',
        icon: { iconClass: 'fa-solid fa-lock' },
        required: true,
        passwordStrength: true,
        value: '',
        className: 'form-control',
      },
      {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm password',
        placeholder: 'Re-enter password',
        layout: 'floating',
        icon: { iconClass: 'fa-solid fa-lock' },
        required: true,
        matchWith: 'password',
        value: '',
        className: 'form-control',
      },
      {
        name: 'companyName',
        type: 'text',
        label: 'Company name',
        placeholder: 'ACME Concrete Ltd.',
        layout: 'floating',
        icon: { iconClass: 'fa-regular fa-building' },
        required: true,
        value: '',
        className: 'form-control',
      },
      {
        name: 'country',
        type: 'text',
        label: 'Country',
        placeholder: 'Canada',
        layout: 'floating',
        icon: { iconClass: 'fa-solid fa-globe' },
        required: true,
        value: '',
        className: 'form-control',
      },
      {
        name: 'website',
        type: 'url',
        label: 'Website (optional)',
        placeholder: 'https://example.com',
        layout: 'floating',
        icon: { iconClass: 'fa-solid fa-link' },
        required: false,
        value: '',
        className: 'form-control',
      },
    ],
  },
  {
    id: 'tab-cards',
    key: 'cards',
    type: 'cards',
    title: 'Cards',
    subtitle: 'List of cards rendered by TdCard (type: cards).',
    order: 2,
    required: false,
    stage: 'registration',
    status: 'not_started',
    icon: { iconClass: 'fa-regular fa-clone' },
    cards: [SAMPLE_CARD_1, SAMPLE_CARD_2],
  },
];

/* -------------------------------------------------------
 * Tab Form Configurations
 * ----------------------------------------------------- */

const TAB_FORM_TABS = {
  id: 'client-registration-demo',
  name: 'Client Registration Flow (Tabs)',
  status: 'draft',
  currentIndex: 0,
  navButtons: {
    previous: {
      id: 'btn-prev',
      label: 'Previous',
      icon: { iconClass: 'fa-solid fa-arrow-left' },
      className: 'btn btn-outline-secondary btn-sm',
    },
    next: {
      id: 'btn-next',
      label: 'Next',
      icon: { iconClass: 'fa-solid fa-arrow-right' },
      className: 'btn btn-primary btn-sm',
    },
    finish: {
      id: 'btn-finish',
      label: 'Finish',
      icon: { iconClass: 'fa-regular fa-circle-check' },
      className: 'btn btn-success btn-sm',
    },
  },
  tabs: BASE_TABS.map((t) => ({
    ...t,
    className: 'col-12',
  })),
};

const TAB_FORM_MIXED = {
  ...TAB_FORM_TABS,
  id: 'client-registration-mixed-demo',
  name: 'Client Registration Flow (Mixed)',
  layout: 'mixed',
  currentIndex: 0,
  tabs: BASE_TABS.map((t) => ({
    ...t,
    className: 'col-12 col-lg-6',
  })),
};

const DEFAULT_TAB_FORM = JSON.stringify(TAB_FORM_TABS, null, 2);
const DEFAULT_MIXED_FORM = JSON.stringify(TAB_FORM_MIXED, null, 2);

const TAG_SNIPPET = `const model = new TdTabFormModel(config);
<td-tab-form [tabForm]="model" (output)="handleOutput($event)"></td-tab-form>`;

/* -------------------------------------------------------
 * Type Definitions
 * ----------------------------------------------------- */

type DemoType = 'tabs' | 'mixed';

interface DemoState {
  json: string;
  output: string;
  parseError: string;
  cachedModel: TdTabFormModel | null;
}

/* -------------------------------------------------------
 * Demo Component
 * ----------------------------------------------------- */

@Component({
  selector: 'demo-tab-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TdTabForm],
  templateUrl: './demo-tab-form.html',
  styleUrls: ['./demo-tab-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoTabForm {
  readonly tagSnippet = TAG_SNIPPET;
  readonly defaultOutputMsg = '// Latest OutputObject will appear here';

  activeDemo: DemoType = 'tabs';

  demoStates: Record<DemoType, DemoState> = {
    tabs: {
      json: DEFAULT_TAB_FORM,
      output: this.defaultOutputMsg + ' (tabs layout)',
      parseError: '',
      cachedModel: null,
    },
    mixed: {
      json: DEFAULT_MIXED_FORM,
      output: this.defaultOutputMsg + ' (mixed layout)',
      parseError: '',
      cachedModel: null,
    },
  };

  constructor(private cdr: ChangeDetectorRef) {
    // Initialize cached models
    this.rebuildModel('tabs');
    this.rebuildModel('mixed');
  }

  get currentState(): DemoState {
    return this.demoStates[this.activeDemo];
  }

  get tabsModel(): TdTabFormModel {
    return this.demoStates['tabs'].cachedModel!;
  }

  get mixedModel(): TdTabFormModel {
    return this.demoStates['mixed'].cachedModel!;
  }

  /* -------------------------------------------------------
   * Model Management
   * ----------------------------------------------------- */

  private rebuildModel(demo: DemoType): void {
    const state = this.demoStates[demo];
    try {
      const cfg = JSON.parse(state.json);
      state.cachedModel = new TdTabFormModel(cfg);
      state.parseError = '';
    } catch (e: any) {
      const msg = String(e?.message || e || 'Invalid JSON');
      state.parseError = msg;
      state.cachedModel = new TdTabFormModel({
        id: `invalid-config-${demo}`,
        name: `Invalid config (${demo})`,
        layout: demo === 'mixed' ? 'mixed' : 'tabs',
        tabs: [
          {
            id: `error-tab-${demo}`,
            key: 'error',
            title: 'Invalid JSON',
            order: 1,
            type: 'inputs',
            inputs: [],
          },
        ],
      });
    }
  }

  /* -------------------------------------------------------
   * Event Handlers
   * ----------------------------------------------------- */

  setActiveDemo(demo: DemoType): void {
    this.activeDemo = demo;
    this.cdr.markForCheck();
  }

  onJsonChange(demo: DemoType, value: string): void {
    this.demoStates[demo].json = value;
    this.rebuildModel(demo);
    this.cdr.markForCheck();
  }

  handleOutput(demo: DemoType, payload: OutputObject): void {
    const plain =
      payload && typeof (payload as any).toJSON === 'function'
        ? (payload as any).toJSON()
        : payload;
    this.demoStates[demo].output = JSON.stringify(plain, null, 2);
    this.cdr.markForCheck();
  }

  resetJson(demo: DemoType): void {
    this.demoStates[demo].json = demo === 'tabs' ? DEFAULT_TAB_FORM : DEFAULT_MIXED_FORM;
    this.demoStates[demo].output = this.defaultOutputMsg + ` (${demo} layout)`;
    this.demoStates[demo].parseError = '';
    this.rebuildModel(demo);
    this.cdr.markForCheck();
  }
}