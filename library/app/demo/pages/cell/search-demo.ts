import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdSearch } from '../../../lib/td-search/td-search';
import { TdSearchModel, TdSearchConfig } from '../../../lib/td-search/td-search.model';
import { TdInputType } from '../../../lib/td-input/td-input.model';
import { OutputObject } from '../../../lib/shared/output-object';

// Mock dataset (pretend this is your server)
const MOCK_EMAILS = [
  {
    id: 'e001',
    to: 'alpha@example.com',
    subject: 'Welcome to the Platform',
    status: 'Sent',
    tags: 'welcome,onboarding',
  },
  {
    id: 'e002',
    to: 'beta@example.com',
    subject: 'Password reset instructions',
    status: 'Queued',
    tags: 'security,reset',
  },
  {
    id: 'e003',
    to: 'gamma@example.com',
    subject: 'Your invoice #401',
    status: 'Failed',
    tags: 'invoice,billing',
  },
  {
    id: 'e004',
    to: 'delta@example.com',
    subject: 'Meeting Reminder: Project Kickoff',
    status: 'Sent',
    tags: 'meeting,project',
  },
  {
    id: 'e005',
    to: 'epsilon@example.com',
    subject: 'Weekly Newsletter - January',
    status: 'Sent',
    tags: 'newsletter,updates',
  },
];

const DEFAULT_SEARCH_CONFIG = {
  id: 'emailSearchBar',
  className: 'row my-3',
  search: {
    id: 'emailSearch',
    name: 'emailSearch',
    type: 'text' as TdInputType,
    layout: 'icon',
    icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' },
    label: 'Search Emails',
    placeholder: 'Search by recipient, subject, tags…',
    className: 'form-control',
    iconGroupClass: 'bg-light border-0',
  },
  minChars: 2,
  debounceMs: 400,
  resultConfig: {
    idKey: 'id',
    labelKey: 'subject',
    descriptionKey: 'to',
  },
} satisfies TdSearchConfig;

@Component({
  selector: 'search-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, TdSearch],
  template: `
    <div class="container py-3">
      <h3 class="mb-4 text-center">TdSearch</h3>

      <!-- Usage snippet -->
      <div class="row g-3 mb-3">
        <div class="col-12 text-center">
          <pre class="bg-light text-dark border rounded-3 p-3 small mb-0">
            <code>const search = new TdSearchModel(searchConfig);
&lt;td-search [model]="search" (output)="handleOutput($event)"&gt;&lt;/td-search&gt;</code>
          </pre>
        </div>
      </div>

      <!-- Live search bar + results preview -->
      <div class="row g-3 mb-3">
        <div class="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
          <td-search [model]="searchModel()" (output)="handleOutput($event)"></td-search>

          <div class="small text-secondary mt-2 text-center">
            <div>
              Debounce is handled <strong>inside</strong> TdSearch using
              <code>minChars</code> and <code>debounceMs</code> from the JSON.
            </div>
            <div>
              When the debounced query fires, it emits
              <code>action: "search"</code>. This demo filters a mock email list
              and injects results via <code>TdSearchModel.results</code>.
            </div>
            <div>
              Clearing the input (or typing below <code>minChars</code>) emits
              <code>action: "clear"</code>, and the demo clears results.
            </div>
            <div>
              Clicking a result emits <code>action: "select"</code> and returns
              the <strong>raw result</strong> in <code>data.result</code>.
            </div>
            <div class="mt-1">
              Last query: <code>{{ lastQuery() || '(none yet)' }}</code> — Results:
              {{ results().length }}
            </div>
            <div class="mt-1">
              Tip: Remove <code>id</code> at the root or inside
              <code>search</code> in the JSON — IDs remain stable because the
              components generate SSR-safe DOM ids internally.
            </div>
          </div>
        </div>
      </div>

      <!-- JSON editor (left) and callback output (right) -->
      <div class="row g-3 align-items-stretch">
        <!-- LEFT: Search JSON editor -->
        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="fw-semibold mb-0">
              Search JSON (TdSearchModel config, editable)
            </label>

            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              (click)="handleFormat()"
              title="Format JSON">
              <i class="fa-solid fa-wand-magic-sparkles me-2" aria-hidden="true"></i>
              Format
            </button>
          </div>

          <textarea
            class="form-control font-monospace"
            [class.is-invalid]="parseError()"
            rows="18"
            [(ngModel)]="searchJson"
            (ngModelChange)="handleJsonChange($event)"
            spellcheck="false">
          </textarea>
          @if (parseError()) {
            <div class="invalid-feedback d-block mt-1">{{ parseError() }}</div>
          }

          <div class="form-text">
            <ul class="mb-0 ps-3">
              <li>
                Root shape is a <code>TdSearchModel</code>.
              </li>
              <li>
                <code>search</code> is passed into <code>new TdInputModel</code>,
                so it must follow the Input schema (requires <code>name</code>;
                <code>layout: "icon"</code> requires <code>icon</code>).
              </li>
              <li>
                For <code>layout: "icon"</code>, <code>iconGroupClass</code>
                customizes the span wrapping the icon (appended to
                <code>"input-group-text"</code>).
              </li>
              <li>
                SSR note: You may omit <code>id</code> fields — the components
                generate stable ids internally using <code>DomIdRef</code>.
              </li>
              <li>
                <strong>Do not</strong> add <code>results</code> into this JSON;
                they are injected via code after the server call.
              </li>
            </ul>
          </div>
        </div>

        <!-- RIGHT: Output payload from TdSearch -->
        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="fw-semibold mb-0">
              Output (from <code>output</code> callback)
            </label>

            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              (click)="outputJson.set('// Type in the search box, wait for debounce, click a result...')">
              Clear
            </button>
          </div>

          <textarea
            class="form-control font-monospace bg-light border"
            rows="18"
            [ngModel]="outputJson()"
            readonly
            spellcheck="false">
          </textarea>

          <div class="form-text">
            TdSearch emits normalized <code>OutputObject</code> payloads:
            <pre class="bg-light border rounded-3 p-2 mt-2 small mb-2">{{ outputShapeExample }}</pre>
            Listen for <code>"search"</code> to call your API and feed results
            back into <code>TdSearchModel.results</code>; listen for
            <code>"select"</code> to handle the chosen item.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SearchDemo {
  searchJson = JSON.stringify(DEFAULT_SEARCH_CONFIG, null, 2);
  outputJson = signal('// Type in the search box, wait for debounce, click a result...');
  parseError = signal('');
  results = signal<any[]>([]);
  lastQuery = signal('');
  baseConfig = signal<TdSearchConfig>(DEFAULT_SEARCH_CONFIG);

  outputShapeExample = `// Debounced query:
{
  "id": "search-<stable>",
  "type": "search-bar",
  "action": "search",
  "error": false,
  "data": { "emailSearch": "welcome" }
}

// Clear:
{ "action": "clear", ... }

// Result row clicked:
{ "action": "select", "data": { "result": {...} } }`;

  searchModel = computed(() => {
    try {
      return new TdSearchModel({
        ...this.baseConfig(),
        results: this.results(),
      });
    } catch (e: any) {
      this.parseError.set(String(e?.message || e));
      return new TdSearchModel({
        ...DEFAULT_SEARCH_CONFIG,
        results: this.results(),
      });
    }
  });

  handleJsonChange(val: string): void {
    try {
      const obj = JSON.parse(val || '{}');
      this.baseConfig.set(obj as TdSearchConfig);
      this.parseError.set('');
    } catch (e: any) {
      this.parseError.set(String(e?.message || e));
    }
  }

  handleOutput(out: OutputObject): void {
    const payload = out && typeof out.toJSON === 'function' ? out.toJSON() : out;

    // Show raw payload in the right-hand textarea
    this.outputJson.set(JSON.stringify(payload, null, 2));

    if (!payload) return;

    const { type, action, data } = payload;
    if (type !== 'search-bar') return;

    // Debounced query -> pretend to call server
    if (action === 'search') {
      const value = data ? Object.values(data)[0] : '';
      const query = String(value ?? '').toLowerCase().trim();

      this.lastQuery.set(query);

      // In real app: call your backend here
      // For demo, filter MOCK_EMAILS
      if (!query || query.length < 2) {
        this.results.set([]);
        return;
      }

      const filtered = MOCK_EMAILS.filter((email) => {
        const haystack = [email.to, email.subject, email.tags, email.status]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });

      this.results.set(filtered);
      return;
    }

    // Clear event (input below minChars or empty)
    if (action === 'clear') {
      this.lastQuery.set('');
      this.results.set([]);
      return;
    }

    // Result selected (user clicked a row)
    if (action === 'select') {
      const result = (data as Record<string, unknown> | undefined)?.['result'];
      console.log('Selected search result:', result);
    }
  }

  handleFormat(): void {
    try {
      const parsed = JSON.parse(this.searchJson);
      this.searchJson = JSON.stringify(parsed, null, 2);
    } catch {
      // ignore; parseError already shown
    }
  }
}
