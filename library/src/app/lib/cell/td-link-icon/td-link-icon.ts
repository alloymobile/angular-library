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
  @Input({ required: true }) linkIcon!: TdLinkIconModel;

  domId = '';
  safeRel: string | undefined = undefined;
  computedClass = '';

  ngOnInit(): void {
    this.ensureLinkIcon();
    this.applyLinkIcon();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkIcon']) {
      this.ensureLinkIcon();
      this.applyLinkIcon();
    }
  }

  private ensureLinkIcon(): void {
    if (!this.linkIcon || !(this.linkIcon instanceof TdLinkIconModel)) {
      throw new Error('TdLinkIcon requires `linkIcon` (TdLinkIconModel instance).');
    }
  }

  private applyLinkIcon(): void {
    const incomingId = this.linkIcon.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.linkIcon.id = incomingId;
    } else {
      const next = generateId('link-icon');
      this.domId = next;
      this.linkIcon.id = next;
    }

    this.safeRel = this.linkIcon.getSafeRel();

    this.computedClass = [this.linkIcon.className || 'nav-link', this.linkIcon.active || '']
      .filter(Boolean)
      .join(' ');
  }
}
