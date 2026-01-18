import { TdInputModel, TdInputConfig } from '../td-input/td-input.model';
import { TdIconModel, TdIconConfig } from '../td-icon/td-icon.model';
import { generateId } from '../share/id-helper';

/**
 * Result configuration for search results
 */
export interface TdSearchResultConfig {
  idKey?: string;
  labelKey?: string;
  descriptionKey?: string;
  iconKey?: string;
}

/**
 * TdSearchModel - Configuration for TdSearch component
 *
 * @property id - Optional. DOM id.
 * @property className - Optional. Wrapper classes. Default: "row mb-3"
 * @property search - Optional. Input configuration for search field.
 * @property minChars - Optional. Minimum characters before search. Default: 2
 * @property debounceMs - Optional. Debounce delay in ms. Default: 400
 * @property results - Optional. Array of search results to display.
 * @property resultConfig - Optional. Configuration for result display.
 */

export interface TdSearchConfig {
  id?: string;
  className?: string;
  search?: TdInputModel | TdInputConfig;
  label?: string;
  placeholder?: string;
  iconGroupClass?: string;

  // Default TdIcon for results (used when each item doesn't provide an icon)
  resultIcon?: TdIconModel | TdIconConfig;

  minChars?: number;
  debounceMs?: number;
  results?: unknown[];
  resultConfig?: TdSearchResultConfig;
}

export class TdSearchModel {
  readonly id: string;
  readonly className: string;
  readonly search: TdInputModel;
  readonly resultIcon?: TdIconModel;
  readonly minChars: number;
  readonly debounceMs: number;
  results: unknown[];
  readonly resultConfig: Required<TdSearchResultConfig>;

  constructor(config: TdSearchConfig = {}) {
    this.id = config.id ?? generateId('search');
    this.className = config.className ?? 'row mb-3';

    // Build search input
    if (config.search instanceof TdInputModel) {
      this.search = config.search;
    } else if (config.search) {
      this.search = new TdInputModel(config.search);
    } else {
      this.search = new TdInputModel({
        id: generateId('searchInput'),
        name: 'query',
        type: 'text',
        layout: 'icon',
        label: config.label ?? 'Search',
        placeholder: config.placeholder ?? 'Search…',
        icon: new TdIconModel({ iconClass: 'fa-solid fa-magnifying-glass' }),
        className: 'form-control',
        iconGroupClass: config.iconGroupClass ?? '',
      });
    }

    this.resultIcon = config.resultIcon instanceof TdIconModel
      ? config.resultIcon
      : config.resultIcon
        ? new TdIconModel(config.resultIcon)
        : undefined;

    this.minChars = typeof config.minChars === 'number' && config.minChars >= 0
      ? config.minChars
      : 2;

    this.debounceMs = typeof config.debounceMs === 'number' && config.debounceMs >= 0
      ? config.debounceMs
      : 400;

    this.results = Array.isArray(config.results) ? config.results : [];

    // Result config with defaults
    const defaultResultConfig: Required<TdSearchResultConfig> = {
      idKey: 'id',
      labelKey: 'label',
      descriptionKey: 'description',
      iconKey: 'iconClass',
    };

    this.resultConfig = {
      ...defaultResultConfig,
      ...(config.resultConfig || {}),
    };
  }
}

/**
 * Normalized search result item
 */
export interface TdSearchResultItem {
  raw: unknown;
  id: string;
  label: string;
  description: string;
  icon?: TdIconModel;
}
