// td-button-bar.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdButtonBarModel, TdButtonBarItem } from './td-button-bar.model';

import { TdButton } from '../../cell/td-button/td-button';
import { TdButtonModel } from '../../cell/td-button/td-button.model';

import { TdButtonIcon } from '../../cell/td-button-icon/td-button-icon';
import { TdButtonIconModel } from '../../cell/td-button-icon/td-button-icon.model';

import { TdButtonDropDown } from '../../cell/td-button-drop-down/td-button-drop-down';
import { TdButtonDropDownModel } from '../../cell/td-button-drop-down/td-button-drop-down.model';

import { OutputObject } from '../../share';

@Component({
  selector: 'td-button-bar',
  standalone: true,
  imports: [CommonModule, TdButton, TdButtonIcon, TdButtonDropDown],
  templateUrl: './td-button-bar.html',
  styleUrls: ['./td-button-bar.css'],
})
export class TdButtonBar implements OnChanges {
  @Input({ required: true }) buttonBar!: TdButtonBarModel;
  @Output() output = new EventEmitter<OutputObject>();

  selectedId = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buttonBar']) {
      this.selectedId = '';
      this.applyActiveFlags();
    }
  }

  onButtonOutput(btn: TdButtonModel, out: OutputObject): void {
    this.selectedId = btn.id ?? '';
    this.applyActiveFlags();
    this.output.emit(out);
  }

  onButtonIconOutput(btn: TdButtonIconModel, out: OutputObject): void {
    this.selectedId = btn.id ?? '';
    this.applyActiveFlags();
    this.output.emit(out);
  }

  onDropDownOutput(dd: TdButtonDropDownModel, out: any): void {
    // Mark dropdown as selected too (so active class works)
    this.selectedId = dd.id ?? '';
    this.applyActiveFlags();

    // If dropdown already emits OutputObject, forward it
    if (out instanceof OutputObject) {
      this.output.emit(out);
      return;
    }

    // Otherwise wrap clicked link item into OutputObject for a consistent bar output
    const link = out?.link ?? out?.data?.link ?? out;

    const payload = OutputObject.ok({
      id: dd.id,
      type: 'dropdown',
      action: 'click',
      data: {
        id: link?.id,
        name: link?.name,
        href: link?.href,
        link: link ? { id: link.id, name: link.name, href: link.href } : null,
      },
    });

    this.output.emit(payload);
  }

  isButton(item: TdButtonBarItem): item is TdButtonModel {
    return item instanceof TdButtonModel;
  }

  isButtonIcon(item: TdButtonBarItem): item is TdButtonIconModel {
    return item instanceof TdButtonIconModel;
  }

  isDropDown(item: TdButtonBarItem): item is TdButtonDropDownModel {
    return item instanceof TdButtonDropDownModel;
  }

  trackByItem(index: number, item: TdButtonBarItem): string {
    return (item as any).id ?? String(index);
  }

  private applyActiveFlags(): void {
    if (!this.buttonBar || !Array.isArray(this.buttonBar.buttons)) return;

    for (const item of this.buttonBar.buttons) {
      const isOn = !!(item as any).id && (item as any).id === this.selectedId;

      // TdButtonModel
      if (item instanceof TdButtonModel) {
        item.isActive = isOn;
        if (!item.active) item.active = this.buttonBar.selected;
        continue;
      }

      // TdButtonIconModel
      if (item instanceof TdButtonIconModel) {
        item.isActive = isOn;
        if (!item.active) item.active = this.buttonBar.selected;
        continue;
      }

      // TdButtonDropDownModel
      if (item instanceof TdButtonDropDownModel) {
        item.isActive = isOn;
        if (!item.active) item.active = this.buttonBar.selected;
        continue;
      }
    }
  }
}
