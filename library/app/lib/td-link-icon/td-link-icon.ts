import {
  Component,
  Input,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdLinkIconModel } from './td-link-icon.model';
import { TdIcon } from '../td-icon/td-icon';
import { IdHelper } from '../share/id-helper';

/**
 * TdLinkIcon - Navigation link with icon and optional label
 *
 * Usage:
 * ```html
 * <td-link-icon [model]="linkIconModel"></td-link-icon>
 * ```
 */
@Component({
  selector: 'td-link-icon',
  standalone: true,
  imports: [CommonModule, TdIcon],
  templateUrl: './td-link-icon.html',
  styleUrl: './td-link-icon.css',
})
export class TdLinkIcon implements OnInit {
  private idHelper = inject(IdHelper);

  @Input({ required: true }) model!: TdLinkIconModel;

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
    if (!this.model || !(this.model instanceof TdLinkIconModel)) {
      throw new Error('TdLinkIcon requires `model` (TdLinkIconModel instance).');
    }
    this.domId = this.idHelper.getDomId('link-icon', this.model.id);
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
