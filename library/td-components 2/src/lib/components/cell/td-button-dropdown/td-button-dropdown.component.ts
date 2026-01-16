// src/lib/components/cell/td-button-dropdown/td-button-dropdown.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDropDownObject } from './td-button-dropdown.model';
import { OutputObject } from '../../../utils/id-helper';

/**
 * TdButtonDropDownComponent
 * 
 * Renders a dropdown button with Bootstrap dropdown menu.
 * Uses data-bs-toggle for Bootstrap dropdown functionality.
 */
@Component({
  selector: 'td-button-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-button-dropdown.component.html',
  styleUrls: ['./td-button-dropdown.component.css']
})
export class TdButtonDropDownComponent implements OnInit, OnChanges {
  /**
   * Input: ButtonDropDownObject instance (required)
   */
  @Input() buttonDropDown!: ButtonDropDownObject;

  /**
   * Output: Emits when a dropdown item is clicked
   */
  @Output() output = new EventEmitter<any>();

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buttonDropDown']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.buttonDropDown || !(this.buttonDropDown instanceof ButtonDropDownObject)) {
      throw new Error('TdButtonDropDownComponent requires `buttonDropDown` prop (ButtonDropDownObject instance).');
    }
  }

  /**
   * Get links from linkBar
   */
  get links(): any[] {
    return this.buttonDropDown.linkBar?.links || [];
  }

  /**
   * Get dropdown menu class
   */
  get menuClass(): string {
    return this.buttonDropDown.linkBar?.className || 'dropdown-menu';
  }

  /**
   * Get link item class
   */
  get linkClass(): string {
    return this.buttonDropDown.linkBar?.linkClass || 'dropdown-item';
  }

  /**
   * Check if badge should be shown
   */
  get showBadge(): boolean {
    return this.buttonDropDown.showBadge();
  }

  /**
   * Handle link click
   */
  onLinkClick(link: any, event: Event): void {
    // Call original onClick if exists
    if (link.onClick) {
      link.onClick(event);
    }

    // Emit to parent
    this.output.emit(link);
  }
}
