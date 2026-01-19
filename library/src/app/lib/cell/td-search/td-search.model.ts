import { TdInputModel, TdInputConfig } from '../td-input/td-input.model';
import { TdIconModel } from '../td-icon/td-icon.model';
import { generateId } from '../../share/id-helper';

export interface TdSearchConfig {
  id?: string;
  className?: string;
  search?: TdInputModel | TdInputConfig;
  label?: string;
  placeholder?: string;
  iconGroupClass?: string;
  minChars?: number;
  debounceMs?: number;
}

export class TdSearchModel {
  readonly id: string;
  readonly className: string;
  readonly search: TdInputModel;
  readonly minChars: number;
  readonly debounceMs: number;

  constructor(config: TdSearchConfig = {}) {
    this.id = config.id ?? generateId('search');
    this.className = config.className ?? 'row mb-3';

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

    this.minChars = typeof config.minChars === 'number' && config.minChars >= 0 ? config.minChars : 2;
    this.debounceMs = typeof config.debounceMs === 'number' && config.debounceMs >= 0 ? config.debounceMs : 400;
  }
}
