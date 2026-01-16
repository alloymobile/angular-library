// src/lib/components/cell/td-link-icon/td-link-icon.ts

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkIconObject } from './td-link-icon.model';
import { TdIconComponent } from '../td-icon/td-icon';

/**
 * TdLinkIconComponent
 * 
 * Renders an anchor link with an icon and optional text label.
 */
@Component({
  selector: 'td-link-icon',
  standalone: true,
  imports: [CommonModule, TdIconComponent],
  templateUrl: './td-link-icon.html',
  styleUrls: ['./td-link-icon.css']
})
export class TdLinkIconComponent implements OnInit, OnChanges {
  /**
   * Input: LinkIconObject instance (required)
   */
  @Input() linkIcon!: LinkIconObject;

  // Active state tracking
  isHovered = false;
  isPressed = false;
  isFocused = false;

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkIcon']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.linkIcon || !(this.linkIcon instanceof LinkIconObject)) {
      throw new Error('TdLinkIconComponent requires `linkIcon` prop (LinkIconObject instance).');
    }
  }

  /**
   * Compute merged className based on active state
   */
  get mergedClassName(): string {
    const isActive = this.isHovered || this.isPressed || this.isFocused;
    return [this.linkIcon.className, isActive && this.linkIcon.active].filter(Boolean).join(' ');
  }

  /**
   * Get safe rel attribute
   */
  get safeRel(): string | undefined {
    return this.linkIcon.getSafeRel();
  }

  /**
   * Check if has label
   */
  get hasLabel(): boolean {
    return this.linkIcon.hasLabel();
  }

  // Event handlers
  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
    this.isPressed = false;
  }

  onMouseDown(): void {
    this.isPressed = true;
  }

  onMouseUp(): void {
    this.isPressed = false;
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
  }

  onClick(event: Event): void {
    if (this.linkIcon.onClick) {
      this.linkIcon.onClick(event);
    }
  }
}
