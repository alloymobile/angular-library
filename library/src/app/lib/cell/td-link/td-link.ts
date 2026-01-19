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
  @Input({ required: true }) model!: TdLinkModel;

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
    if (!this.model || !(this.model instanceof TdLinkModel)) {
      throw new Error('TdLink requires `model` (TdLinkModel instance).');
    }
  }

  private applyModel(): void {
    const incomingId = this.model.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.model.id = incomingId;
    } else {
      const next = generateId('link');
      this.domId = next;
      this.model.id = next;
    }

    this.safeRel = this.model.getSafeRel();
    this.computedClass = [this.model.className || 'nav-link', this.model.active || '']
      .filter(Boolean)
      .join(' ');
  }
}
