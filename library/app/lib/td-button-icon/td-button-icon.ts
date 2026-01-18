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

import { TdButtonIconModel } from './td-button-icon.model';
import { TdIcon } from '../td-icon/td-icon';
import { IdHelper } from '../share/id-helper';
import { OutputObject } from '../share/output-object';

/**
 * TdButtonIcon - Button with icon and optional label
 *
 * Usage:
 * ```html
 * <td-button-icon [model]="buttonIconModel" (output)="handleOutput($event)"></td-button-icon>
 * ```
 *
 * Emits OutputObject on click only.
 */
@Component({
  selector: 'td-button-icon',
  standalone: true,
  imports: [CommonModule, TdIcon],
  templateUrl: './td-button-icon.html',
  styleUrl: './td-button-icon.css',
})
export class TdButtonIcon implements OnInit {
  private idHelper = inject(IdHelper);

  @Input({ required: true }) model!: TdButtonIconModel;
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
    if (!this.model || !(this.model instanceof TdButtonIconModel)) {
      throw new Error('TdButtonIcon requires `model` (TdButtonIconModel instance).');
    }
    this.domId = this.idHelper.getDomId('btn-icon', this.model.id);
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

    const eventName = this.model.name || this.model.title;

    const out = OutputObject.ok({
      id: this.domId,
      type: 'button-icon',
      action: 'click',
      data: {
        name: eventName,
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
