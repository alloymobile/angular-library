// src/lib/components/tissue/td-link-bar/td-link-bar.component.ts

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkBarObject, cloneWithActiveAndClick } from './td-link-bar.model';
import { TdLinkComponent } from '../../cell/td-link/td-link.component';
import { TdLinkIconComponent } from '../../cell/td-link-icon/td-link-icon.component';
import { TdLinkLogoComponent } from '../../cell/td-link-logo/td-link-logo.component';
import { LinkObject } from '../../cell/td-link/td-link.model';
import { LinkIconObject } from '../../cell/td-link-icon/td-link-icon.model';
import { LinkLogoObject } from '../../cell/td-link-logo/td-link-logo.model';

/**
 * TdLinkBarComponent
 * 
 * Renders a navigation bar with links.
 * Supports three types of links: TdLink, TdLinkIcon, TdLinkLogo
 */
@Component({
  selector: 'td-link-bar',
  standalone: true,
  imports: [CommonModule, TdLinkComponent, TdLinkIconComponent, TdLinkLogoComponent],
  templateUrl: './td-link-bar.component.html',
  styleUrls: ['./td-link-bar.component.css']
})
export class TdLinkBarComponent implements OnInit, OnChanges {
  /**
   * Input: LinkBarObject instance (required)
   */
  @Input() linkBar!: LinkBarObject;

  // State
  selectedId = '';

  // Cloned links with active state and wrapped onClick
  clonedLinks: (LinkObject | LinkIconObject | LinkLogoObject)[] = [];

  ngOnInit(): void {
    this.validateInput();
    this.buildClonedLinks();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkBar']) {
      this.validateInput();
      this.selectedId = '';
      this.buildClonedLinks();
    }
  }

  private validateInput(): void {
    if (!this.linkBar || !(this.linkBar instanceof LinkBarObject)) {
      throw new Error('TdLinkBarComponent requires `linkBar` prop (LinkBarObject instance).');
    }
  }

  /**
   * Build cloned links with active state and wrapped onClick
   */
  private buildClonedLinks(): void {
    this.clonedLinks = this.linkBar.links.map(item => {
      const isSelected = (item?.id ?? '') === this.selectedId;
      return cloneWithActiveAndClick(
        item,
        this.linkBar.selected,
        isSelected,
        (e: Event) => this.wrapClick(item, e)
      );
    });
  }

  /**
   * Handle link click - update selection and call original handler
   */
  private wrapClick(item: any, e: Event): void {
    const nextId = item.id || `${item.href || ''}-${item.name || ''}`;
    this.selectedId = nextId;
    this.buildClonedLinks();
    item.onClick?.(e);
  }

  /**
   * Check if title should be shown
   */
  get hasTitle(): boolean {
    return this.linkBar.hasTitle();
  }

  /**
   * Check link type
   */
  isLinkObject(link: any): link is LinkObject {
    return link instanceof LinkObject;
  }

  isLinkIconObject(link: any): link is LinkIconObject {
    return link instanceof LinkIconObject;
  }

  isLinkLogoObject(link: any): link is LinkLogoObject {
    return link instanceof LinkLogoObject;
  }

  /**
   * Get track by key for ngFor
   */
  trackByFn(index: number, item: any): string {
    return item?.id ?? index.toString();
  }
}
