import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TdLinkModel } from './td-link.model';
import { generateId } from '../../share/id-helper';

@Component({
  selector: 'td-link',
  standalone: true,
  imports: [],
  templateUrl: './td-link.html',
  styleUrl: './td-link.css',
})
export class TdLink implements OnInit, OnChanges {
  @Input({ required: true }) link!: TdLinkModel;

  domId = '';
  safeRel: string | undefined = undefined;
  computedClass = '';

  ngOnInit(): void {
    this.ensureLink();
    this.applyLink();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['link']) {
      this.ensureLink();
      this.applyLink();
    }
  }

  private ensureLink(): void {
    if (!this.link || !(this.link instanceof TdLinkModel)) {
      throw new Error('TdLink requires `link` (TdLinkModel instance).');
    }
  }

  private applyLink(): void {
    const incomingId = this.link.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.link.id = incomingId;
    } else {
      const next = generateId('link');
      this.domId = next;
      this.link.id = next;
    }

    this.safeRel = this.link.getSafeRel();

    this.computedClass = [this.link.className || 'nav-link', this.link.active || '']
      .filter(Boolean)
      .join(' ');
  }
}
