// src/lib/components/cell/td-icon/td-icon.ts

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconObject, IconConfig } from './td-icon.model';

/**
 * TdIconComponent
 * 
 * Renders:
 *   <span id="..." class="...">
 *     <i class="..." aria-hidden="true"></i>
 *   </span>
 * 
 * NOTE: id is on the <span>.
 */
@Component({
  selector: 'td-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-icon.html',
  styleUrls: ['./td-icon.css']
})
export class TdIconComponent implements OnInit, OnChanges {
  /**
   * Input: IconObject instance (required)
   * The object will be created and injected by parent component
   */
  @Input() icon!: IconObject;

  ngOnInit(): void {
    this.validateInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon']) {
      this.validateInput();
    }
  }

  private validateInput(): void {
    if (!this.icon || !(this.icon instanceof IconObject)) {
      throw new Error('TdIconComponent requires `icon` prop (IconObject instance).');
    }
  }
}
