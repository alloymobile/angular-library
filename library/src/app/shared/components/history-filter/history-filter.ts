import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../core/i18n/translation.service';
import { TdInput } from '../../../lib/cell/td-input/td-input';
import { TdInputModel } from '../../../lib/cell/td-input/td-input.model';
import { OutputObject } from '../../../lib/share/output-object';

export interface HistoryFilterState {
  statuses: string[];
  dateFrom: string;
  dateTo: string;
}

@Component({
  selector: 'plra-history-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput],
  templateUrl: './history-filter.html',
  styleUrls: ['./history-filter.css']
})
export class HistoryFilterComponent implements OnInit {
  t = inject(TranslationService);
  @Output() filterChange = new EventEmitter<HistoryFilterState>();

  statusInput!: TdInputModel;
  dateFromInput!: TdInputModel;
  dateToInput!: TdInputModel;

  private allStatuses = ['EXPIRED', 'SUPERSEDED', 'APPROVED', 'REJECTED'];

  private state: HistoryFilterState = { statuses: [], dateFrom: '', dateTo: '' };

  ngOnInit(): void { this.buildModels(); }

  private buildModels(): void {
    this.state.statuses = [...this.allStatuses];
    this.state.dateFrom = '2025-01-01';
    this.state.dateTo = new Date().toISOString().substring(0, 10);

    this.statusInput = new TdInputModel({
      name: 'status', type: 'checkselect', label: '', className: 'form-select form-select-sm',
      options: this.allStatuses.map(s => ({ value: s, label: s })),
      value: [...this.allStatuses]
    });

    this.dateFromInput = new TdInputModel({
      name: 'dateFrom', type: 'date', label: '', className: 'form-control form-control-sm',
      placeholder: '', value: this.state.dateFrom
    });

    this.dateToInput = new TdInputModel({
      name: 'dateTo', type: 'date', label: '', className: 'form-control form-control-sm',
      placeholder: '', value: this.state.dateTo
    });
  }

  onStatusChange(out: OutputObject): void {
    if ((out as any)?.action !== 'change') return;
    const val = (out as any)?.data?.value;
    this.state.statuses = Array.isArray(val) ? val : (val ? [val] : []);
    this.emit();
  }

  onDateFromChange(out: OutputObject): void {
    if ((out as any)?.action !== 'change') return;
    this.state.dateFrom = (out as any)?.data?.value || '';
    this.emit();
  }

  onDateToChange(out: OutputObject): void {
    if ((out as any)?.action !== 'change') return;
    this.state.dateTo = (out as any)?.data?.value || '';
    this.emit();
  }

  clearAll(): void {
    this.state = { statuses: [], dateFrom: '', dateTo: '' };
    this.buildModels();
    this.emit();
  }

  private emit(): void {
    this.filterChange.emit({ ...this.state });
  }
}
