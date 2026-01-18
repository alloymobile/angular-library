import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdButtonModel } from './td-button.model';
import { IdHelper } from '../share/id-helper';
import { OutputObject } from '../share/output-object';

/**
 * TdButton - Accessible button component with active state tracking
 *
 * Usage:
 * ```html
 * <td-button [model]="buttonModel" (output)="handleOutput($event)"></td-button>
 * ```
 *
 * Emits OutputObject on click only.
 */
@Component({
  selector: 'td-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-button.html',
  styleUrl: './td-button.css',
})
export class TdButton implements OnInit {
  private idHelper = inject(IdHelper);

  @Input({ required: true }) model!: TdButtonModel;
  @Output() output = new EventEmitter<OutputObject>();

  @ViewChild('buttonEl', { static: true }) buttonEl!: ElementRef<HTMLButtonElement>;

  domId = '';

  // Active state tracking using signals
  private hovered = signal(false);
  private pressed = signal(false);
  private focused = signal(false);

  // Computed class that merges base + active when any state is "on"
  computedClass = computed(() => {
    const isOn = this.hovered() || this.pressed() || this.focused();
    const classes = [this.model?.className ?? 'btn btn-primary'];
    if (isOn && this.model?.active) {
      classes.push(this.model.active);
    }
    return classes.filter(Boolean).join(' ');
  });

  ngOnInit(): void {
    if (!this.model || !(this.model instanceof TdButtonModel)) {
      throw new Error('TdButton requires `model` (TdButtonModel instance).');
    }
    this.domId = this.idHelper.getDomId('btn', this.model.id);
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
    if (this.model.disabled) return;

    const out = OutputObject.ok({
      id: this.domId,
      type: 'button',
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
