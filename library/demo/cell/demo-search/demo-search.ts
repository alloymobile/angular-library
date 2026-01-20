// demo-search.ts
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdSearch } from '../../../lib/cell/td-search/td-search';
import { TdSearchModel } from '../../../lib/cell/td-search/td-search.model';
import { TdInputModel } from '../../../lib/cell/td-input/td-input.model';
import { TdIconModel } from '../../../lib/cell/td-icon/td-icon.model';
import { OutputObject } from '../../../lib/shared/output-object';

const DEFAULT_SEARCH_CONFIG = {
  id: 'emailSearchBar',
  className: 'row my-3',
  search: new TdInputModel({
    id: 'emailSearch',
    name: 'emailSearch',
    type: 'text',
    layout: 'icon',
    icon: new TdIconModel({ iconClass: 'fa-solid fa-magnifying-glass', className: '' }),
    label: 'Search Emails',
    placeholder: 'Search by recipient, subject, tags…',
    className: 'form-control',
    iconGroupClass: 'bg-light border-0',
  }),
  minChars: 2,
  debounceMs: 400,
};

@Component({
  selector: 'demo-search',
  standalone: true,
  imports: [CommonModule, FormsModule, TdSearch],
  templateUrl: './demo-search.html',
  styleUrl: './demo-search.css',
})
export class DemoSearch {
  searchJson = JSON.stringify(DEFAULT_SEARCH_CONFIG, null, 2);

  outputJson = signal('// Type in the search box and wait for debounce...');
  parseError = signal('');
  baseConfig = signal<any>(DEFAULT_SEARCH_CONFIG);

  outputShapeExample = `// Debounced query:
{
  "id": "emailSearchBar",
  "type": "search-bar",
  "action": "search",
  "error": false,
  "errorMessage": [],
  "data": { "emailSearch": "hello" }
}

// Clear:
{
  "id": "emailSearchBar",
  "type": "search-bar",
  "action": "clear",
  "error": false,
  "errorMessage": [],
  "data": { "emailSearch": "" }
}`;

  searchModel = computed(() => {
    try {
      return new TdSearchModel(this.baseConfig());
    } catch (e: any) {
      this.parseError.set(String(e?.message || e));
      return new TdSearchModel(DEFAULT_SEARCH_CONFIG);
    }
  });

  handleJsonChange(val: string): void {
    try {
      const obj = JSON.parse(val || '{}');
      this.baseConfig.set(obj as any);
      this.parseError.set('');
    } catch (e: any) {
      this.parseError.set(String(e?.message || e));
    }
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof out.toJSON === 'function' ? out.toJSON() : (out as any);
    this.outputJson.set(JSON.stringify(payload, null, 2));

    // In real app:
    // - action === "search" => call backend with payload.data
    // - action === "clear"  => cancel/clear server query state if needed
  }

  handleFormat(): void {
    try {
      const parsed = JSON.parse(this.searchJson);
      this.searchJson = JSON.stringify(parsed, null, 2);
    } catch {
      // ignore
    }
  }
}
