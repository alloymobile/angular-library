// src/lib/components/tissue/td-button-bar/td-button-bar.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonBarObject } from './td-button-bar.model';
import { TdButtonComponent } from '../../cell/td-button/td-button';
import { TdButtonIconComponent } from '../../cell/td-button-icon/td-button-icon';
import { ButtonObject } from '../../cell/td-button/td-button.model';
import { ButtonIconObject } from '../../cell/td-button-icon/td-button-icon.model';

/**
 * TdButtonBarComponent
 * 
 * Renders a bar of buttons.
 * Supports two types: TdButton, TdButtonIcon
 */
@Component({
  selector: 'td-button-bar',
  standalone: true,
  imports: [CommonModule, TdButtonComponent, TdButtonIconComponent],
  templateUrl: './td-button-bar.html',
  styleUrls: ['./td-button-bar.css']
})
export class TdButtonBarComponent implements OnInit, OnChanges {
  /**
   * Input: ButtonBarObject instance (required)
   */
  @Input() buttonBar!: ButtonBarObject;

  /**
   * Output: Emits when any button is clicked
   */
  @Output() output = new EventEmitter<any>();

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buttonBar']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.buttonBar || !(this.buttonBar instanceof ButtonBarObject)) {
      throw new Error('TdButtonBarComponent requires `buttonBar` prop (ButtonBarObject instance).');
    }
  }

  /**
   * Check if title should be shown
   */
  get hasTitle(): boolean {
    return this.buttonBar.hasTitle();
  }

  /**
   * Handle button output - bubble up to parent
   */
  onButtonOutput(out: any): void {
    this.output.emit(out);
  }

  /**
   * Check button type
   */
  isButtonObject(btn: any): btn is ButtonObject {
    return btn instanceof ButtonObject;
  }

  isButtonIconObject(btn: any): btn is ButtonIconObject {
    return btn instanceof ButtonIconObject;
  }

  /**
   * Get track by key for ngFor
   */
  trackByFn(index: number, item: any): string {
    return item?.id ?? index.toString();
  }
}
