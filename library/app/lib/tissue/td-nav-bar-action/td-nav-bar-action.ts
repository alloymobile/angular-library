// td-nav-bar-action.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdNavBarActionModel } from './td-nav-bar-action.model';
import { OutputObject } from '../../share';

import { TdLinkBar } from '../td-link-bar/td-link-bar';
import { TdButtonBar } from '../td-button-bar/td-button-bar';
import { TdLinkLogo } from '../../cell/td-link-logo/td-link-logo';

@Component({
  selector: 'td-nav-bar-action',
  standalone: true,
  imports: [CommonModule, TdLinkBar, TdButtonBar, TdLinkLogo],
  templateUrl: './td-nav-bar-action.html',
  styleUrls: ['./td-nav-bar-action.css'],
})
export class TdNavBarAction implements OnChanges {
  @Input({ required: true }) navBarAction!: TdNavBarActionModel;
  @Output() output = new EventEmitter<OutputObject>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['navBarAction']) {
      // no-op
    }
  }

  onLogoOutput(innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.navBarAction.id,
      type: 'navbar-action',
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
      id: this.navBarAction.id,
      type: 'navbar-action',
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

  onButtonBarOutput(innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.navBarAction.id,
      type: 'navbar-action',
      action: innerOut.action || 'button-click',
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...innerOut.data,
        source: 'buttonBar',
      },
    });
    this.output.emit(out);
  }
}
