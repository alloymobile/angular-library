// src/lib/components/cell/td-link/td-link.ts

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkObject } from './td-link.model';

/**
 * TdLinkComponent
 * 
 * Renders a styled anchor link with active state tracking.
 */
@Component({
  selector: 'td-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-link.html',
  styleUrls: ['./td-link.css']
})
export class TdLinkComponent implements OnInit, OnChanges {
  /**
   * Input: LinkObject instance (required)
   */
  @Input() link!: LinkObject;

  // Active state tracking
  isHovered = false;
  isPressed = false;
  isFocused = false;

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['link']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.link || !(this.link instanceof LinkObject)) {
      throw new Error('TdLinkComponent requires `link` prop (LinkObject instance).');
    }
  }

  /**
   * Compute merged className based on active state
   */
  get mergedClassName(): string {
    const isActive = this.isHovered || this.isPressed || this.isFocused;
    return [this.link.className, isActive && this.link.active].filter(Boolean).join(' ');
  }

  /**
   * Get safe href (fallback to #)
   */
  get safeHref(): string {
    return this.link.href || '#';
  }

  /**
   * Get safe rel attribute
   */
  get safeRel(): string | undefined {
    return this.link.getSafeRel();
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
    if (this.link.onClick) {
      this.link.onClick(event);
    }
  }
}
