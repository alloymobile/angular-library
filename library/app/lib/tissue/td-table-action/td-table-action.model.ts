// td-table-action.model.ts
/**
 * TdTableActionModel - Model for data table with row actions
 *
 * Rules:
 * - This model hydrates ONLY its own direct fields.
 * - Embedded models are the responsibility of the embedded model constructors.
 *   - icon/sort -> IconObject
 *   - actions   -> TdButtonBarModel
 */
import { generateId, IconObject, IconObjectConfig } from '../../share';
import { TdButtonBarModel } from '../td-button-bar/td-button-bar.model';

export interface TdTableRow {
  id?: string | number;
  [key: string]: unknown;
}

export class TdTableActionModel {
  id: string;
  className: string;
  name: string;
  rows: TdTableRow[];
  icon: IconObject;
  sort: IconObject;
  link: string;
  actions: TdButtonBarModel;
  actionsHeader: string;

  constructor(cfg: any = {}) {
    this.id = typeof cfg.id === 'string' && cfg.id.trim() ? cfg.id : generateId('table-action');
    this.className = typeof cfg.className === 'string' ? cfg.className : 'table table-hover';
    this.name = typeof cfg.name === 'string' ? cfg.name : 'table';
    this.link = typeof cfg.link === 'string' ? cfg.link : '';
    this.actionsHeader = typeof cfg.actionsHeader === 'string' ? cfg.actionsHeader : 'Actions';

    this.rows = Array.isArray(cfg.rows) ? cfg.rows.slice() : [];

    const defaultRowIcon: IconObjectConfig = { iconClass: 'fa-solid fa-user' };
    const defaultSortIcon: IconObjectConfig = { iconClass: 'fa-solid fa-arrow-down' };

    this.icon = cfg.icon instanceof IconObject ? cfg.icon : new IconObject(cfg.icon || defaultRowIcon);
    this.sort = cfg.sort instanceof IconObject ? cfg.sort : new IconObject(cfg.sort || defaultSortIcon);

    // actions -> TdButtonBarModel (do NOT reach into its internals; let it hydrate itself)
    if (cfg.actions instanceof TdButtonBarModel) {
      this.actions = cfg.actions;
    } else if (cfg.actions && typeof cfg.actions === 'object') {
      this.actions = new TdButtonBarModel(cfg.actions);
    } else {
      this.actions = new TdButtonBarModel({});
    }
  }

  hasRows(): boolean {
    return this.rows.length > 0;
  }

  hasActions(): boolean {
    return Array.isArray(this.actions.buttons) && this.actions.buttons.length > 0;
  }

  hasLink(): boolean {
    return this.link.trim().length > 0;
  }

  getHeaderKeys(): string[] {
    if (this.rows.length === 0) return [];
    return Object.keys(this.rows[0]).filter((k) => k !== 'id');
  }

  buildRowLink(row: TdTableRow): string {
    if (!this.link) return '';

    return this.link.replace(/\{(\w+)\}/g, (_match, field) => {
      const value = (row as any)[field];
      if (value === null || value === undefined) return '';
      return encodeURIComponent(String(value));
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      className: this.className,
      name: this.name,
      link: this.link,
      actionsHeader: this.actionsHeader,
      rows: this.rows,
    };
  }
}
