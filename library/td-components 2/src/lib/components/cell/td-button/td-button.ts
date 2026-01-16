// src/lib/components/cell/td-button/td-button.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonObject } from './td-button.model';
import { OutputObject } from '../../../utils/id-helper';

/**
 * TdButtonComponent
 * 
 * Renders a button with active state tracking.
 * Emits OutputObject ONLY on click.
 */
@Component({
  selector: 'td-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-button.html',
  styleUrls: ['./td-button.css']
})
export class TdButtonComponent implements OnInit, OnChanges {
  /**
   * Input: ButtonObject instance (required)
   */
  @Input() button!: ButtonObject;

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
    if (changes['button']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.button || !(this.button instanceof ButtonObject)) {
      throw new Error('TdButtonComponent requires `button` prop (ButtonObject instance).');
    }
  }

  /**
   * Compute merged className based on active state
   */
  get mergedClassName(): string {
    const isActive = this.isHovered || this.isPressed || this.isFocused;
    return [this.button.className, isActive && this.button.active].filter(Boolean).join(' ');
  }

  // Event handlers
  onMouseEnter(event: Event): void {
    this.isHovered = true;
    this.button.onMouseEnter?.(event, this.button);
  }

  onMouseLeave(event: Event): void {
    this.isHovered = false;
    this.isPressed = false;
    this.button.onMouseLeave?.(event, this.button);
  }

  onMouseDown(): void {
    this.isPressed = true;
  }

  onMouseUp(): void {
    this.isPressed = false;
  }

  onFocus(event: Event): void {
    this.isFocused = true;
    this.button.onFocus?.(event, this.button);
  }

  onBlur(event: Event): void {
    this.isFocused = false;
    this.button.onBlur?.(event, this.button);
  }

  onKeyDown(event: Event): void {
    this.button.onKeyDown?.(event, this.button);
  }

  onKeyUp(event: Event): void {
    this.button.onKeyUp?.(event, this.button);
  }

  onClick(event: Event): void {
    // Emit OutputObject
    const out = OutputObject.ok({
      id: this.button.id,
      type: 'button',
      action: 'click',
      data: {
        name: this.button.name
      }
    });
    this.output.emit(out);

    // Call model's onClick handler
    this.button.onClick?.(event, this.button);
  }

  // Public methods for external access
  focus(): void {
    this.buttonEl?.nativeElement?.focus();
  }

  click(): void {
    this.buttonEl?.nativeElement?.click();
  }
}
