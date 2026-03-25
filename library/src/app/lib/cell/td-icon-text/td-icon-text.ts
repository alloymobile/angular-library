import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

import { TdIconTextModel, TdIconTextConfig } from './td-icon-text.model';
import { TdIcon } from '../td-icon/td-icon';
import { generateId } from '../../share/id-helper';

@Component({
  selector: 'td-icon-text',
  standalone: true,
  imports: [TdIcon],
  templateUrl: './td-icon-text.html',
  styleUrls: ['./td-icon-text.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdIconText implements OnInit, OnChanges {
  @Input({ required: true }) iconText!: TdIconTextModel | TdIconTextConfig;

  model!: TdIconTextModel;
  domId = '';

  ngOnInit(): void {
    this.normalizeModel();
    this.ensureDomId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['iconText']) {
      this.normalizeModel();
      this.ensureDomId();
    }
  }

  private normalizeModel(): void {
    if (this.iconText instanceof TdIconTextModel) {
      this.model = this.iconText;
    } else if (this.iconText && typeof this.iconText === 'object') {
      this.model = new TdIconTextModel(this.iconText as TdIconTextConfig);
    } else {
      throw new Error('TdIconText requires `iconText` (TdIconTextModel or TdIconTextConfig).');
    }
  }

  private ensureDomId(): void {
    const incoming = this.model.id?.trim();
    this.domId = incoming || generateId('icon-text');
  }

  get isIconLeft(): boolean {
    return this.model.iconPosition === 'left';
  }

  get isIconRight(): boolean {
    return this.model.iconPosition === 'right';
  }

  get displayValue(): string {
    return this.model.getDisplayValue();
  }
}