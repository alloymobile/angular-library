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
  @Input({ required: true }) model!: TdLinkLogoModel;

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
    if (!this.model || !(this.model instanceof TdLinkLogoModel)) {
      throw new Error('TdLinkLogo requires `model` (TdLinkLogoModel instance).');
    }
  }

  private applyModel(): void {
    const incomingId = this.model.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.model.id = incomingId;
    } else {
      const next = generateId('link-logo');
      this.domId = next;
      this.model.id = next;
    }

    this.safeRel = this.model.getSafeRel();

    this.computedClass = [this.model.className || 'nav-link', this.model.active || '']
      .filter(Boolean)
      .join(' ');
  }
}
