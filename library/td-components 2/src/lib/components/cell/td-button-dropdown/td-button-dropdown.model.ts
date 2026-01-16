// src/lib/components/cell/td-button-dropdown/td-button-dropdown.model.ts

import { generateId, TagObject } from '../../../utils/id-helper';

/**
 * ButtonDropDownConfig - Configuration for TdButtonDropDown component
 */
export interface ButtonDropDownConfig {
  id?: string;
  name?: string;
  type?: string;
  className?: string;
  active?: string;
  icon?: { iconClass: string };
  badge?: any;
  linkBar?: any;
}

export class ButtonDropDownObject {
  id: string;
  name: string;
  type: string;
  className: string;
  active: string;
  icon: { iconClass: string };
  badge: TagObject | null;
  linkBar: any;

  constructor(res: ButtonDropDownConfig = {}) {
    this.id = res.id ?? generateId('btnDropdown');
    this.name = res.name ?? 'Menu';
    this.type = res.type ?? 'button';
    this.className = res.className ?? 'btn btn-sm btn-outline-secondary dropdown-toggle';
    this.active = res.active ?? '';
    this.icon = res.icon || { iconClass: '' };

    // Normalize badge → TagObject | null
    const rawBadge = res.badge || null;
    this.badge = rawBadge
      ? rawBadge instanceof TagObject
        ? rawBadge
        : new TagObject(rawBadge)
      : null;

    // LinkBar will be hydrated by the component or parent
    this.linkBar = res.linkBar || {
      className: 'dropdown-menu',
      linkClass: 'dropdown-item',
      links: []
    };
  }

  /**
   * Check if badge should be shown
   */
  showBadge(): boolean {
    return !!this.badge && 
      typeof this.badge.name === 'string' && 
      this.badge.name.trim().length > 0;
  }
}
