// src/lib/components/tissue/td-pagination/td-pagination.model.ts

import { generateId } from '../../../utils/id-helper';

/**
 * PaginationConfig - Configuration for TdPagination component
 */
export interface PaginationConfig {
  id?: string;
  className?: string;
  itemClassName?: string;
  linkClassName?: string;
  activeClassName?: string;
  disabledClassName?: string;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  firstLabel?: string;
  lastLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export class PaginationObject {
  id: string;
  className: string;
  itemClassName: string;
  linkClassName: string;
  activeClassName: string;
  disabledClassName: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  maxVisiblePages: number;
  showFirstLast: boolean;
  showPrevNext: boolean;
  firstLabel: string;
  lastLabel: string;
  prevLabel: string;
  nextLabel: string;

  constructor(pag: PaginationConfig = {}) {
    this.id = pag.id ?? generateId('pagination');
    this.className = pag.className ?? 'pagination justify-content-center';
    this.itemClassName = pag.itemClassName ?? 'page-item';
    this.linkClassName = pag.linkClassName ?? 'page-link';
    this.activeClassName = pag.activeClassName ?? 'active';
    this.disabledClassName = pag.disabledClassName ?? 'disabled';
    this.itemsPerPage = pag.itemsPerPage ?? 10;
    this.maxVisiblePages = pag.maxVisiblePages ?? 5;
    this.showFirstLast = pag.showFirstLast ?? true;
    this.showPrevNext = pag.showPrevNext ?? true;
    this.firstLabel = pag.firstLabel ?? '«';
    this.lastLabel = pag.lastLabel ?? '»';
    this.prevLabel = pag.prevLabel ?? '‹';
    this.nextLabel = pag.nextLabel ?? '›';

    // Calculate total pages if totalItems provided
    this.totalItems = pag.totalItems ?? 0;
    if (pag.totalPages) {
      this.totalPages = pag.totalPages;
    } else if (this.totalItems > 0) {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    } else {
      this.totalPages = 1;
    }

    // Ensure current page is within bounds
    this.currentPage = Math.max(1, Math.min(pag.currentPage ?? 1, this.totalPages));
  }

  /**
   * Get visible page numbers
   */
  getVisiblePages(): number[] {
    const pages: number[] = [];
    const half = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Check if can go to previous page
   */
  canPrev(): boolean {
    return this.currentPage > 1;
  }

  /**
   * Check if can go to next page
   */
  canNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  /**
   * Check if page is current
   */
  isCurrentPage(page: number): boolean {
    return page === this.currentPage;
  }

  /**
   * Get item class with active/disabled state
   */
  getItemClass(page: number, isDisabled: boolean = false): string {
    let cls = this.itemClassName;
    if (this.isCurrentPage(page)) cls += ' ' + this.activeClassName;
    if (isDisabled) cls += ' ' + this.disabledClassName;
    return cls;
  }
}
