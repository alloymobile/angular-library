import { generateId } from '../../utils/id-helper';

export type TdIconAriaMode = 'auto' | 'decorative' | 'labelled';

export interface TdIconConfig {
  iconClass: string;     // required: "fa-solid fa-user"
  id?: string;           // optional
  className?: string;    // wrapper span classes

  title?: string;
  ariaLabel?: string;
  ariaMode?: TdIconAriaMode; // auto | decorative | labelled
}

export class TdIconObject {
  id: string;
  iconClass: string;
  className: string;

  title: string;
  ariaLabel: string;
  ariaMode: TdIconAriaMode;

  constructor(icon: TdIconConfig) {
    if (!icon || !icon.iconClass || !String(icon.iconClass).trim()) {
      throw new Error('TdIconObject requires `iconClass`.');
    }

    this.id =
      icon.id && String(icon.id).trim()
        ? String(icon.id).trim()
        : generateId('td-icon');

    this.iconClass = String(icon.iconClass).trim();

    this.className =
      typeof icon.className === 'string' && icon.className.trim()
        ? icon.className.trim()
        : 'd-inline-flex align-items-center justify-content-center';

    this.title = typeof icon.title === 'string' ? icon.title : '';
    this.ariaLabel = typeof icon.ariaLabel === 'string' ? icon.ariaLabel : '';
    this.ariaMode = icon.ariaMode ?? 'auto';
  }

  private isDecorative(): boolean {
    if (this.ariaMode === 'decorative') return true;
    if (this.ariaMode === 'labelled') return false;
    return !this.ariaLabel.trim() && !this.title.trim();
  }

  role(): string | null {
    return this.isDecorative() ? null : 'img';
  }

  ariaHidden(): 'true' | null {
    return this.isDecorative() ? 'true' : null;
  }

  ariaLabelValue(): string | null {
    if (this.isDecorative()) return null;
    const v = this.ariaLabel.trim();
    return v ? v : null;
  }

  titleValue(): string | null {
    const v = this.title.trim();
    return v ? v : null;
  }
}
