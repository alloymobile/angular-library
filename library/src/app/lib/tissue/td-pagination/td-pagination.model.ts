// td-pagination/td-pagination.model.ts
import { generateId } from '../../share/id-helper';
import { TdButtonIconModel } from '../../cell/td-button-icon/td-button-icon.model';

export class TdPaginationModel {
  id?: string;

  name: string;
  className: string;
  listClassName: string;
  itemClassName: string;
  activeClassName: string;
  disabledClassName: string;

  totalPages: number;
  totalElements: number;
  size: number;
  pageNumber: number;
  numberOfElements: number;
  empty: boolean;
  first: boolean;
  last: boolean;

  windowSize: number;

  firstBtn: TdButtonIconModel;
  prevBtn: TdButtonIconModel;
  nextBtn: TdButtonIconModel;
  lastBtn: TdButtonIconModel;

  constructor(config: {
    id?: string;

    name?: string;
    className?: string;
    listClassName?: string;
    itemClassName?: string;
    activeClassName?: string;
    disabledClassName?: string;

    totalPages?: number;
    totalElements?: number;
    size?: number;
    pageNumber?: number; // NOTE: your standard name (instead of server "number")
    numberOfElements?: number;
    empty?: boolean;
    first?: boolean;
    last?: boolean;

    windowSize?: number;

    // embedded models as config (JSON). MUST hydrate via `new`.
    firstBtn?: any;
    prevBtn?: any;
    nextBtn?: any;
    lastBtn?: any;
  } = {}) {
    this.id = (config.id && String(config.id).trim()) ? String(config.id).trim() : generateId('pagination');

    this.name = config.name ?? '';
    this.className = config.className ?? 'd-flex justify-content-end align-items-center mt-2';
    this.listClassName = config.listClassName ?? 'pagination justify-content-end mb-0';
    this.itemClassName = config.itemClassName ?? 'page-item';
    this.activeClassName = config.activeClassName ?? 'active';
    this.disabledClassName = config.disabledClassName ?? 'disabled';

    this.totalPages = typeof config.totalPages === 'number' && config.totalPages >= 0 ? config.totalPages : 0;
    this.totalElements = typeof config.totalElements === 'number' && config.totalElements >= 0 ? config.totalElements : 0;
    this.size = typeof config.size === 'number' && config.size >= 0 ? config.size : 0;

    this.pageNumber = typeof config.pageNumber === 'number' && config.pageNumber >= 0 ? config.pageNumber : 0;
    this.numberOfElements = typeof config.numberOfElements === 'number' && config.numberOfElements >= 0 ? config.numberOfElements : 0;
    this.empty = typeof config.empty === 'boolean' ? config.empty : false;

    this.first = typeof config.first === 'boolean' ? config.first : this.pageNumber === 0;
    this.last = typeof config.last === 'boolean'
      ? config.last
      : this.totalPages > 0
        ? this.pageNumber >= this.totalPages - 1
        : true;

    this.windowSize = typeof config.windowSize === 'number' && config.windowSize >= 5 ? config.windowSize : 7;

    // IMPORTANT: embedded models hydrated via `new` always
    this.firstBtn = new TdButtonIconModel({
      name: 'First',
      className: 'page-link',
      ariaLabel: 'Go to first page',
      title: 'Go to first page',
      icon: { iconClass: 'fa-solid fa-angles-left' },
      ...(config.firstBtn ?? {}),
    });

    this.prevBtn = new TdButtonIconModel({
      name: 'Previous',
      className: 'page-link',
      ariaLabel: 'Go to previous page',
      title: 'Go to previous page',
      icon: { iconClass: 'fa-solid fa-chevron-left' },
      ...(config.prevBtn ?? {}),
    });

    this.nextBtn = new TdButtonIconModel({
      name: 'Next',
      className: 'page-link',
      ariaLabel: 'Go to next page',
      title: 'Go to next page',
      icon: { iconClass: 'fa-solid fa-chevron-right' },
      ...(config.nextBtn ?? {}),
    });

    this.lastBtn = new TdButtonIconModel({
      name: 'Last',
      className: 'page-link',
      ariaLabel: 'Go to last page',
      title: 'Go to last page',
      icon: { iconClass: 'fa-solid fa-angles-right' },
      ...(config.lastBtn ?? {}),
    });
  }

  hasPages(): boolean {
    return this.totalPages > 0;
  }
}
