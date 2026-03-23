import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'plra-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-bar">
      <input type="text" class="form-control form-control-sm search-input" [placeholder]="placeholder" [(ngModel)]="search" (ngModelChange)="onSearch()">
      @if (categories.length > 0) {
        <select class="form-select form-select-sm" [(ngModel)]="selectedCategory" (ngModelChange)="onFilter()">
          <option value="">All Categories</option>
          @for (c of categories; track c) { <option [value]="c">{{ c }}</option> }
        </select>
      }
      @if (statuses.length > 0) {
        <select class="form-select form-select-sm" [(ngModel)]="selectedStatus" (ngModelChange)="onFilter()">
          <option value="">All Statuses</option>
          @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
        </select>
      }
    </div>
  `,
  styles: [`
    .filter-bar { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
    .search-input { max-width:260px; font-size:13px; }
    .form-select { max-width:180px; font-size:13px; }
  `]
})
export class FilterBarComponent {
  @Input() placeholder = 'Search...';
  @Input() categories: string[] = [];
  @Input() statuses: string[] = [];
  @Output() filterChange = new EventEmitter<{search: string; category: string; status: string}>();

  search = '';
  selectedCategory = '';
  selectedStatus = '';

  onSearch(): void { this.emit(); }
  onFilter(): void { this.emit(); }
  private emit(): void {
    this.filterChange.emit({ search: this.search, category: this.selectedCategory, status: this.selectedStatus });
  }
}
