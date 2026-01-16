// src/lib/components/cell/td-button-submit/td-button-submit.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonSubmitObject } from './td-button-submit.model';
import { TdIconComponent } from '../td-icon/td-icon.component';
import { IconObject } from '../td-icon/td-icon.model';
import { OutputObject } from '../../../utils/id-helper';

/**
 * TdButtonSubmitComponent
 * 
 * Behavior:
 * - When user clicks, component "arms" immediately:
 *   - shows rotating/loading icon
 *   - disables to prevent double submit
 * - Parent controls reset by toggling model.loading:
 *   - when parent sets loading=false, component clears armed and becomes reusable
 * 
 * Emits:
 * - ONLY "click" (clean, consistent with TdButton)
 */
@Component({
  selector: 'td-button-submit',
  standalone: true,
  imports: [CommonModule, TdIconComponent],
  templateUrl: './td-button-submit.component.html',
  styleUrls: ['./td-button-submit.component.css']
})
export class TdButtonSubmitComponent implements OnInit, OnChanges {
  /**
   * Input: ButtonSubmitObject instance (required)
   */
  @Input() buttonSubmit!: ButtonSubmitObject;

  /**
   * Output: Emits OutputObject on click
   */
  @Output() output = new EventEmitter<OutputObject>();

  @ViewChild('buttonEl') buttonEl!: ElementRef<HTMLButtonElement>;

  // Internal arm: flips ON immediately on click (before parent roundtrip)
  armed = false;

  // Active state tracking
  isHovered = false;
  isPressed = false;
  isFocused = false;

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buttonSubmit']) {
      this.validateInput();
      
      // When parent says loading=false, release the arm
      if (!this.buttonSubmit.loading) {
        this.armed = false;
      }
    }
  }

  private validateInput(): void {
    if (!this.buttonSubmit || !(this.buttonSubmit instanceof ButtonSubmitObject)) {
      throw new Error('TdButtonSubmitComponent requires `buttonSubmit` prop (ButtonSubmitObject instance).');
    }
  }

  /**
   * Effective loading is internal OR external
   */
  get isLoading(): boolean {
    return this.armed || this.buttonSubmit.loading;
  }

  /**
   * Disabled if parent disabled OR currently loading/armed
   */
  get isDisabled(): boolean {
    return this.buttonSubmit.disabled || this.isLoading;
  }

  /**
   * Compute merged className based on active state
   */
  get mergedClassName(): string {
    const isActive = this.isHovered || this.isPressed || this.isFocused;
    return [this.buttonSubmit.className, isActive && this.buttonSubmit.active].filter(Boolean).join(' ');
  }

  /**
   * Get computed icon with spin class when loading
   */
  get computedIcon(): IconObject {
    return this.buttonSubmit.getComputedIcon(this.isLoading);
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
    // If already disabled/loading, do nothing (prevents double submit)
    if (this.isDisabled) {
      return;
    }

    // Arm immediately so the UI reacts instantly
    this.armed = true;

    // Emit "click" only
    const out = OutputObject.ok({
      id: this.buttonSubmit.id,
      type: 'button-submit',
      action: 'click',
      data: {
        name: this.buttonSubmit.name
      }
    });
    this.output.emit(out);

    // Call model's onClick handler
    this.buttonSubmit.onClick?.(event, this.buttonSubmit);
  }

  // Public methods for external access
  focus(): void {
    this.buttonEl?.nativeElement?.focus();
  }

  click(): void {
    this.buttonEl?.nativeElement?.click();
  }
}
