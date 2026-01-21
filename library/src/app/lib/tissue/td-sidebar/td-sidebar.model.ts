// td-side-bar.model.ts
/**
 * SideBarObject - Model for sidebar/offcanvas component
 *
 * React parity (AlloySideBar SideBarObject):
 * - close: string (offcanvas id)
 * - selected: TdLinkBarItem | null (kept for parity; selection handled by TdLinkBar)
 * - categories: TdLinkBarModel[] (sidebar renders an array of link bars)
 *
 * Sidebar does NOT care about TdLink / TdLinkIcon / TdLinkLogo internals.
 * It only normalizes categories to TdLinkBarModel instances.
 */

import { generateId } from '../../share';

import { TdLinkBarModel } from '../td-link-bar/td-link-bar.model';

export interface SideBarObjectConfig {
  id?: string;
  close?: string;
  selected?: any; // parity only; we do not normalize here
  categories?: any[]; // each becomes TdLinkBarModel
}

export class SideBarObject {
  id: string;
  close: string;
  selected: any | null;
  categories: TdLinkBarModel[];

  constructor(res: SideBarObjectConfig = {}) {
    const { close = 'mobileSidebar', selected, categories } = res;

    this.id = res.id ?? generateId('sidebar');

    // Offcanvas id (used as #id for mobile)
    this.close = close;

    // Optional selected link; keep for parity with React.
    // Selection highlight is handled by TdLinkBar internally.
    this.selected = selected ?? null;

    // Normalize categories into TdLinkBarModel[]
    const rawCategories = Array.isArray(categories) ? categories : [];
    this.categories = rawCategories.map((bar) =>
      bar instanceof TdLinkBarModel ? bar : new TdLinkBarModel(bar || {})
    );
  }
}
