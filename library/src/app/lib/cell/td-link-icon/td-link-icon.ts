// td-link-icon.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { TdLinkIconModel } from './td-link-icon.model';
import { TdIcon } from '../td-icon/td-icon';
import { generateId } from '../../share/id-helper';

@Component({
  selector: 'td-link-icon',
  standalone: true,
  imports: [TdIcon],
  templateUrl: './td-link-icon.html',
  styleUrl: './td-link-icon.css',
})
export class TdLinkIcon implements OnInit, OnChanges {
  @Input({ required: true }) model!: TdLinkIconModel;

  domId = '';
  safeRel: string | undefined = undefined;
  computedClass = '';

  ngOnInit(): void {
    this.ensureModel();
    this.applyModel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      this.ensureModel();
      this.applyModel();
    }
  }

  private ensureModel(): void {
    if (!this.model || !(this.model instanceof TdLinkIconModel)) {
      throw new Error('TdLinkIcon requires `model` (TdLinkIconModel instance).');
    }
  }

  private applyModel(): void {
    const incomingId = this.model.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.model.id = incomingId;
    } else {
      const next = generateId('link-icon');
      this.domId = next;
      this.model.id = next;
    }

    this.safeRel = this.model.getSafeRel();

    this.computedClass = [this.model.className || 'nav-link', this.model.active || '']
      .filter(Boolean)
      .join(' ');
  }
}
