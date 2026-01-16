// src/lib/components/cell/td-button-icon/td-button-icon.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonIconObject } from './td-button-icon.model';
import { TdIconComponent } from '../td-icon/td-icon';
import { OutputObject } from '../../../utils/id-helper';

/**
 * TdButtonIconComponent
 * 
 * Renders a button with an icon and optional text label.
 * Emits OutputObject ONLY on click.
 */
@Component({
  selector: 'td-button-icon',
  standalone: true,
  imports: [CommonModule, TdIconComponent],
  templateUrl: './td-button-icon.html',
  styleUrls: ['./td-button-icon.css']
})
export class TdButtonIconComponent implements OnInit, OnChanges {
  /**
   * Input: ButtonIconObject instance (required)
   */
  @Input() buttonIcon!: ButtonIconObject;

  /**
   * Output: Emits OutputObject on click
   */
  @Output() output = new EventEmitter<OutputObject>();

  @ViewChild('buttonEl') buttonEl!: ElementRef<HTMLButtonElement>;

  // Active state tracking
  isHovered = false;
  isPressed = false;
  isFocused = false;

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buttonIcon']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.buttonIcon || !(this.buttonIcon instanceof ButtonIconObject)) {
      throw new Error('TdButtonIconComponent requires `buttonIcon` prop (ButtonIconObject instance).');
    }
  }

  /**
   * Compute merged className based on active state
   */
  get mergedClassName(): string {
    const isActive = this.isHovered || this.isPressed || this.isFocused;
    return [this.buttonIcon.className, isActive && this.buttonIcon.active].filter(Boolean).join(' ');
  }

  /**
   * Check if has label
   */
  get hasLabel(): boolean {
    return this.buttonIcon.hasLabel();
  }

  // Event handlers
  onMouseEnter(event: Event): void {
    this.isHovered = true;
    this.buttonIcon.onMouseEnter?.(event, this.buttonIcon);
  }

  onMouseLeave(event: Event): void {
    this.isHovered = false;
    this.isPressed = false;
    this.buttonIcon.onMouseLeave?.(event, this.buttonIcon);
  }

  onMouseDown(): void {
    this.isPressed = true;
  }

  onMouseUp(): void {
    this.isPressed = false;
  }

  onFocus(event: Event): void {
    this.isFocused = true;
    this.buttonIcon.onFocus?.(event, this.buttonIcon);
  }

  onBlur(event: Event): void {
    this.isFocused = false;
    this.buttonIcon.onBlur?.(event, this.buttonIcon);
  }

  onKeyDown(event: Event): void {
    this.buttonIcon.onKeyDown?.(event, this.buttonIcon);
  }

  onKeyUp(event: Event): void {
    this.buttonIcon.onKeyUp?.(event, this.buttonIcon);
  }

  onClick(event: Event): void {
    const eventName = this.buttonIcon.name || this.buttonIcon.title;

    // Emit OutputObject
    const out = OutputObject.ok({
      id: this.buttonIcon.id,
      type: 'button-icon',
      action: 'click',
      data: {
        name: eventName
      }
    });
    this.output.emit(out);

    // Call model's onClick handler
    this.buttonIcon.onClick?.(event, this.buttonIcon);
  }

  // Public methods for external access
  focus(): void {
    this.buttonEl?.nativeElement?.focus();
  }

  click(): void {
    this.buttonEl?.nativeElement?.click();
  }
}
