// src/lib/components/cell/td-search/td-search.model.ts

import { generateId } from '../../../utils/id-helper';
import { InputObject, InputConfig } from '../td-input/td-input.model';

/**
 * SearchResultConfig - Configuration for search result items
 */
export interface SearchResultConfig {
  idKey?: string;
  labelKey?: string;
  descriptionKey?: string;
  iconKey?: string;
}

/**
 * SearchConfig - Configuration for TdSearch component
 */
export interface SearchConfig {
  id?: string;
  className?: string;
  search?: InputConfig | InputObject;
  label?: string;
  placeholder?: string;
  iconGroupClass?: string;
  minChars?: number;
  debounceMs?: number;
  results?: any[];
  resultConfig?: SearchResultConfig;
}

export class SearchObject {
  id: string;
  className: string;
  search: InputObject;
  minChars: number;
  debounceMs: number;
  results: any[];
  resultConfig: SearchResultConfig;

  constructor(cfg: SearchConfig = {}) {
    this.id = cfg.id ?? generateId('search');
    this.className = cfg.className ?? 'row mb-3';

    // Hydrate search input
    if (cfg.search instanceof InputObject) {
      this.search = cfg.search;
    } else if (cfg.search) {
      this.search = new InputObject(cfg.search);
    } else {
      this.search = new InputObject({
        id: generateId('searchInput'),
        name: 'query',
        type: 'text',
        layout: 'icon',
        label: cfg.label ?? 'Search',
        placeholder: cfg.placeholder ?? 'Search…',
        icon: { iconClass: 'fa-solid fa-magnifying-glass' },
        className: 'form-control',
        iconGroupClass: cfg.iconGroupClass ?? ''
      });
    }

    this.minChars = typeof cfg.minChars === 'number' && cfg.minChars >= 0 ? cfg.minChars : 2;
    this.debounceMs = typeof cfg.debounceMs === 'number' && cfg.debounceMs >= 0 ? cfg.debounceMs : 400;
    this.results = Array.isArray(cfg.results) ? cfg.results : [];

    // Default result config
    this.resultConfig = {
      idKey: 'id',
      labelKey: 'label',
      descriptionKey: 'description',
      iconKey: 'iconClass',
      ...(cfg.resultConfig || {})
    };
  }
}

/**
 * Normalized search result item
 */
export interface NormalizedResult {
  raw: any;
  id: string;
  label: string;
  description: string;
  iconClass: string;
}
