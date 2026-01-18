import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdButtonSubmitModel } from './td-button-submit.model';
import { TdIconModel } from '../td-icon/td-icon.model';
import { TdIcon } from '../td-icon/td-icon';
import { IdHelper } from '../share/id-helper';
import { OutputObject } from '../share/output-object';

/**
 * TdButtonSubmit - Submit button with loading state
 *
 * Behavior:
 * - On click, component "arms" immediately (shows spinning icon, disables button)
 * - Parent controls reset by toggling model.loading
 * - When parent sets loading=false, component clears armed state
 *
 * Usage:
 * ```html
 * <td-button-submit [model]="submitModel" (output)="handleSubmit($event)"></td-button-submit>
 * ```
 *
 * Emits OutputObject on click only.
 */
@Component({
  selector: 'td-button-submit',
  standalone: true,
  imports: [CommonModule, TdIcon],
  templateUrl: './td-button-submit.html',
  styleUrl: './td-button-submit.css',
})
export class TdButtonSubmit implements OnInit, OnChanges {
  private idHelper = inject(IdHelper);

  @Input({ required: true }) model!: TdButtonSubmitModel;
  @Output() output = new EventEmitter<OutputObject>();

  @ViewChild('buttonEl', { static: true }) buttonEl!: ElementRef<HTMLButtonElement>;

  domId = '';

  // Internal armed state - flips ON immediately on click
  private armed = signal(false);

  // Active state tracking
  private hovered = signal(false);
  private pressed = signal(false);
  private focused = signal(false);

  // Effective loading = internal armed OR external loading
  isLoading = computed(() => this.armed() || !!this.model?.loading);

  // Effective disabled = parent disabled OR loading
  isDisabled = computed(() => !!this.model?.disabled || this.isLoading());

  // Computed class that merges base + active
  computedClass = computed(() => {
    const isOn = this.hovered() || this.pressed() || this.focused();
    const classes = [this.model?.className ?? 'btn btn-primary'];
    if (isOn && this.model?.active) {
      classes.push(this.model.active);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Computed icon with spin class when loading
  computedIcon = computed((): TdIconModel => {
    const base = this.model?.icon;
    if (!base) {
      return new TdIconModel({ iconClass: 'fa-solid fa-spinner fa-spin' });
    }

    const iconClass = base.iconClass || '';
    const loading = this.isLoading();

    // Add fa-spin only while loading if not already present
    const shouldSpin = loading && iconClass && !/\bfa-spin\b/.test(iconClass) && !/\bfa-pulse\b/.test(iconClass);
    const nextClass = shouldSpin ? `${iconClass} fa-spin` : iconClass;

    return new TdIconModel({
      id: base.id,
      iconClass: nextClass,
      className: base.className,
    });
  });

  ngOnInit(): void {
    if (!this.model || !(this.model instanceof TdButtonSubmitModel)) {
      throw new Error('TdButtonSubmit requires `model` (TdButtonSubmitModel instance).');
    }
    this.domId = this.idHelper.getDomId('btn-submit', this.model.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When parent sets loading=false, release the arm so it can be used again
    if (changes['model'] && !this.model?.loading) {
      this.armed.set(false);
    }
  }

  // Public methods for programmatic control
  focus(): void {
    this.buttonEl?.nativeElement?.focus();
  }

  click(): void {
    this.buttonEl?.nativeElement?.click();
  }

  // Event handlers
  onClick(event: MouseEvent): void {
    // If already disabled/loading, do nothing (prevents double submit)
    if (this.isDisabled()) return;

    // Arm immediately so the UI reacts instantly
    this.armed.set(true);

    const out = OutputObject.ok({
      id: this.domId,
      type: 'button-submit',
      action: 'click',
      data: {
        name: this.model.name,
      },
    });

    this.output.emit(out);
  }

  onMouseEnter(): void {
    this.hovered.set(true);
  }

  onMouseLeave(): void {
    this.hovered.set(false);
    this.pressed.set(false);
  }

  onMouseDown(): void {
    this.pressed.set(true);
  }

  onMouseUp(): void {
    this.pressed.set(false);
  }

  onFocus(): void {
    this.focused.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
  }
}
