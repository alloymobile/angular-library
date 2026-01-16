// src/lib/components/tissue/td-card/td-card.component.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardObject } from './td-card.model';
import { TdMediaComponent } from '../../cell/td-media/td-media.component';
import { TdLinkComponent } from '../../cell/td-link/td-link.component';

/**
 * TdCardComponent
 * 
 * Renders a Bootstrap-style card with media, title, description, tags, and links.
 */
@Component({
  selector: 'td-card',
  standalone: true,
  imports: [CommonModule, TdMediaComponent, TdLinkComponent],
  templateUrl: './td-card.component.html',
  styleUrls: ['./td-card.component.css']
})
export class TdCardComponent implements OnInit, OnChanges {
  /**
   * Input: CardObject instance (required)
   */
  @Input() card!: CardObject;

  /**
   * Output: Emits card events
   */
  @Output() output = new EventEmitter<any>();

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['card']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.card || !(this.card instanceof CardObject)) {
      throw new Error('TdCardComponent requires `card` prop (CardObject instance).');
    }
  }

  /**
   * Handle media output
   */
  onMediaOutput(out: any): void {
    this.output.emit(out);
  }

  /**
   * Track by function for tags
   */
  trackByFn(index: number, item: any): string {
    return item?.id ?? index.toString();
  }
}
