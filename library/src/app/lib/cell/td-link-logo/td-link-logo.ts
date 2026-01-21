// td-link-logo.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { generateId } from '../../share/id-helper';

import { TdLinkLogoModel } from './td-link-logo.model';

@Component({
  selector: 'td-link-logo',
  standalone: true,
  imports: [],
  templateUrl: './td-link-logo.html',
  styleUrl: './td-link-logo.css',
})
export class TdLinkLogo implements OnInit, OnChanges {
  @Input({ required: true }) linkLogo!: TdLinkLogoModel;

  domId = '';
  safeRel: string | undefined = undefined;
  computedClass = '';

  ngOnInit(): void {
    this.ensureLinkLogo();
    this.applyLinkLogo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkLogo']) {
      this.ensureLinkLogo();
      this.applyLinkLogo();
    }
  }

  private ensureLinkLogo(): void {
    if (!this.linkLogo || !(this.linkLogo instanceof TdLinkLogoModel)) {
      throw new Error('TdLinkLogo requires `linkLogo` (TdLinkLogoModel instance).');
    }
  }

  private applyLinkLogo(): void {
    const incomingId = this.linkLogo.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.linkLogo.id = incomingId;
    } else {
      const next = generateId('link-logo');
      this.domId = next;
      this.linkLogo.id = next;
    }

    this.safeRel = this.linkLogo.getSafeRel();

    this.computedClass = [this.linkLogo.className || 'nav-link', this.linkLogo.active || '']
      .filter(Boolean)
      .join(' ');
  }
}
