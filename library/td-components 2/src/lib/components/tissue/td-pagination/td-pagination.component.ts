// src/lib/components/tissue/td-pagination/td-pagination.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationObject } from './td-pagination.model';
import { OutputObject } from '../../../utils/id-helper';

/**
 * TdPaginationComponent
 * 
 * Renders a Bootstrap-style pagination control.
 */
@Component({
  selector: 'td-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-pagination.component.html',
  styleUrls: ['./td-pagination.component.css']
})
export class TdPaginationComponent implements OnInit, OnChanges {
  /**
   * Input: PaginationObject instance (required)
   */
  @Input() pagination!: PaginationObject;

  /**
   * Output: Emits page change events
   */
  @Output() output = new EventEmitter<any>();

  // Visible pages
  visiblePages: number[] = [];

  ngOnInit(): void {
    this.validateInput();
    this.updateVisiblePages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination']) {
      this.validateInput();
      this.updateVisiblePages();
    }
  }

  private validateInput(): void {
    if (!this.pagination || !(this.pagination instanceof PaginationObject)) {
      throw new Error('TdPaginationComponent requires `pagination` prop (PaginationObject instance).');
    }
  }

  private updateVisiblePages(): void {
    this.visiblePages = this.pagination.getVisiblePages();
  }

  /**
   * Go to a specific page
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.pagination.totalPages) return;
    if (page === this.pagination.currentPage) return;

    this.pagination.currentPage = page;
    this.updateVisiblePages();
    this.emitPageChange(page);
  }

  /**
   * Go to first page
   */
  goFirst(): void {
    this.goToPage(1);
  }

  /**
   * Go to last page
   */
  goLast(): void {
    this.goToPage(this.pagination.totalPages);
  }

  /**
   * Go to previous page
   */
  goPrev(): void {
    this.goToPage(this.pagination.currentPage - 1);
  }

  /**
   * Go to next page
   */
  goNext(): void {
    this.goToPage(this.pagination.currentPage + 1);
  }

  /**
   * Emit page change event
   */
  private emitPageChange(page: number): void {
    const out = OutputObject.ok({
      id: this.pagination.id,
      type: 'pagination',
      action: 'pageChange',
      data: { 
        page, 
        totalPages: this.pagination.totalPages,
        itemsPerPage: this.pagination.itemsPerPage
      }
    });
    this.output.emit(out);
  }

  /**
   * Track by function
   */
  trackByPage(index: number, page: number): number {
    return page;
  }
}
