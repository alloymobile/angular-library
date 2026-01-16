// src/lib/components/cell/td-link/td-link.model.ts

import { generateId } from '../../../utils/id-helper';

/**
 * LinkConfig - Configuration for TdLink component
 */
export interface LinkConfig {
  href: string;
  name: string;
  id?: string;
  className?: string;
  active?: string;
  target?: string;
  rel?: string;
  title?: string;
  onClick?: (e: Event) => void;
}

export class LinkObject {
  id: string;
  href: string;
  name: string;
  className: string;
  active: string;
  target?: string;
  rel?: string;
  title: string;
  onClick?: (e: Event) => void;

  constructor(link: LinkConfig) {
    if (!link.href) {
      throw new Error('LinkObject requires `href`.');
    }
    if (!link.name) {
      throw new Error('LinkObject requires `name`.');
    }

    this.id = link.id ?? generateId('link');
    this.href = link.href;
    this.name = link.name;
    this.className = link.className ?? 'nav-link';
    this.active = link.active ?? '';
    this.target = link.target;
    this.rel = link.rel;
    this.title = link.title ?? link.name;
    this.onClick = link.onClick;
  }

  /**
   * Compute safe rel attribute for external links
   */
  getSafeRel(): string | undefined {
    if (this.target === '_blank') {
      return this.rel
        ? `${this.rel} noopener noreferrer`
        : 'noopener noreferrer';
    }
    return this.rel;
  }
}
