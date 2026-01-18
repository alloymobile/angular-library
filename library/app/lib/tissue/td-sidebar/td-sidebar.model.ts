/**
 * SideBarObject - Model for sidebar/offcanvas component
 *
 * Supports:
 * - Desktop sidebar (persistent)
 * - Mobile offcanvas (collapsible)
 * - Link categories for navigation
 */

import { generateId } from '../../share';
import { LinkBarObject, LinkBarObjectConfig, LinkObject, LinkObjectConfig } from '../td-link-bar/td-link-bar.model';

export interface SideBarObjectConfig {
  id?: string;
  className?: string;
  offcanvasClass?: string;
  close?: string;
  selected?: LinkObjectConfig | LinkObject;
  categories?: (LinkBarObjectConfig | LinkBarObject)[];
  title?: string;
  position?: 'start' | 'end';
}

export class SideBarObject {
  readonly id: string;
  readonly className: string;
  readonly offcanvasClass: string;
  readonly close: string;
  readonly selected: LinkObject | null;
  readonly categories: LinkBarObject[];
  readonly title: string;
  readonly position: 'start' | 'end';

  constructor(sidebar: SideBarObjectConfig = {}) {
    this.id = sidebar.id ?? generateId('sidebar');
    this.className = typeof sidebar.className === 'string'
      ? sidebar.className
      : 'col-lg-3 col-xl-2 d-none d-lg-block sidebar';
    this.offcanvasClass = typeof sidebar.offcanvasClass === 'string'
      ? sidebar.offcanvasClass
      : 'offcanvas offcanvas-start';
    this.close = sidebar.close ?? this.id;
    this.title = typeof sidebar.title === 'string' ? sidebar.title : '';
    this.position = sidebar.position ?? 'start';

    // Normalize selected link
    if (sidebar.selected instanceof LinkObject) {
      this.selected = sidebar.selected;
    } else if (sidebar.selected && typeof sidebar.selected === 'object') {
      this.selected = new LinkObject(sidebar.selected);
    } else {
      this.selected = null;
    }

    // Normalize categories
    const rawCategories = Array.isArray(sidebar.categories) ? sidebar.categories : [];
    this.categories = rawCategories.map(cat => {
      if (cat instanceof LinkBarObject) return cat;
      return new LinkBarObject({
        ...cat,
        className: cat.className ?? 'nav flex-column',
        linkClass: cat.linkClass ?? 'nav-item',
      });
    });
  }

  /**
   * Check if sidebar has categories
   */
  hasCategories(): boolean {
    return this.categories.length > 0;
  }

  /**
   * Check if sidebar has a title
   */
  hasTitle(): boolean {
    return this.title.trim().length > 0;
  }

  /**
   * Check if a link is selected
   */
  isLinkSelected(link: LinkObject): boolean {
    if (!this.selected) return false;
    return this.selected.id === link.id || this.selected.href === link.href;
  }

  /**
   * Get offcanvas position class
   */
  getOffcanvasPositionClass(): string {
    return this.position === 'end' ? 'offcanvas-end' : 'offcanvas-start';
  }

  /**
   * Convert to plain object for serialization
   */
  toJSON(): SideBarObjectConfig {
    return {
      id: this.id,
      className: this.className,
      offcanvasClass: this.offcanvasClass,
      close: this.close,
      title: this.title,
      position: this.position,
    };
  }
}
