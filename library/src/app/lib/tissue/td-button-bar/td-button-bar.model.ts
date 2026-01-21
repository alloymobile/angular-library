// td-button-bar.model.ts
/**
 * TdButtonBarModel - Model for button group/bar
 *
 * Uses ONLY:
 * - TdButtonModel
 * - TdButtonIconModel
 * - TdButtonDropDownModel
 *
 * No readonly props (parent can update).
 */
import { generateId, TagObject, TagObjectConfig } from '../../share';

import { TdButtonModel } from '../../cell/td-button/td-button.model';
import { TdButtonIconModel } from '../../cell/td-button-icon/td-button-icon.model';
import { TdButtonDropDownModel } from '../../cell/td-button-drop-down/td-button-drop-down.model';

export type TdButtonBarItem = TdButtonModel | TdButtonIconModel | TdButtonDropDownModel;

export class TdButtonBarModel {
  id: string;
  className: string;
  title: TagObject;
  type: string;
  buttonClass: string;
  buttons: TdButtonBarItem[];
  selected: string;

  constructor(cfg: any = {}) {
    this.id = typeof cfg.id === 'string' && cfg.id.trim() ? cfg.id : generateId('buttonBar');
    this.className = typeof cfg.className === 'string' ? cfg.className : 'd-flex justify-content-center';
    this.type = typeof cfg.type === 'string' ? cfg.type : 'TdButtonBar';
    this.buttonClass = typeof cfg.buttonClass === 'string' ? cfg.buttonClass : 'nav-item';
    this.selected = typeof cfg.selected === 'string' ? cfg.selected : 'active';

    if (cfg.title instanceof TagObject) {
      this.title = cfg.title;
    } else if (cfg.title) {
      this.title = new TagObject(cfg.title as TagObjectConfig);
    } else {
      this.title = new TagObject({});
    }

    const raw: unknown[] = Array.isArray(cfg.buttons) ? cfg.buttons : [];
    this.buttons = raw.map((b: unknown) => this.normalizeButton(b));
  }

  hasTitle(): boolean {
    return !!(this.title && this.title.name && this.title.name.trim());
  }

  private normalizeButton(b: unknown): TdButtonBarItem {
    if (b instanceof TdButtonModel) return b;
    if (b instanceof TdButtonIconModel) return b;
    if (b instanceof TdButtonDropDownModel) return b;

    const anyB = b as any;

    if (anyB && typeof anyB === 'object' && 'linkBar' in anyB) {
      return new TdButtonDropDownModel(anyB);
    }

    if (anyB && typeof anyB === 'object' && 'icon' in anyB && anyB.icon) {
      return new TdButtonIconModel(anyB);
    }

    const safe = anyB && typeof anyB === 'object' ? anyB : {};
    if (!safe.name) safe.name = 'Button';
    return new TdButtonModel(safe);
  }
}
