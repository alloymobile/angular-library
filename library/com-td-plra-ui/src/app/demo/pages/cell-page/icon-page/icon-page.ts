// src/app/demo/pages/icon-page/icon-page.ts
import { Component } from '@angular/core';
import { TdIconObject } from '../../../../lib/cell/td-icon/td-icon.model';

import * as fas from '@fortawesome/free-solid-svg-icons';
import * as far from '@fortawesome/free-regular-svg-icons';
import * as fab from '@fortawesome/free-brands-svg-icons';

type IconItem = {
  name: string;
  cls: string;
  nameLc: string;
  clsLc: string;
};

function collect(pack: any, styleClass: string): IconItem[] {
  return Object.values(pack)
    .filter((it: any) => it && typeof it === 'object' && 'iconName' in it && 'prefix' in it)
    .map((it: any) => {
      const name = String(it.iconName || '');
      const cls = `${styleClass} fa-${name}`;
      return { name, cls, nameLc: name.toLowerCase(), clsLc: cls.toLowerCase() };
    });
}

const ALL_ICONS: IconItem[] = [
  ...collect(fas, 'fa-solid'),
  ...collect(far, 'fa-regular'),
  ...collect(fab, 'fa-brands'),
];

@Component({
  selector: 'icon-page',
  standalone: false,
  templateUrl: './icon-page.html',
  styleUrl: './icon-page.css',
})
export class IconPage {
  codeSample = `<td-icon [icon]="preview"></td-icon>`;

  selected = new TdIconObject({
    iconClass: ALL_ICONS[0]?.cls || 'fa-solid fa-user',
    className:
      'd-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle p-3 shadow-sm',
  });

  preview = new TdIconObject({
    id: this.selected.id,
    iconClass: `${this.selected.iconClass} fa-3x`,
    className: this.selected.className,
    ariaLabel: this.selected.ariaLabel,
    ariaMode: this.selected.ariaMode,
    title: this.selected.title,
  });

  jsonText = this.toJson(this.selected);
  jsonError = '';

  query = '';
  filtered: IconItem[] = ALL_ICONS;

  trackByIcon = (index: number, it: IconItem) => `${it.cls}-${index}`;

  private toJson(icon: TdIconObject): string {
    return JSON.stringify(
      {
        id: icon.id,
        iconClass: icon.iconClass,
        className: icon.className,
        ariaLabel: icon.ariaLabel,
        ariaMode: icon.ariaMode,
        title: icon.title,
      },
      null,
      2
    );
  }

  private sync(next: TdIconObject): void {
    this.selected = next;

    this.preview = new TdIconObject({
      id: this.selected.id,
      iconClass: `${this.selected.iconClass} fa-3x`,
      className: this.selected.className,
      ariaLabel: this.selected.ariaLabel,
      ariaMode: this.selected.ariaMode,
      title: this.selected.title,
    });

    this.jsonText = this.toJson(this.selected);
    this.jsonError = '';
  }

  isActive(it: IconItem): boolean {
    return it.cls === this.selected.iconClass;
  }

  selectIcon(it: IconItem): void {
    this.sync(
      new TdIconObject({
        iconClass: it.cls,
        className: this.selected.className,
        ariaLabel: this.selected.ariaLabel,
        ariaMode: this.selected.ariaMode,
        title: this.selected.title,
      })
    );
  }

  onQuery(val: string): void {
    this.query = val;
    const q = val.trim().toLowerCase();

    this.filtered = !q
      ? ALL_ICONS
      : ALL_ICONS.filter((i) => i.nameLc.includes(q) || i.clsLc.includes(q));
  }

  onJsonChange(val: string): void {
    this.jsonText = val;

    try {
      const parsed: any = JSON.parse(val);

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('JSON must be an object.');
      }
      if (!parsed.iconClass || typeof parsed.iconClass !== 'string') {
        throw new Error('Missing or invalid "iconClass".');
      }

      const next = new TdIconObject({
        id: typeof parsed.id === 'string' ? parsed.id : undefined,
        iconClass: parsed.iconClass,
        className: typeof parsed.className === 'string' ? parsed.className : undefined,
        ariaLabel: typeof parsed.ariaLabel === 'string' ? parsed.ariaLabel : undefined,
        ariaMode:
          parsed.ariaMode === 'auto' || parsed.ariaMode === 'decorative' || parsed.ariaMode === 'labelled'
            ? parsed.ariaMode
            : undefined,
        title: typeof parsed.title === 'string' ? parsed.title : undefined,
      });

      this.sync(next);
    } catch (e: any) {
      this.jsonError = e?.message || 'Invalid JSON.';
    }
  }

  formatJson(): void {
    try {
      const parsed = JSON.parse(this.jsonText);
      this.jsonText = JSON.stringify(parsed, null, 2);
      this.jsonError = '';
    } catch (e: any) {
      this.jsonError = e?.message || 'Invalid JSON.';
    }
  }
}
