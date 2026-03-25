import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdSearchModel } from './td-search.model';
import { TdInputModel } from '../td-input/td-input.model';
import { TdInput } from '../td-input/td-input';
import { OutputObject } from '../../share/output-object';

@Component({
  selector: 'td-search',
  standalone: true,
  imports: [CommonModule, TdInput],
  templateUrl: './td-search.html',
  styleUrl: './td-search.css',
})
export class TdSearch implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) model!: TdSearchModel;
  @Output() output = new EventEmitter<OutputObject>();

  private liveValue = signal('');
  private wasAbove = false;
  private lastSearchText = '';
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  inputModel = computed(() => {
    const base = this.model?.search;
    if (!base) return null;

    return new TdInputModel({
      ...base,
      value: this.liveValue(),
    });
  });

  ngOnInit(): void {
    if (!this.model || !(this.model instanceof TdSearchModel)) {
      throw new Error('TdSearch requires `model` (TdSearchModel instance).');
    }

    const initialValue =
      typeof this.model.search?.value === 'string' ? this.model.search.value : '';

    this.liveValue.set(initialValue);
    this.wasAbove = initialValue.trim().length >= this.model.minChars;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      const v =
        typeof this.model?.search?.value === 'string' ? this.model.search.value : '';

      this.liveValue.set(v);
      this.wasAbove = v.trim().length >= (this.model?.minChars ?? 2);
      this.lastSearchText = '';
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

  private emitAction(action: 'search' | 'clear', value: string): void {
    const key = this.model.search?.name ?? 'query';

    this.output.emit(new OutputObject({
      id: this.model.id,
      type: 'search-bar',
      action,
      error: false,
      errorMessage: [],
      data: {
        [key]: value,
      },
    }));
  }

  /**
   * Handle input from TdInput
   * We only react to TdInput "change" actions.
   */
  onInputOutput(inputOut: OutputObject): void {
    if (!inputOut || inputOut.action !== 'change') return;

    const key = this.model.search?.name ?? 'query';
    const data = inputOut.data || {};

    // TdInput emits: data: { name, value, errors } (your current format)
    // So we only accept events for our field
    if (typeof data['name'] === 'string' && data['name'] !== key) return;

    const next =
      typeof data['value'] === 'string' ? data['value'] : String(data['value'] ?? '');

    if (next === this.liveValue()) return;

    this.liveValue.set(next);
    this.processValueChange(next);
  }

  private processValueChange(value: string): void {
    this.clearDebounce();

    const trimmed = (value || '').trim();
    const minChars = this.model?.minChars ?? 2;

    // BELOW threshold => clear (only once when crossing down)
    if (trimmed.length < minChars) {
      if (this.wasAbove) {
        this.wasAbove = false;
        this.lastSearchText = '';
        this.emitAction('clear', '');
      }
      return;
    }

    // ABOVE/EQUAL threshold => debounce search
    this.wasAbove = true;

    this.debounceTimer = setTimeout(() => {
      if (this.lastSearchText === trimmed) return;

      this.lastSearchText = trimmed;
      this.emitAction('search', trimmed);
    }, this.model?.debounceMs ?? 400);
  }
}
