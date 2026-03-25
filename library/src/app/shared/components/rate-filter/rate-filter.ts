import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { TdInput } from '../../../lib/cell/td-input/td-input';
import { TdInputModel } from '../../../lib/cell/td-input/td-input.model';
import { TdSearch } from '../../../lib/cell/td-search/td-search';
import { TdSearchModel } from '../../../lib/cell/td-search/td-search.model';
import { TdIconModel } from '../../../lib/cell/td-icon/td-icon.model';
import { OutputObject } from '../../../lib/share/output-object';

export interface FilterState {
  search: string;
  categoryId: string;
  subCategoryIds: string[];
  tierIds: string[];
}

@Component({
  selector: 'plra-rate-filter',
  standalone: true,
  imports: [CommonModule, TdInput, TdSearch],
  templateUrl: './rate-filter.html',
  styleUrls: ['./rate-filter.css']
})
export class RateFilterComponent implements OnInit, OnChanges {
  t = inject(TranslationService);
  private api = inject(RateApiService);

  @Input() productName = '';
  @Input() productType: 'ULOC' | 'ILOC' = 'ULOC';
  @Output() filterChange = new EventEmitter<FilterState>();

  searchModel!: TdSearchModel;
  categoryInput!: TdInputModel;
  subCategoryInput!: TdInputModel;
  tierInput!: TdInputModel;

  private state: FilterState = { search: '', categoryId: '', subCategoryIds: [], tierIds: [] };
  private allTierIds: string[] = [];

  ngOnInit(): void {
    this.buildModels();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productName'] && this.productName) {
      this.loadCategories();
      this.loadTiers();
    }
  }

  private buildModels(): void {
    this.searchModel = new TdSearchModel({
      id: 'rate-search', className: 'mb-0', minChars: 1, debounceMs: 300,
      search: new TdInputModel({
        name: 'query', type: 'text', layout: 'icon', label: '',
        placeholder: this.t.get('filter.search_placeholder') as string,
        icon: new TdIconModel({ iconClass: 'fa-solid fa-magnifying-glass' }),
        className: 'form-control form-control-sm'
      })
    });

    this.categoryInput = new TdInputModel({
      name: 'category', type: 'select', label: '', className: 'form-select form-select-sm',
      options: [{ value: '', label: this.t.get('filter.all_categories') as string }]
    });

    this.subCategoryInput = new TdInputModel({
      name: 'subcategory', type: 'checkselect', label: '', className: 'form-select form-select-sm',
      options: [], disabled: true
    });

    this.tierInput = new TdInputModel({
      name: 'tiers', type: 'checkselect', label: '', className: 'form-select form-select-sm',
      options: []
    });

    if (this.productName) {
      this.loadCategories();
      this.loadTiers();
    }
  }

  private loadCategories(): void {
    if (!this.productName) return;
    this.api.getCategories(this.productName, { unpaged: true }).subscribe({
      next: (res: any) => {
        const opts = [{ value: '', label: this.t.get('filter.all_categories') as string },
          ...res.content.map((c: any) => ({ value: String(c.id), label: c.name }))];
        this.categoryInput = new TdInputModel({ ...this.categoryInput, options: opts });
      }
    });
  }

  private loadTiers(): void {
    if (!this.productName) return;
    this.api.getAmountTiers(this.productName, { unpaged: true }).subscribe({
      next: (res: any) => {
        const opts = res.content.map((t: any) => ({ value: String(t.id), label: t.name }));
        this.allTierIds = opts.map((o: any) => o.value);
        this.state.tierIds = [...this.allTierIds];
        this.tierInput = new TdInputModel({
          ...this.tierInput, options: opts, value: [...this.allTierIds]
        });
      }
    });
  }

  onSearchOutput(out: OutputObject): void {
    if ((out as any)?.action !== 'change' && (out as any)?.action !== 'clear' && (out as any)?.action !== 'search') return;
    const data = (out as any)?.data || {};
    this.state.search = (out as any)?.action === 'clear' ? '' : (data['query'] || data['value'] || '');
    this.emit();
  }

  onCategoryChange(out: OutputObject): void {
    if ((out as any)?.action !== 'change') return;
    const data = (out as any)?.data || {};
    this.state.categoryId = data['value'] || '';
    this.state.subCategoryIds = [];

    if (this.state.categoryId) {
      const catName = this.categoryInput.options.find((o: any) => o.value === this.state.categoryId)?.label || '';
      this.api.getSubCategories(catName, { unpaged: true }).subscribe({
        next: (res: any) => {
          const opts = res.content.map((s: any) => ({ value: String(s.id), label: s.name }));
          const allIds = opts.map((o: any) => o.value);
          this.state.subCategoryIds = [...allIds];
          this.subCategoryInput = new TdInputModel({
            ...this.subCategoryInput, options: opts, value: [...allIds], disabled: false
          });
          this.emit();
        }
      });
    } else {
      this.subCategoryInput = new TdInputModel({
        ...this.subCategoryInput, options: [], disabled: true, value: []
      });
      this.emit();
    }
  }

  onSubCategoryChange(out: OutputObject): void {
    if ((out as any)?.action !== 'change') return;
    const data = (out as any)?.data || {};
    const val = data['value'];
    this.state.subCategoryIds = Array.isArray(val) ? val : (val ? [val] : []);
    this.emit();
  }

  onTierChange(out: OutputObject): void {
    if ((out as any)?.action !== 'change') return;
    const data = (out as any)?.data || {};
    const val = data['value'];
    this.state.tierIds = Array.isArray(val) ? val : (val ? [val] : []);
    this.emit();
  }

  clearAll(): void {
    this.state = { search: '', categoryId: '', subCategoryIds: [], tierIds: [...this.allTierIds] };
    this.buildModels();
    this.emit();
  }

  private emit(): void {
    this.filterChange.emit({ ...this.state });
  }
}
