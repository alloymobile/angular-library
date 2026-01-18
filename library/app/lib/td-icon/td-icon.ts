import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdIconModel } from './td-icon.model';
import { IdHelper } from '../share/id-helper';

/**
 * TdIcon - Renders a Font Awesome icon with wrapper
 *
 * Usage:
 * ```html
 * <td-icon [model]="iconModel"></td-icon>
 * ```
 *
 * Renders:
 * ```html
 * <span id="..." class="..." aria-hidden="true">
 *   <i class="..." aria-hidden="true"></i>
 * </span>
 * ```
 */
@Component({
  selector: 'td-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-icon.html',
  styleUrl: './td-icon.css',
})
export class TdIcon implements OnInit {
  private idHelper = inject(IdHelper);

  @Input({ required: true }) model!: TdIconModel;

  domId = '';

  ngOnInit(): void {
    if (!this.model || !(this.model instanceof TdIconModel)) {
      throw new Error('TdIcon requires `model` (TdIconModel instance).');
    }
    this.domId = this.idHelper.getDomId('icon', this.model.id);
  }
}
