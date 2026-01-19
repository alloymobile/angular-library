import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { SideBarObject } from './td-sidebar.model';
import { OutputObject } from '../../share';
import { TdLinkBar } from '../td-link-bar/td-link-bar';
import { LinkBarObject, LinkObject } from '../td-link-bar/td-link-bar.model';

declare var bootstrap: any;

@Component({
  selector: 'td-sidebar',
  standalone: true,
  imports: [CommonModule, TdLinkBar],
  templateUrl: './td-sidebar.html',
  styleUrls: ['./td-sidebar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdSidebar {
  @Input({ required: true }) sidebar!: SideBarObject;
  @Output() output = new EventEmitter<OutputObject>();

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Handle link click from a category
   */
  onLinkBarOutput(category: LinkBarObject, innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.sidebar.id,
      type: 'sidebar',
      action: innerOut.action || 'link-click',
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...innerOut.data,
        categoryId: category.id,
        categoryTitle: category.title?.name ?? '',
      },
    });

    this.output.emit(out);

    // Close offcanvas on mobile after link click
    this.closeOffcanvas();
  }

  /**
   * Close the offcanvas (mobile sidebar)
   */
  private closeOffcanvas(): void {
    if (!this.isBrowser) return;

    const offcanvasEl = document.getElementById(this.sidebar.close);
    if (!offcanvasEl) return;

    if (typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
      const instance = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (instance) {
        instance.hide();
      }
    }
  }

  /**
   * Check if a link in a category is selected
   */
  isLinkSelected(link: LinkObject): boolean {
    return this.sidebar.isLinkSelected(link);
  }

  /**
   * Get selected class for link
   */
  getSelectedClass(link: LinkObject): string {
    return this.isLinkSelected(link) ? 'active' : '';
  }

  /**
   * Track by function for categories
   */
  trackByCategory(index: number, category: LinkBarObject): string {
    return category.id;
  }
}
