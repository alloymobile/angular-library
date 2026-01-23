import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdLoadingModel } from './td-loading.model';
import { TdIcon } from '../td-icon/td-icon';
import { generateId } from '../../share/id-helper';

@Component({
  selector: 'td-loading',
  standalone: true,
  imports: [CommonModule, TdIcon],
  templateUrl: './td-loading.html',
  styleUrl: './td-loading.css',
})
export class TdLoading implements OnInit, OnChanges {
  @Input({ required: true }) loading!: TdLoadingModel;

  domId = '';

  ngOnInit(): void {
    this.ensureLoading();
    this.applyLoading();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading']) {
      this.ensureLoading();
      this.applyLoading();
    }
  }

  private ensureLoading(): void {
    if (!this.loading || !(this.loading instanceof TdLoadingModel)) {
      throw new Error('TdLoading requires `loading` (TdLoadingModel instance).');
    }
  }

  private applyLoading(): void {
    const incomingId = this.loading.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.loading.id = incomingId;
    } else {
      const next = generateId('loading');
      this.domId = next;
      this.loading.id = next;
    }
  }
}
