import {
  Component,
  Input,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdLinkModel } from './td-link.model';
import { IdHelper } from '../share/id-helper';

/**
 * TdLink - Accessible navigation link with active state tracking
 *
 * Usage:
 * ```html
 * <td-link [model]="linkModel"></td-link>
 * ```
 *
 * Note: This component does not emit events. For click handling,
 * use the native (click) binding or router navigation.
 */
@Component({
  selector: 'td-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-link.html',
  styleUrl: './td-link.css',
})
export class TdLink implements OnInit {
  private idHelper = inject(IdHelper);

  @Input({ required: true }) model!: TdLinkModel;

  domId = '';
  safeRel: string | undefined = undefined;

  // Active state tracking using signals
  private hovered = signal(false);
  private pressed = signal(false);
  private focused = signal(false);

  // Computed class that merges base + active when any state is "on"
  computedClass = computed(() => {
    const isOn = this.hovered() || this.pressed() || this.focused();
    const classes = [this.model?.className ?? 'nav-link'];
    if (isOn && this.model?.active) {
      classes.push(this.model.active);
    }
    return classes.filter(Boolean).join(' ');
  });

  ngOnInit(): void {
    if (!this.model || !(this.model instanceof TdLinkModel)) {
      throw new Error('TdLink requires `model` (TdLinkModel instance).');
    }
    this.domId = this.idHelper.getDomId('link', this.model.id);
    this.safeRel = this.model.getSafeRel();
  }

  // Event handlers for active state tracking
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
