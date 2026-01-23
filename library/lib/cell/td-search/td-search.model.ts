// td-search/td-search.model.ts
import { TdInputModel } from '../td-input/td-input.model';
import { TdIconModel } from '../td-icon/td-icon.model';

export class TdSearchModel {
  id: string;
  className: string;
  search: TdInputModel;
  minChars: number;
  debounceMs: number;

  constructor(config: {
    id?: string;
    className?: string;
    search?: TdInputModel | any;
    minChars?: number;
    debounceMs?: number;
  } = {}) {
    this.id = config.id ?? `search-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    this.className = config.className ?? 'row mb-3';

    this.search = config.search
      ? config.search instanceof TdInputModel
        ? config.search
        : new TdInputModel(config.search)
      : new TdInputModel({
          name: 'query',
          type: 'text',
          layout: 'icon',
          label: 'Search',
          placeholder: 'Search…',
          icon: new TdIconModel({ iconClass: 'fa-solid fa-magnifying-glass' }),
          className: 'form-control',
        });

    this.minChars =
      typeof config.minChars === 'number' && config.minChars >= 0 ? config.minChars : 2;

    this.debounceMs =
      typeof config.debounceMs === 'number' && config.debounceMs >= 0
        ? config.debounceMs
        : 400;
  }
}
