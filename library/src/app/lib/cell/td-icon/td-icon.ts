import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { TdIconModel } from './td-icon.model';
import { generateId } from '../../share/id-helper';

@Component({
  selector: 'td-icon',
  standalone: true,
  templateUrl: './td-icon.html',
  styleUrl: './td-icon.css',
})
export class TdIcon implements OnInit, OnChanges {
  @Input({ required: true }) icon!: TdIconModel;

  domId = '';

  ngOnInit(): void {
    this.ensureIcon();
    this.ensureDomId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['icon']) {
      this.ensureIcon();
      this.ensureDomId();
    }
  }

  private ensureIcon(): void {
    if (!this.icon || !(this.icon instanceof TdIconModel)) {
      throw new Error('TdIcon requires `icon` (TdIconModel instance).');
    }
  }

  private ensureDomId(): void {
    const incoming = this.icon.id?.trim();

    if (incoming) {
      this.domId = incoming;
      this.icon.id = incoming;
      return;
    }

    const next = generateId('icon');
    this.domId = next;
    this.icon.id = next;
  }
}
