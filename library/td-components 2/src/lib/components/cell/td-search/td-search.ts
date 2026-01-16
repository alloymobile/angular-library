// src/lib/components/cell/td-search/td-search.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchObject, NormalizedResult } from './td-search.model';
import { TdInputComponent } from '../td-input/td-input';
import { InputObject } from '../td-input/td-input.model';
import { OutputObject } from '../../../utils/id-helper';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * TdSearchComponent
 * 
 * Emits ONLY:
 *   - action: "search" (debounced, >= minChars)
 *   - action: "clear" (immediate, ONLY when crossing from >= minChars to < minChars)
 */
@Component({
  selector: 'td-search',
  standalone: true,
  imports: [CommonModule, TdInputComponent],
  templateUrl: './td-search.html',
  styleUrls: ['./td-search.css']
})
export class TdSearchComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Input: SearchObject instance (required)
   */
  @Input() search!: SearchObject;

  /**
   * Output: Emits OutputObject on search/clear
   */
  @Output() output = new EventEmitter<OutputObject>();

  // Internal state
  liveValue = '';
  inputModel!: InputObject;

  // Debounce tracking
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  private wasAbove = false;
  private lastSearchText = '';

  ngOnInit(): void {
    this.validateInput();
    this.initState();
    this.setupDebounce();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['search']) {
      this.validateInput();
      this.initState();
    }
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  private validateInput(): void {
    if (!this.search || !(this.search instanceof SearchObject)) {
      throw new Error('TdSearchComponent requires `search` prop (SearchObject instance).');
    }
  }

  private initState(): void {
    const v = typeof this.search.search?.value !== 'undefined' 
      ? String(this.search.search.value) 
      : '';
    
    this.liveValue = v;
    this.wasAbove = (v || '').trim().length >= this.search.minChars;
    this.lastSearchText = '';
    this.updateInputModel();
  }

  private updateInputModel(): void {
    const base = this.search.search;
    this.inputModel = new InputObject({
      ...base,
      value: this.liveValue
    });
  }

  private setupDebounce(): void {
    this.searchSubscription?.unsubscribe();
    
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(this.search.debounceMs),
      distinctUntilChanged()
    ).subscribe(trimmed => {
      if (this.lastSearchText === trimmed) return;
      this.lastSearchText = trimmed;

      this.output.emit(OutputObject.ok({
        id: this.search.id,
        type: 'search-bar',
        action: 'search',
        data: { [this.inputName]: trimmed }
      }));
    });
  }

  /**
   * Get input name
   */
  get inputName(): string {
    return this.search.search?.name ?? 'query';
  }

  /**
   * Get normalized results
   */
  get normalizedResults(): NormalizedResult[] {
    const { resultConfig } = this.search;
    const { idKey, labelKey, descriptionKey, iconKey } = resultConfig;

    return (this.search.results || []).map((item, index) => {
      if (typeof item === 'string' || typeof item === 'number') {
        return {
          raw: item,
          id: String(index),
          label: String(item),
          description: '',
          iconClass: ''
        };
      }

      const obj = item || {};
      const id = obj[idKey!] ?? obj.id ?? obj.key ?? String(index);
      const label = obj[labelKey!] ?? obj.name ?? obj.title ?? obj.subject ?? JSON.stringify(obj);
      const description = descriptionKey ? obj[descriptionKey] : '';
      const iconClass = iconKey && obj[iconKey] ? obj[iconKey] : '';

      return {
        raw: item,
        id: String(id),
        label: String(label),
        description: description ? String(description) : '',
        iconClass: iconClass ? String(iconClass) : ''
      };
    });
  }

  /**
   * Check if has results
   */
  get hasResults(): boolean {
    return this.normalizedResults.length > 0;
  }

  /**
   * Handle search output from input
   */
  onSearchOutput(inputOut: OutputObject): void {
    if (!inputOut) return;

    const data = inputOut.data || {};
    const hasDirect = Object.prototype.hasOwnProperty.call(data, this.inputName);

    // Ignore events for other fields
    if (!hasDirect && typeof data['name'] === 'string' && data['name'] && data['name'] !== this.inputName) {
      return;
    }

    let next: any;
    if (hasDirect) {
      next = data[this.inputName];
    } else if (typeof data['value'] !== 'undefined') {
      next = data['value'];
    } else if (typeof data['text'] !== 'undefined') {
      next = data['text'];
    } else {
      return;
    }

    const nextStr = typeof next === 'string' ? next : String(next ?? '');
    this.liveValue = nextStr;
    this.updateInputModel();
    this.processValueChange(nextStr);
  }

  private processValueChange(value: string): void {
    const trimmed = (value || '').trim();
    const minChars = this.search.minChars;

    // BELOW threshold:
    if (trimmed.length < minChars) {
      if (this.wasAbove) {
        this.wasAbove = false;
        this.lastSearchText = '';

        this.output.emit(OutputObject.ok({
          id: this.search.id,
          type: 'search-bar',
          action: 'clear',
          data: { [this.inputName]: '' }
        }));
      }
      return;
    }

    // ABOVE/EQUAL threshold: debounce search
    this.wasAbove = true;
    this.searchSubject.next(trimmed);
  }

  /**
   * Handle result click
   */
  onResultClick(resultItem: NormalizedResult): void {
    this.liveValue = resultItem?.label ?? '';
    this.updateInputModel();
  }
}
