import { Component, Input } from '@angular/core';
import { generateId } from '../../utils/id-helper';
import { TdIconObject, TdIconAriaMode } from './td-icon.model';

@Component({
  selector: 'td-icon',
  standalone: false,
  templateUrl: './td-icon.html',
  styleUrl: './td-icon.css',
})
export class TdIcon {
  private _icon!: TdIconObject;
  private _domId = '';

  @Input({ required: true })
  set icon(value: TdIconObject) {
    this._icon = value;

    // If an explicit id is provided, use it.
    if (this._icon?.id) {
      this._domId = this._icon.id;
      return;
    }

    // Otherwise generate once per component instance.
    if (!this._domId) {
      this._domId = generateId('icon');
    }
  }

  get icon(): TdIconObject {
    return this._icon;
  }

  get domId(): string {
    return this._domId;
  }

  get resolvedAriaMode(): TdIconAriaMode {
    const mode = this.icon?.ariaMode ?? 'auto';
    if (mode !== 'auto') return mode;
    return this.icon?.ariaLabel?.trim() ? 'labelled' : 'decorative';
  }

  get isDecorative(): boolean {
    return this.resolvedAriaMode === 'decorative';
  }

  get ariaLabel(): string | null {
    const label = (this.icon?.ariaLabel ?? '').trim();
    return label ? label : null;
  }

  get title(): string | null {
    const t = (this.icon?.title ?? '').trim();
    return t ? t : null;
  }
}
