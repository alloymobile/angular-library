import {
  Component,
  Input,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdLinkLogoModel } from './td-link-logo.model';
import { IdHelper } from '../share/id-helper';

/**
 * TdLinkLogo - Navigation link with logo image and optional label
 *
 * Usage:
 * ```html
 * <td-link-logo [model]="linkLogoModel"></td-link-logo>
 * ```
 */
@Component({
  selector: 'td-link-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-link-logo.html',
  styleUrl: './td-link-logo.css',
})
export class TdLinkLogo implements OnInit {
  private idHelper = inject(IdHelper);

  @Input({ required: true }) model!: TdLinkLogoModel;

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
    if (!this.model || !(this.model instanceof TdLinkLogoModel)) {
      throw new Error('TdLinkLogo requires `model` (TdLinkLogoModel instance).');
    }
    this.domId = this.idHelper.getDomId('link-logo', this.model.id);
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
