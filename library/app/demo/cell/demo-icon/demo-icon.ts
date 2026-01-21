// demo-icon/demo-icon.ts
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdIcon } from '../../../lib/cell/td-icon/td-icon';
import { TdIconModel } from '../../../lib/cell/td-icon/td-icon.model';

type FaFamilyStyle = { family: string; style: string };

type FaIconFamiliesEntry = {
  label?: string;
  familyStylesByLicense?: {
    free?: FaFamilyStyle[];
    pro?: FaFamilyStyle[];
  };
};

type FaIconFamiliesMetadata = Record<string, FaIconFamiliesEntry>;

type FaIconItem = { name: string; cls: string };

@Component({
  selector: 'demo-icon',
  standalone: true,
  imports: [CommonModule, FormsModule, TdIcon],
  templateUrl: './demo-icon.html',
  styleUrl: './demo-icon.css',
})
export class DemoIcon implements OnInit {
  query = signal('');
  jsonText = '';
  jsonError = signal('');

  icons = signal<FaIconItem[]>([]);
  selectedIconClass = signal('fa-solid fa-user');
  wrapperClassName = signal(
    'd-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle p-3 shadow-sm'
  );

  filteredIcons = computed(() => {
    const list = this.icons();
    const q = this.query().trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (i) => i.name.toLowerCase().includes(q) || i.cls.toLowerCase().includes(q)
    );
  });

  displayModel = computed(() => {
    const parsed = this.safeParseJson(this.jsonText);
    const id = parsed?.id && typeof parsed.id === 'string' ? parsed.id : undefined;

    return new TdIconModel({
      id,
      iconClass: this.selectedIconClass() + ' fa-3x',
      className: this.wrapperClassName(),
    });
  });

  async ngOnInit(): Promise<void> {
    await this.loadAllFontAwesomeIcons();
    this.updateJsonText();
  }

  private async loadAllFontAwesomeIcons(): Promise<void> {
    const url = new URL(
      'assets/fontawesome/metadata/icon-families.json',
      document.baseURI
    ).toString();
    const res = await fetch(url, { cache: 'no-cache' });

    if (!res.ok) {
      throw new Error(
        `Failed to load icon-families.json: ${res.status} ${res.statusText}`
      );
    }

    const data = (await res.json()) as FaIconFamiliesMetadata;

    const list: FaIconItem[] = [];

    for (const iconName of Object.keys(data)) {
      const entry = data[iconName];
      const label = entry?.label || iconName;

      const free = entry?.familyStylesByLicense?.free ?? [];

      for (const fs of free) {
        const style = (fs.style || '').toLowerCase();

        const familyClass =
          style === 'solid'
            ? 'fa-solid'
            : style === 'regular'
              ? 'fa-regular'
              : style === 'brands'
                ? 'fa-brands'
                : '';

        if (!familyClass) continue;

        list.push({
          name: style === 'solid' ? label : `${label} (${style})`,
          cls: `${familyClass} fa-${iconName}`,
        });
      }
    }

    list.sort((a, b) => a.name.localeCompare(b.name));
    this.icons.set(list);

    if (!list.some((i) => i.cls === this.selectedIconClass())) {
      this.selectedIconClass.set(list[0]?.cls ?? 'fa-solid fa-user');
    }
  }

  private updateJsonText(): void {
    this.jsonText = JSON.stringify(
      {
        id: '',
        iconClass: this.selectedIconClass(),
        className: this.wrapperClassName(),
      },
      null,
      2
    );
  }

  handleJsonChange(val: string): void {
    try {
      const parsed = JSON.parse(val);

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('JSON must be an object.');
      }

      if (parsed.id !== undefined && typeof parsed.id !== 'string') {
        throw new Error('Invalid "id". It must be a string.');
      }

      if (!parsed.iconClass || typeof parsed.iconClass !== 'string') {
        throw new Error('Missing or invalid "iconClass".');
      }

      this.selectedIconClass.set(parsed.iconClass);
      this.wrapperClassName.set(parsed.className || '');
      this.jsonError.set('');
    } catch (err: any) {
      this.jsonError.set(err.message || 'Invalid JSON.');
    }
  }

  formatJson(): void {
    try {
      const parsed = JSON.parse(this.jsonText);
      this.jsonText = JSON.stringify(parsed, null, 2);
      this.jsonError.set('');
    } catch (err: any) {
      this.jsonError.set(err.message || 'Invalid JSON.');
    }
  }

  selectIcon(icon: FaIconItem): void {
    this.selectedIconClass.set(icon.cls);

    const parsed = this.safeParseJson(this.jsonText);
    const id = parsed?.id && typeof parsed.id === 'string' ? parsed.id : '';

    this.jsonText = JSON.stringify(
      {
        id,
        iconClass: this.selectedIconClass(),
        className: this.wrapperClassName(),
      },
      null,
      2
    );

    this.jsonError.set('');
  }

  private safeParseJson(val: string): any {
    try {
      return JSON.parse(val);
    } catch {
      return null;
    }
  }
}
