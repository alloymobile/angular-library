/**
 * TdTabFormModel - Multi-step wizard/form component models
 *
 * Supports two layouts:
 * - "tabs": One tab visible at a time with Previous/Next/Finish navigation
 * - "mixed": All sections rendered on the same page as fieldsets
 *
 * Tab types supported:
 * - "inputs": Array of TdInputModel for form fields
 * - "cards": Array of CardObject for card displays
 */

import { generateId } from '../../share/id-helper';
import { TdIconModel } from '../../cell/td-icon/td-icon.model';
import { TdInputModel, TdInputConfig } from '../../cell/td-input/td-input.model';
import { TdButtonIconModel } from '../../cell/td-button-icon/td-button-icon.model';
import { CardObject, CardObjectConfig } from '../td-card/td-card.model';

/* -------------------------------------------------------
 * TdTabModel - Single tab/step configuration
 * ----------------------------------------------------- */

export type TdTabType = 'inputs' | 'cards';

export interface TdTabConfig {
  id?: string;
  key?: string;
  title?: string;
  subtitle?: string;
  order?: number;
  required?: boolean;
  stage?: string;
  status?: string;
  className?: string;
  icon?: TdIconModel | { iconClass: string; className?: string };
  inputClass?: string;
  type?: TdTabType;
  inputs?: (TdInputModel | TdInputConfig)[];
  cards?: (CardObject | CardObjectConfig)[];
}

export class TdTabModel {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  order: number;
  required: boolean;
  stage: string;
  status: string;
  className: string;
  icon: TdIconModel | null;
  inputClass: string;
  type: TdTabType;
  inputs: TdInputModel[];
  cards: CardObject[];
  initError: string;

  constructor(tab: TdTabConfig = {}) {
    this.id = tab.id ?? generateId('tab');
    this.key = tab.key ?? this.id;
    this.title = typeof tab.title === 'string' ? tab.title : '';
    this.subtitle = typeof tab.subtitle === 'string' ? tab.subtitle : '';
    this.order = typeof tab.order === 'number' ? tab.order : 0;
    this.required = !!tab.required;
    this.stage = typeof tab.stage === 'string' ? tab.stage : '';
    this.status = typeof tab.status === 'string' ? tab.status : '';

    this.className =
      typeof tab.className === 'string' && tab.className.trim()
        ? tab.className
        : 'col-12';

    this.initError = '';

    // Normalize type
    const t = String(tab.type ?? 'inputs').trim().toLowerCase();
    this.type = t === 'cards' ? 'cards' : 'inputs';

    // Icon
    if (tab.icon) {
      this.icon = tab.icon instanceof TdIconModel
        ? tab.icon
        : new TdIconModel(tab.icon as any);
    } else {
      this.icon = null;
    }

    // Input wrapper class
    this.inputClass =
      typeof tab.inputClass === 'string' && tab.inputClass.trim()
        ? tab.inputClass
        : 'col-12 col-md-6 col-lg-5 mx-auto';

    // Initialize inputs array
    this.inputs = [];
    if (this.type === 'inputs') {
      try {
        const rawInputs = Array.isArray(tab.inputs) ? tab.inputs : [];
        this.inputs = rawInputs.map((i) => {
          if (i instanceof TdInputModel) return i;
          const raw = i && typeof i === 'object' ? i : {};
          const cfg: TdInputConfig = {
            ...raw,
            name: (raw as any).name || generateId('field'),
          };
          return new TdInputModel(cfg);
        });
      } catch (e: any) {
        this.initError = String(e?.message || e);
        this.inputs = [];
      }
    }

    // Initialize cards array
    this.cards = [];
    if (this.type === 'cards') {
      try {
        const rawCards = Array.isArray(tab.cards) ? tab.cards : [];
        this.cards = rawCards.map((c) => {
          if (c instanceof CardObject) return c;
          return new CardObject(c || {});
        });
      } catch (e: any) {
        this.initError = String(e?.message || e);
        this.cards = [];
      }
    }
  }

  hasIcon(): boolean {
    return this.icon !== null;
  }

  hasInputs(): boolean {
    return this.type === 'inputs' && this.inputs.length > 0;
  }

  hasCards(): boolean {
    return this.type === 'cards' && this.cards.length > 0;
  }
}

/* -------------------------------------------------------
 * TdNavButtonsConfig - Navigation button configuration
 * ----------------------------------------------------- */

export interface TdNavButtonConfig {
  id?: string;
  name?: string;
  label?: string;
  icon?: TdIconModel | { iconClass: string; className?: string };
  className?: string;
  disabled?: boolean;
  type?: string;
}

export interface TdNavButtonsConfig {
  previous?: TdNavButtonConfig;
  next?: TdNavButtonConfig;
  finish?: TdNavButtonConfig;
}

export interface TdNavButtons {
  previous: TdButtonIconModel | null;
  next: TdButtonIconModel | null;
  finish: TdButtonIconModel | null;
}

/* -------------------------------------------------------
 * TdTabFormModel - Whole form/wizard configuration
 * ----------------------------------------------------- */

export type TdTabFormLayout = 'tabs' | 'mixed';

export interface TdTabFormConfig {
  id?: string;
  name?: string;
  status?: string;
  layout?: TdTabFormLayout;
  tabs?: TdTabConfig[];
  currentIndex?: number;
  navButtons?: TdNavButtonsConfig;
}

export class TdTabFormModel {
  id: string;
  name: string;
  status: string;
  layout: TdTabFormLayout;
  tabs: TdTabModel[];
  currentIndex: number;
  navButtons: TdNavButtons;

  constructor(cfg: TdTabFormConfig = {}) {
    this.id = cfg.id ?? generateId('tab-form');
    this.name = typeof cfg.name === 'string' ? cfg.name : '';
    this.status = typeof cfg.status === 'string' ? cfg.status : 'draft';

    // Layout: "tabs" (default) or "mixed"
    this.layout = cfg.layout === 'mixed' ? 'mixed' : 'tabs';

    // Parse and sort tabs by order
    const rawTabs = Array.isArray(cfg.tabs) ? cfg.tabs : [];
    const mappedTabs = rawTabs.map((t) => new TdTabModel(t));
    this.tabs = mappedTabs.sort((a, b) => a.order - b.order);

    // Normalize currentIndex
    let idx = typeof cfg.currentIndex === 'number' ? cfg.currentIndex : 0;
    if (idx < 0) idx = 0;
    if (idx >= this.tabs.length) idx = this.tabs.length - 1;
    this.currentIndex = this.tabs.length > 0 ? idx : 0;

    // Navigation buttons
    const nb = cfg.navButtons || {};
    this.navButtons = {
      previous: nb.previous
        ? new TdButtonIconModel({
            id: nb.previous.id,
            name: nb.previous.name || nb.previous.label || 'Previous',
            icon: nb.previous.icon || { iconClass: 'fa-solid fa-arrow-left' },
            className: nb.previous.className || 'btn btn-outline-secondary',
            disabled: nb.previous.disabled,
          })
        : null,
      next: nb.next
        ? new TdButtonIconModel({
            id: nb.next.id,
            name: nb.next.name || nb.next.label || 'Next',
            icon: nb.next.icon || { iconClass: 'fa-solid fa-arrow-right' },
            className: nb.next.className || 'btn btn-primary',
            disabled: nb.next.disabled,
          })
        : null,
      finish: nb.finish
        ? new TdButtonIconModel({
            id: nb.finish.id,
            name: nb.finish.name || nb.finish.label || 'Finish',
            icon: nb.finish.icon || { iconClass: 'fa-solid fa-paper-plane' },
            className: nb.finish.className || 'btn btn-primary',
            disabled: nb.finish.disabled,
          })
        : null,
    };
  }

  hasTabs(): boolean {
    return this.tabs.length > 0;
  }

  isMixedLayout(): boolean {
    return this.layout === 'mixed';
  }

  isTabsLayout(): boolean {
    return this.layout === 'tabs';
  }

  getCurrentTab(): TdTabModel | null {
    return this.tabs[this.currentIndex] || null;
  }

  isFirstTab(): boolean {
    return this.currentIndex === 0;
  }

  isLastTab(): boolean {
    return this.currentIndex === this.tabs.length - 1;
  }

  toJSON(): TdTabFormConfig {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      layout: this.layout,
      currentIndex: this.currentIndex,
    };
  }
}