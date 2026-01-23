import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { SideBarObject } from './td-sidebar.model';
import { OutputObject } from '../../share';

import { TdLinkBar } from '../td-link-bar/td-link-bar';
import { TdLinkBarModel } from '../td-link-bar/td-link-bar.model';

declare var bootstrap: any;

@Component({
  selector: 'td-sidebar',
  standalone: true,
  imports: [CommonModule, TdLinkBar],
  templateUrl: './td-sidebar.html',
  styleUrls: ['./td-sidebar.css'],
})
export class TdSidebar implements OnChanges {
  @Input({ required: true }) sidebar!: SideBarObject;
  @Output() output = new EventEmitter<OutputObject>();

  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // nothing required here; input changes trigger view updates automatically
    // but this is kept for your preference and future hooks (validation, etc.)
    if (changes['sidebar']) {
      // you can add any side-effect if needed later
    }
  }

  trackByCategory(index: number, category: TdLinkBarModel): string {
    return category.id;
  }

  onLinkBarOutput(category: TdLinkBarModel, innerOut: OutputObject): void {
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
    this.closeOffcanvas();
  }

  closeOffcanvas(): void {
    if (!this.isBrowser) return;

    const el = document.getElementById(this.sidebar.close);
    if (!el) return;

    if (typeof bootstrap !== 'undefined' && bootstrap?.Offcanvas) {
      const instance = bootstrap.Offcanvas.getInstance(el) || new bootstrap.Offcanvas(el);
      instance.hide();
    }
  }
}
