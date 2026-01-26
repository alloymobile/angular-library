// td-link-bar.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnInit,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { TdLinkBarModel, TdLinkBarItem } from './td-link-bar.model';
import { OutputObject } from '../../share';

import { TdLink } from '../../cell/td-link/td-link';
import { TdLinkIcon } from '../../cell/td-link-icon/td-link-icon';
import { TdLinkLogo } from '../../cell/td-link-logo/td-link-logo';

import { TdLinkModel } from '../../cell/td-link/td-link.model';
import { TdLinkIconModel } from '../../cell/td-link-icon/td-link-icon.model';
import { TdLinkLogoModel } from '../../cell/td-link-logo/td-link-logo.model';

@Component({
  selector: 'td-link-bar',
  standalone: true,
  imports: [CommonModule, TdLink, TdLinkIcon, TdLinkLogo],
  templateUrl: './td-link-bar.html',
  styleUrls: ['./td-link-bar.css'],
})
export class TdLinkBar implements OnInit, OnChanges {
  @Input({ required: true }) linkBar!: TdLinkBarModel;
  @Output() output = new EventEmitter<OutputObject>();

  /** Track which link is currently selected */
  selectedId: string = '';

  /** Processed links with active class injected */
  processedLinks: TdLinkBarItem[] = [];

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.setInitialSelection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkBar']) {
      if (!this.linkBar || !(this.linkBar instanceof TdLinkBarModel)) {
        throw new Error('TdLinkBar requires `linkBar` (TdLinkBarModel instance).');
      }
      this.setInitialSelection();
    }
  }

  /**
   * Set initial selectedId based on current URL path
   */
  private setInitialSelection(): void {
    if (!this.isBrowser || !this.linkBar?.links) {
      this.rebuildProcessedLinks();
      return;
    }

    const currentPath = window.location.pathname;

    // Find link that matches current path (only internal links)
    const matchingLink = this.linkBar.links.find((item) => {
      const href = (item as any)?.href;
      if (typeof href !== 'string') return false;
      
      // Only match internal links
      const isInternal = href.startsWith('/') && !href.startsWith('//');
      if (!isInternal) return false;

      // Exact match or starts with (for nested routes)
      return currentPath === href ||
             (href !== '/' && currentPath.startsWith(href));
    });

    if (matchingLink) {
      this.selectedId = (matchingLink as any)?.id ?? '';
    } else {
      this.selectedId = '';
    }

    this.rebuildProcessedLinks();
  }

  /**
   * Rebuild processed links array with active class injected
   */
  private rebuildProcessedLinks(): void {
    if (!this.linkBar?.links) {
      this.processedLinks = [];
      return;
    }

    this.processedLinks = this.linkBar.links.map((item) => {
      const itemId = (item as any)?.id ?? '';
      const isSelected = itemId !== '' && itemId === this.selectedId;
      return this.cloneWithActive(item, isSelected);
    });
  }

  /**
   * Clone item with active class set
   */
  private cloneWithActive(item: TdLinkBarItem, isSelected: boolean): TdLinkBarItem {
    const activeClass = isSelected ? this.linkBar.selected : '';

    if (item instanceof TdLinkModel) {
      return new TdLinkModel({
        id: item.id,
        name: item.name,
        href: item.href,
        className: item.className,
        active: activeClass,
        target: item.target,
        rel: item.rel,
        title: item.title,
      });
    }

    if (item instanceof TdLinkIconModel) {
      return new TdLinkIconModel({
        id: item.id,
        href: item.href,
        icon: item.icon,
        name: item.name,
        className: item.className,
        active: activeClass,
        target: item.target,
        rel: item.rel,
        title: item.title,
        ariaLabel: item.ariaLabel,
      });
    }

    if (item instanceof TdLinkLogoModel) {
      return new TdLinkLogoModel({
        id: item.id,
        name: item.name,
        href: item.href,
        logo: item.logo,
        className: item.className,
        active: activeClass,
        target: item.target,
        rel: item.rel,
        title: item.title,
        ariaLabel: item.ariaLabel,
      });
    }

    return item;
  }

  /**
   * Handle output from child link components
   * Updates selection state and re-emits to parent
   */
  onLinkOutput(innerOut: OutputObject): void {
    const itemId = innerOut.id ?? '';
    const isInternal = innerOut.data?.isInternal === true;

    // Only update selection for internal links (external links leave the app)
    if (isInternal && itemId) {
      this.selectedId = itemId;
      this.rebuildProcessedLinks();
    }

    // Re-emit output to parent with additional context
    const out = new OutputObject({
      id: this.linkBar.id,
      type: 'link-bar',
      action: innerOut.action,
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...innerOut.data,
        linkId: itemId,
        linkBarId: this.linkBar.id,
      },
    });

    this.output.emit(out);
  }

  isLink(item: TdLinkBarItem): item is TdLinkModel {
    return item instanceof TdLinkModel;
  }

  isLinkIcon(item: TdLinkBarItem): item is TdLinkIconModel {
    return item instanceof TdLinkIconModel;
  }

  isLinkLogo(item: TdLinkBarItem): item is TdLinkLogoModel {
    return item instanceof TdLinkLogoModel;
  }

  trackByLink = (index: number, item: TdLinkBarItem): string => {
    const id = (item as any)?.id;
    return typeof id === 'string' && id.trim() ? id : `link-${index}`;
  };
}