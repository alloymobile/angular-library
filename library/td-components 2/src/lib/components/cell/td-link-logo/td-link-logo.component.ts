// src/lib/components/cell/td-link-logo/td-link-logo.component.ts

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkLogoObject } from './td-link-logo.model';

/**
 * TdLinkLogoComponent
 * 
 * Renders an anchor link with a logo image and optional text label.
 */
@Component({
  selector: 'td-link-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-link-logo.component.html',
  styleUrls: ['./td-link-logo.component.css']
})
export class TdLinkLogoComponent implements OnInit, OnChanges {
  /**
   * Input: LinkLogoObject instance (required)
   */
  @Input() linkLogo!: LinkLogoObject;

  // Active state tracking
  isHovered = false;
  isPressed = false;
  isFocused = false;

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkLogo']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.linkLogo || !(this.linkLogo instanceof LinkLogoObject)) {
      throw new Error('TdLinkLogoComponent requires `linkLogo` prop (LinkLogoObject instance).');
    }
  }

  /**
   * Compute merged className based on active state
   */
  get mergedClassName(): string {
    const isActive = this.isHovered || this.isPressed || this.isFocused;
    return [this.linkLogo.className, isActive && this.linkLogo.active].filter(Boolean).join(' ');
  }

  /**
   * Get safe rel attribute
   */
  get safeRel(): string | undefined {
    return this.linkLogo.getSafeRel();
  }

  /**
   * Check if has label
   */
  get hasLabel(): boolean {
    return this.linkLogo.hasLabel();
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
    if (this.linkLogo.onClick) {
      this.linkLogo.onClick(event);
    }
  }
}
