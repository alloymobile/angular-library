// src/lib/components/cell/td-quantity/td-quantity.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuantityObject } from './td-quantity.model';
import { OutputObject } from '../../../utils/id-helper';

function toNum(x: any, fallback: number): number {
  if (typeof x === 'string') {
    const s = x.trim();
    if (!s) return fallback;
    const n = Number(s);
    return Number.isFinite(n) ? n : fallback;
  }
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * TdQuantityComponent
 * 
 * Renders a quantity input with +/- buttons.
 */
@Component({
  selector: 'td-quantity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './td-quantity.component.html',
  styleUrls: ['./td-quantity.component.css']
})
export class TdQuantityComponent implements OnInit, OnChanges {
  /**
   * Input: QuantityObject instance (required)
   */
  @Input() quantity!: QuantityObject;

  /**
   * Output: Emits OutputObject on change
   */
  @Output() output = new EventEmitter<OutputObject>();

  // Internal state
  qty = 0;
  display = '';

  ngOnInit(): void {
    this.validateInput();
    this.initValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quantity']) {
      this.validateInput();
      this.initValue();
    }
  }

  private validateInput(): void {
    if (!this.quantity || !(this.quantity instanceof QuantityObject)) {
      throw new Error('TdQuantityComponent requires `quantity` prop (QuantityObject instance).');
    }
  }

  private initValue(): void {
    const initial = clamp(toNum(this.quantity.value, this.quantity.min), this.quantity.min, this.quantity.max);
    this.qty = initial;
    this.display = String(initial);
    this.quantity.sync(initial);
  }

  /**
   * Check if decrease is disabled
   */
  get decDisabled(): boolean {
    return this.quantity.disabled || this.qty <= this.quantity.min;
  }

  /**
   * Check if increase is disabled
   */
  get incDisabled(): boolean {
    return this.quantity.disabled || this.qty >= this.quantity.max;
  }

  /**
   * Get decrease button class
   */
  get btnDecClass(): string {
    return this.quantity.decrease?.className || 'btn btn-outline-secondary';
  }

  /**
   * Get increase button class
   */
  get btnIncClass(): string {
    return this.quantity.increase?.className || 'btn btn-outline-secondary';
  }

  /**
   * Get input class
   */
  get inputClass(): string {
    return this.quantity.input?.className || 'form-control text-center';
  }

  /**
   * Emit output event
   */
  private emit(action: string, nextValue: number, event?: Event): void {
    this.quantity.onChange?.(nextValue, this.quantity, { action, event });

    const payload = OutputObject.ok({
      id: this.quantity.id,
      type: 'quantity',
      action,
      data: {
        [this.quantity.name]: nextValue
      }
    });
    this.output.emit(payload);
  }

  /**
   * Commit a new value
   */
  private commit(nextValue: number, action: string, event?: Event): void {
    const next = clamp(toNum(nextValue, this.quantity.min), this.quantity.min, this.quantity.max);
    this.qty = next;
    this.display = String(next);
    this.quantity.sync(next);
    this.emit(action, next, event);
  }

  /**
   * Decrease quantity
   */
  onDecrease(event: Event): void {
    if (this.decDisabled) return;
    this.commit(this.qty - this.quantity.step, 'dec', event);
  }

  /**
   * Increase quantity
   */
  onIncrease(event: Event): void {
    if (this.incDisabled) return;
    this.commit(this.qty + this.quantity.step, 'inc', event);
  }

  /**
   * Handle input change
   */
  onInputChange(): void {
    const n = toNum(this.display, NaN);
    if (Number.isFinite(n)) {
      const next = clamp(n, this.quantity.min, this.quantity.max);
      this.qty = next;
      this.quantity.sync(next);
    }
  }

  /**
   * Handle input blur
   */
  onInputBlur(event: Event): void {
    const n = toNum(this.display, NaN);
    if (!Number.isFinite(n)) {
      this.display = String(this.qty);
      return;
    }
    this.commit(n, 'set', event);
  }
}
