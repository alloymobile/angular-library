/**
 * TdModalToastModel - Model for confirmation/toast modal
 *
 * Rules:
 * - Uses existing embedded models only (TdButtonModel)
 * - No readonly (parent can mutate)
 * - Model assigns defaults if missing
 * - Embedded object hydration is done by embedded model itself
 */

import { generateId } from '../../share';
import { TdButtonModel } from '../../cell/td-button/td-button.model';

export class TdModalToastModel {
  id: string;
  title: string;
  className: string;
  action: string;
  message: string;

  // embedded model (reuse existing)
  submit: TdButtonModel;

  constructor(cfg: any = {}) {
    this.id = typeof cfg.id === 'string' && cfg.id.trim() ? cfg.id : generateId('modalToast');

    this.title = typeof cfg.title === 'string' ? cfg.title : '';
    this.className =
      typeof cfg.className === 'string' && cfg.className.trim()
        ? cfg.className
        : 'modal fade';

    this.action = typeof cfg.action === 'string' ? cfg.action : '';
    this.message = typeof cfg.message === 'string' ? cfg.message : '';

    // submit button (TdButtonModel) — ALWAYS via `new`
    // TdButtonModel requires name, so we default to 'OK' if missing.
    const rawSubmit = cfg.submit;

    if (rawSubmit instanceof TdButtonModel) {
      this.submit = rawSubmit;
    } else {
      const s = rawSubmit && typeof rawSubmit === 'object' ? rawSubmit : {};
      if (!s.name) s.name = 'OK';

      // Give a sensible default class if none provided
      if (!s.className) s.className = 'btn btn-primary';

      this.submit = new TdButtonModel(s);
    }
  }

  hasMessage(): boolean {
    return typeof this.message === 'string' && this.message.trim().length > 0;
  }

  getDisplayTitle(): string {
    // Same pattern as modal: "Action + Title" if both exist
    const a = (this.action || '').trim();
    const t = (this.title || '').trim();
    if (a && t) return `${a}: ${t}`;
    return t || a || 'Notice';
  }

  toJSON(): any {
    return {
      id: this.id,
      title: this.title,
      className: this.className,
      action: this.action,
      message: this.message,
      // keep submit minimal (since it's embedded model)
      submit: {
        id: this.submit.id,
        name: this.submit.name,
        className: this.submit.className,
        isActive: this.submit.isActive,
        active: this.submit.active,
        disabled: this.submit.disabled,
        title: this.submit.title,
        ariaLabel: this.submit.ariaLabel,
        tabIndex: this.submit.tabIndex,
      },
    };
  }
}
