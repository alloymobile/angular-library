import {
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdLoadingModel } from './td-loading.model';
import { TdIcon } from '../td-icon/td-icon';
import { IdHelper } from '../share/id-helper';

/**
 * TdLoading - Full-screen loading overlay with spinner
 *
 * Usage:
 * ```html
 * <td-loading [model]="loadingModel"></td-loading>
 * ```
 *
 * Toggle visibility by setting model.visible
 */
@Component({
  selector: 'td-loading',
  standalone: true,
  imports: [CommonModule, TdIcon],
  templateUrl: './td-loading.html',
  styleUrl: './td-loading.css',
})
export class TdLoading implements OnInit {
  private idHelper = inject(IdHelper);

  @Input({ required: true }) model!: TdLoadingModel;

  domId = '';

  ngOnInit(): void {
    if (!this.model || !(this.model instanceof TdLoadingModel)) {
      throw new Error('TdLoading requires `model` (TdLoadingModel instance).');
    }
    this.domId = this.idHelper.getDomId('loading', this.model.id);
  }
}
