// td-button-drop-down.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdIcon } from '../../cell/td-icon/td-icon';
import { TdLinkBar } from '../../tissue/td-link-bar/td-link-bar';

import { TdButtonDropDownModel } from './td-button-drop-down.model';
import { TdLinkBarItem } from '../../tissue/td-link-bar/td-link-bar.model';

type TdLinkBarOutputLike =
  | TdLinkBarItem
  | { link?: TdLinkBarItem; data?: { link?: TdLinkBarItem } }
  | unknown;

@Component({
  selector: 'td-button-drop-down',
  standalone: true,
  imports: [CommonModule, TdIcon, TdLinkBar],
  templateUrl: './td-button-drop-down.html',
  styleUrls: ['./td-button-drop-down.css'],
})
export class TdButtonDropDown {
  private _buttonDropDown?: TdButtonDropDownModel;

  @Input({ required: true })
  set buttonDropDown(value: TdButtonDropDownModel) {
    if (!(value instanceof TdButtonDropDownModel)) {
      throw new Error('TdButtonDropDown: buttonDropDown must be TdButtonDropDownModel');
    }
    this._buttonDropDown = value;
  }

  get buttonDropDown(): TdButtonDropDownModel {
    if (!this._buttonDropDown) {
      this._buttonDropDown = new TdButtonDropDownModel({
        linkBar: { className: 'dropdown-menu', linkClass: 'dropdown-item', links: [] },
      });
    }
    return this._buttonDropDown;
  }

  @Output() output = new EventEmitter<TdLinkBarItem>();

  get buttonClasses(): string {
    const base = this.buttonDropDown.className || '';
    const active = this.buttonDropDown.isActive ? this.buttonDropDown.active : '';
    return [base, active].filter(Boolean).join(' ');
  }

  onLinkBarOutput(out: TdLinkBarOutputLike): void {
    const link = this.extractLink(out);
    if (link) this.output.emit(link);
  }

  private extractLink(out: TdLinkBarOutputLike): TdLinkBarItem | null {
    if (this.isLinkBarItem(out)) return out;

    if (out && typeof out === 'object') {
      if ('link' in out) {
        const v = (out as any).link;
        if (this.isLinkBarItem(v)) return v;
      }

      if ('data' in out) {
        const d = (out as any).data;
        if (d && typeof d === 'object' && 'link' in d) {
          const v = (d as any).link;
          if (this.isLinkBarItem(v)) return v;
        }
      }
    }

    return null;
  }

  private isLinkBarItem(v: any): v is TdLinkBarItem {
    return v != null && typeof v === 'object';
  }
}
