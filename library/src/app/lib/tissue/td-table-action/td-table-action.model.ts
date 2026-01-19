/**
 * TableActionObject - Model for data table with row actions
 *
 * Extends TableObject with:
 * - Link template for row navigation
 * - Action buttons per row
 */

import { generateId, IconObject, IconObjectConfig } from '../../share';
import { ButtonBarObject, ButtonBarObjectConfig } from '../td-button-bar/td-button-bar.model';

export interface TableRow {
  id?: string | number;
  [key: string]: unknown;
}

export interface TableActionObjectConfig {
  id?: string;
  className?: string;
  name?: string;
  rows?: TableRow[];
  icon?: IconObjectConfig | IconObject;
  sort?: IconObjectConfig | IconObject;
  link?: string;
  actions?: ButtonBarObjectConfig | ButtonBarObject;
  actionsHeader?: string;
}

export class TableActionObject {
  readonly id: string;
  readonly className: string;
  readonly name: string;
  readonly rows: TableRow[];
  readonly icon: IconObject;
  readonly sort: IconObject;
  readonly link: string;
  readonly actions: ButtonBarObject;
  readonly actionsHeader: string;

  constructor(table: TableActionObjectConfig = {}) {
    this.id = table.id ?? generateId('table-action');
    this.className = typeof table.className === 'string' ? table.className : 'table table-hover';
    this.name = typeof table.name === 'string' ? table.name : 'table';
    this.link = typeof table.link === 'string' ? table.link : '';
    this.actionsHeader = typeof table.actionsHeader === 'string' ? table.actionsHeader : 'Actions';

    // Shallow copy of rows
    this.rows = Array.isArray(table.rows) ? table.rows.slice() : [];

    // Default icons
    const defaultRowIcon: IconObjectConfig = { iconClass: 'fa-solid fa-user' };
    const defaultSortIcon: IconObjectConfig = { iconClass: 'fa-solid fa-arrow-down' };

    this.icon = table.icon instanceof IconObject
      ? table.icon
      : new IconObject(table.icon || defaultRowIcon);

    this.sort = table.sort instanceof IconObject
      ? table.sort
      : new IconObject(table.sort || defaultSortIcon);

    // Normalize actions
    if (table.actions instanceof ButtonBarObject) {
      this.actions = table.actions;
    } else if (table.actions && typeof table.actions === 'object') {
      this.actions = new ButtonBarObject({
        ...table.actions,
        className: table.actions.className ?? 'd-flex gap-1',
      });
    } else {
      this.actions = new ButtonBarObject({
        className: 'd-flex gap-1',
      });
    }
  }

  /**
   * Check if table has rows
   */
  hasRows(): boolean {
    return this.rows.length > 0;
  }

  /**
   * Check if table has actions
   */
  hasActions(): boolean {
    return this.actions.buttons.length > 0;
  }

  /**
   * Check if table has link template
   */
  hasLink(): boolean {
    return this.link.trim().length > 0;
  }

  /**
   * Get header keys from first row (excluding 'id')
   */
  getHeaderKeys(): string[] {
    if (this.rows.length === 0) return [];
    return Object.keys(this.rows[0]).filter(k => k !== 'id');
  }

  /**
   * Build link URL from template and row data
   * Replaces {field} placeholders with row values
   */
  buildRowLink(row: TableRow): string {
    if (!this.link) return '';

    return this.link.replace(/\{(\w+)\}/g, (match, field) => {
      const value = row[field];
      if (value === null || value === undefined) return '';
      return encodeURIComponent(String(value));
    });
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): TableActionObjectConfig {
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
