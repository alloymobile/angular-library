// lib/organ/td-crud/td-crud.model.ts

import { generateId } from '../../share';
import { TdModalModel } from '../../tissue/td-modal/td-modal.model';
import { TdModalToastModel } from '../../tissue/td-modal-toast/td-modal-toast.model';
import { TdSearchModel } from '../../cell/td-search/td-search.model';
import { TdButtonIconModel } from '../../cell/td-button-icon/td-button-icon.model';
import { TdTableActionModel } from '../../tissue/td-table-action/td-table-action.model';
import { TdCardActionModel } from '../../tissue/td-card-action/td-card-action.model';
import { TdPaginationModel } from '../../tissue/td-pagination/td-pagination.model';

/* -------------------------------------------------------
 * CrudConfig Interface
 * ----------------------------------------------------- */
export interface CrudConfig {
  id?: string;
  className?: string;
  type?: 'table' | 'card';
  documentClass?: string;
  modal?: TdModalModel | Record<string, any>;
  toast?: TdModalToastModel | Record<string, any> | null;
  search?: TdSearchModel | Record<string, any> | null;
  add?: TdButtonIconModel | null;
  document?: TdTableActionModel | TdCardActionModel[] | Record<string, any> | Record<string, any>[];
  page?: TdPaginationModel | Record<string, any> | null;
  [key: string]: any;
}

/* -------------------------------------------------------
 * CrudModel
 * ----------------------------------------------------- */
export class CrudModel {
  id: string;
  className: string;
  type: 'table' | 'card';
  documentClass: string;
  modal: TdModalModel;
  toast: TdModalToastModel | null;
  search: TdSearchModel | null;
  add: TdButtonIconModel | null;
  document: TdTableActionModel | TdCardActionModel[];
  page: TdPaginationModel | null;
  [key: string]: any;

  constructor(cfg: CrudConfig = {}) {
    const {
      id,
      className = 'container-fluid',
      type = 'table',
      documentClass,
      modal,
      toast,
      search,
      add,
      document,
      page,
      ...rest
    } = cfg || {};

    this.id = id ?? generateId('crud');
    this.className = className;

    this.type = type === 'card' ? 'card' : 'table';

    if (this.type === 'table') {
      this.documentClass = documentClass || 'col-12';
    } else {
      this.documentClass = documentClass || 'col-6 col-md-4 col-lg-3 col-xl-2 mb-3';
    }

    // Modal - always required
    this.modal = modal instanceof TdModalModel ? modal : new TdModalModel(modal || {});

    // Toast - required for delete confirmation
    this.toast =
      toast instanceof TdModalToastModel ? toast : toast ? new TdModalToastModel(toast) : null;

    // Search - optional with nested search config support
    if (search instanceof TdSearchModel) {
      this.search = search;
    } else if (search) {
      if ((search as any).search) {
        this.search = new TdSearchModel(search);
      } else {
        this.search = new TdSearchModel({ search });
      }
    } else {
      this.search = null;
    }

    // Add button - optional
    this.add = add instanceof TdButtonIconModel ? add : add ? new TdButtonIconModel(add) : null;

    // Document - table or card array
    if (this.type === 'table') {
      this.document =
        document instanceof TdTableActionModel
          ? document
          : new TdTableActionModel(document as Record<string, any> || {});
    } else {
      const rawCards = Array.isArray(document) ? document : [];
      this.document = rawCards.map((card) =>
        card instanceof TdCardActionModel ? card : new TdCardActionModel(card || {})
      );
    }

    // Pagination - optional
    this.page = page instanceof TdPaginationModel ? page : page ? new TdPaginationModel(page) : null;

    // Spread any additional properties
    Object.assign(this, rest);
  }
}

/* -------------------------------------------------------
 * ModalState Interface (internal state management)
 * ----------------------------------------------------- */
export interface ModalState {
  mode: 'create' | 'edit';
  data: Record<string, any>;
  disabled: boolean;
  version: number;
  dirty: Record<string, boolean>;
}

/* -------------------------------------------------------
 * Helper function to create initial modal state
 * ----------------------------------------------------- */
export function createInitialModalState(modal?: TdModalModel): ModalState {
  return {
    mode: 'create',
    data: modal?.data || {},
    disabled: false,
    version: 0,
    dirty: {}
  };
}

export default CrudModel;