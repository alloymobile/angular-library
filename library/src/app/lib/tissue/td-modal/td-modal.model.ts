// td-modal.model.ts
/**
 * TdModalModel - Model for modal dialog with input fields
 *
 * Rules (latest):
 * - Reuse existing embedded models only:
 *   - fields -> TdInputModel
 *   - submit -> TdButtonModel
 * - This model hydrates ONLY its own direct properties.
 * - Embedded objects hydrate themselves via their constructors.
 * - No readonly (parent can mutate).
 */

import { generateId } from '../../share';

import { TdButtonModel } from '../../cell/td-button/td-button.model';
import { TdInputModel } from '../../cell/td-input/td-input.model';

export class TdModalModel {
  id: string;
  title: string;
  className: string;
  action: string;

  submit: TdButtonModel;
  fields: TdInputModel[];

  data: Record<string, any>;

  constructor(cfg: any = {}) {
    this.id = typeof cfg.id === 'string' && cfg.id.trim() ? cfg.id : generateId('modal');

    this.title = typeof cfg.title === 'string' ? cfg.title : '';
    this.className = typeof cfg.className === 'string' ? cfg.className : 'modal fade';
    this.action = typeof cfg.action === 'string' ? cfg.action : '';

    // submit (TdButtonModel)
    if (cfg.submit instanceof TdButtonModel) {
      this.submit = cfg.submit;
    } else if (cfg.submit && typeof cfg.submit === 'object') {
      // TdButtonModel requires `name`
      const safe = { ...(cfg.submit as any) };
      if (!safe.name) safe.name = 'Submit';
      this.submit = new TdButtonModel(safe);
    } else {
      this.submit = new TdButtonModel({
        name: 'Submit',
        className: 'btn btn-primary',
      });
    }

    // fields (TdInputModel)
    const rawFields = Array.isArray(cfg.fields) ? cfg.fields : [];
    this.fields = rawFields.map((f: any) => {
      if (f instanceof TdInputModel) return f;

      const safe = f && typeof f === 'object' ? { ...f } : {};
      // TdInputModel requires `name`
      if (!safe.name) safe.name = generateId('field');
      return new TdInputModel(safe);
    });

    // data (derive from fields + merge overrides)
    const base: Record<string, any> = {};
    this.fields.forEach((f) => {
      base[f.name] = f.value;
    });

    const override = cfg.data && typeof cfg.data === 'object' ? cfg.data : {};
    this.data = { ...base, ...override };
  }

  hasFields(): boolean {
    return this.fields.length > 0;
  }

  getDisplayTitle(): string {
    if (this.action && this.title) return `${this.action} a ${this.title}`;
    return this.title || this.action || 'Modal';
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      className: this.className,
      action: this.action,
      data: this.data,
    };
  }
}
