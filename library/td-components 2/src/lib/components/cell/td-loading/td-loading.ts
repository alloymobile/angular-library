// src/lib/components/cell/td-loading/td-loading.ts

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingObject } from './td-loading.model';
import { TdIconComponent } from '../td-icon/td-icon';

/**
 * TdLoadingComponent
 * 
 * Renders a full-screen loading overlay with spinner and message.
 */
@Component({
  selector: 'td-loading',
  standalone: true,
  imports: [CommonModule, TdIconComponent],
  templateUrl: './td-loading.html',
  styleUrls: ['./td-loading.css']
})
export class TdLoadingComponent implements OnInit, OnChanges {
  /**
   * Input: LoadingObject instance (required)
   */
  @Input() loading!: LoadingObject;

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.loading || !(this.loading instanceof LoadingObject)) {
      throw new Error('TdLoadingComponent requires `loading` prop (LoadingObject instance).');
    }
  }
}
