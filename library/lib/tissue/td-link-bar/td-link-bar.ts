// td-link-bar.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdLinkBarModel, TdLinkBarItem } from './td-link-bar.model';
import { OutputObject } from '../../share';

import { TdLink } from '../../cell/td-link/td-link';
import { TdLinkIcon } from '../../cell/td-link-icon/td-link-icon';
import { TdLinkLogo } from '../../cell/td-link-logo/td-link-logo';

import { TdLinkModel } from '../../cell/td-link/td-link.model';
import { TdLinkIconModel } from '../../cell/td-link-icon/td-link-icon.model';
import { TdLinkLogoModel } from '../../cell/td-link-logo/td-link-logo.model';

@Component({
  selector: 'td-link-bar',
  standalone: true,
  imports: [CommonModule, TdLink, TdLinkIcon, TdLinkLogo],
  templateUrl: './td-link-bar.html',
  styleUrls: ['./td-link-bar.css'],
})
export class TdLinkBar implements OnChanges {
  @Input({ required: true }) linkBar!: TdLinkBarModel;
  @Output() output = new EventEmitter<OutputObject>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkBar']) {
      if (!this.linkBar || !(this.linkBar instanceof TdLinkBarModel)) {
        throw new Error('TdLinkBar requires `linkBar` (TdLinkBarModel instance).');
      }
    }
  }

  // Take input and redirect to output (only name)
  onItemClick(item: TdLinkBarItem, event: Event): void {
    const anyItem = item as any;

    const outType =
      this.isLinkIcon(item) ? 'link-icon' :
      this.isLinkLogo(item) ? 'link-logo' :
      'link';

    const out = OutputObject.ok({
      id: typeof anyItem?.id === 'string' ? anyItem.id : '',
      type: outType,
      action: 'click',
      data: {
        name: typeof anyItem?.name === 'string' ? anyItem.name : '',
      },
    });

    this.output.emit(out);
  }

  isLink(item: TdLinkBarItem): item is TdLinkModel {
    return item instanceof TdLinkModel;
  }

  isLinkIcon(item: TdLinkBarItem): item is TdLinkIconModel {
    return item instanceof TdLinkIconModel;
  }

  isLinkLogo(item: TdLinkBarItem): item is TdLinkLogoModel {
    return item instanceof TdLinkLogoModel;
  }

  trackByLink = (index: number, item: TdLinkBarItem): string => {
    const id = (item as any)?.id;
    return typeof id === 'string' && id.trim() ? id : `link-${index}`;
  };
}
