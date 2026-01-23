import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdNavBarModel } from './td-nav-bar.model';
import { OutputObject } from '../../share';

import { TdLinkBar } from '../td-link-bar/td-link-bar';
import { TdLinkLogo } from '../../cell/td-link-logo/td-link-logo';

@Component({
  selector: 'td-nav-bar',
  standalone: true,
  imports: [CommonModule, TdLinkBar, TdLinkLogo],
  templateUrl: './td-nav-bar.html',
  styleUrls: ['./td-nav-bar.css'],
})
export class TdNavBar implements OnChanges {
  @Input({ required: true }) navBar!: TdNavBarModel;
  @Output() output = new EventEmitter<OutputObject>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['navBar']) {
      // no-op
    }
  }

  onLogoOutput(innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.navBar.id,
      type: 'navbar',
      action: innerOut.action || 'logo-click',
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...innerOut.data,
        source: 'logo',
      },
    });
    this.output.emit(out);
  }

  onLinkBarOutput(innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.navBar.id,
      type: 'navbar',
      action: innerOut.action || 'link-click',
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...innerOut.data,
        source: 'linkBar',
      },
    });
    this.output.emit(out);
  }
}
