import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdSearchModel, TdSearchResultItem } from './td-search.model';
import { TdInputModel } from '../td-input/td-input.model';
import { TdInput } from '../td-input/td-input';
import { TdIcon } from '../td-icon/td-icon';
import { TdIconModel } from '../td-icon/td-icon.model';
import { IdHelper } from '../share/id-helper';
import { OutputObject } from '../share/output-object';

/**
 * TdSearch - Search bar with debounced input and result display
 *
 * Usage:
 * ```html
 * <td-search [model]="searchModel" (output)="handleSearch($event)"></td-search>
 * ```
 *
 * Emits:
 * - action: "search" (debounced, >= minChars)
 * - action: "clear" (when crossing from >= minChars to < minChars)
 */
@Component({
  selector: 'td-search',
  standalone: true,
  imports: [CommonModule, TdInput, TdIcon],
  templateUrl: './td-search.html',
  styleUrl: './td-search.css',
})
export class TdSearch implements OnInit, OnChanges, OnDestroy {
  private idHelper = inject(IdHelper);

  @Input({ required: true }) model!: TdSearchModel;
  @Output() output = new EventEmitter<OutputObject>();

  // Internal state
  private liveValue = signal('');
  private didMount = false;
  private wasAbove = false;
  private lastSearchText = '';
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private ignoreNextInput = true;

  // Computed input model that tracks live value
  inputModel = computed(() => {
    const base = this.model?.search;
    if (!base) return null;

    return new TdInputModel({
      ...base,
      value: this.liveValue(),
    });
  });

  // Normalized results
  normalizedResults = computed((): TdSearchResultItem[] => {
    if (!this.model) return [];

    const { resultConfig, results, resultIcon } = this.model;
    const { idKey, labelKey, descriptionKey, iconKey } = resultConfig;

    return (results || []).map((item, index) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return {
          raw: item,
          id: String(index),
          label: String(item),
          description: '',
          icon: resultIcon,
        };
      }

      const obj = (item || {}) as Record<string, unknown>;
      const id = obj[idKey] ?? obj['id'] ?? obj['key'] ?? String(index);
      const label = obj[labelKey] ?? obj['name'] ?? obj['title'] ?? obj['subject'] ?? JSON.stringify(obj);
      const description = descriptionKey ? obj[descriptionKey] : '';
      const iconVal = iconKey && obj[iconKey] ? obj[iconKey] : undefined;

      let icon: TdIconModel | undefined;
      if (iconVal instanceof TdIconModel) {
        icon = iconVal;
      } else if (typeof iconVal === 'string' && iconVal.trim() !== '') {
        icon = new TdIconModel({ iconClass: iconVal.trim() });
      } else if (iconVal && typeof iconVal === 'object') {
        icon = new TdIconModel(iconVal as any);
      } else {
        icon = resultIcon;
      }

      return {
        raw: item,
        id: String(id),
        label: String(label),
        description: description ? String(description) : '',
        icon,
      };
    });
  });

  hasResults = computed(() => this.normalizedResults().length > 0);

  ngOnInit(): void {
    if (!this.model || !(this.model instanceof TdSearchModel)) {
      throw new Error('TdSearch requires `model` (TdSearchModel instance).');
    }

    const initialValue = typeof this.model.search?.value === 'string'
      ? this.model.search.value
      : '';

    this.liveValue.set(initialValue);
    this.wasAbove = initialValue.trim().length >= this.model.minChars;
    this.didMount = true;
    this.ignoreNextInput = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      const v = typeof this.model?.search?.value === 'string'
        ? this.model.search.value
        : '';

      const current = this.liveValue();
      if (v.trim() !== '' && v !== current) {
        this.liveValue.set(v);
        this.lastSearchText = '';
        this.ignoreNextInput = true;
      }

      this.wasAbove = (this.liveValue() || '').trim().length >= (this.model?.minChars ?? 2);

      this.clearDebounce();
    }
  }

  ngOnDestroy(): void {
    this.clearDebounce();
  }

  private clearDebounce(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  private emit(out: OutputObject): void {
    this.output.emit(out);
  }

  /**
   * Handle input from TdInput
   */
  onInputOutput(inputOut: OutputObject): void {
    if (!inputOut) return;

    const data = inputOut.data || {};
    const inputName = this.model?.search?.name ?? 'query';

    // Check if this is for our field
    const hasDirect = Object.prototype.hasOwnProperty.call(data, inputName);
    if (!hasDirect && typeof data['name'] === 'string' && data['name'] !== inputName) {
      return;
    }

    let next: string;
    if (hasDirect) {
      next = String(data[inputName] ?? '');
    } else if (typeof data['value'] !== 'undefined') {
      next = String(data['value']);
    } else if (typeof data['text'] !== 'undefined') {
      next = String(data['text']);
    } else {
      return;
    }

    const current = this.liveValue();
    if (this.ignoreNextInput && next === current) {
      this.ignoreNextInput = false;
      return;
    }

    this.ignoreNextInput = false;
    this.liveValue.set(next);
    this.processValueChange(next);
  }

  private processValueChange(value: string): void {
    if (!this.didMount) {
      this.didMount = true;
      return;
    }

    this.clearDebounce();

    const trimmed = (value || '').trim();
    const minChars = this.model?.minChars ?? 2;

    // BELOW threshold
    if (trimmed.length < minChars) {
      if (this.wasAbove) {
        this.wasAbove = false;
        this.lastSearchText = '';

        this.emit(OutputObject.ok({
          id: this.model.id,
          type: 'search-bar',
          action: 'clear',
          data: { [this.model.search?.name ?? 'query']: '' },
        }));
      }
      return;
    }

    // ABOVE/EQUAL threshold: debounce search
    this.wasAbove = true;

    this.debounceTimer = setTimeout(() => {
      if (this.lastSearchText === trimmed) return;

      this.lastSearchText = trimmed;

      this.emit(OutputObject.ok({
        id: this.model.id,
        type: 'search-bar',
        action: 'search',
        data: { [this.model.search?.name ?? 'query']: trimmed },
      }));
    }, this.model?.debounceMs ?? 400);
  }

  /**
   * Handle result item click
   */
  onResultClick(item: TdSearchResultItem): void {
    this.liveValue.set(item.label ?? '');
    this.processValueChange(item.label ?? '');
  }
}
