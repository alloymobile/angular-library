import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../core/i18n/translation.service';
import { TdInput } from '../../../lib/cell/td-input/td-input';
import { TdInputModel } from '../../../lib/cell/td-input/td-input.model';
import { OutputObject } from '../../../lib/share/output-object';

export interface WorkflowFilterState {
  rateType: string[];
  actions: string[];
  dateFrom: string;
  dateTo: string;
}

@Component({
  selector: 'plra-workflow-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput],
  templateUrl: './workflow-filter.html',
  styleUrls: ['./workflow-filter.css']
})
export class WorkflowFilterComponent implements OnInit {
  t = inject(TranslationService);

  @Output() filterChange = new EventEmitter<WorkflowFilterState>();

  rateTypeInput!: TdInputModel;
  actionInput!: TdInputModel;
  dateFromInput!: TdInputModel;
  dateToInput!: TdInputModel;

  private allRateTypes = ['ULOC', 'ILOC'];
  private allActions = ['CREATE', 'SUBMIT', 'APPROVE', 'REJECT', 'REVIEW', 'EXPIRE', 'ARCHIVE', 'CANCEL', 'MODIFY'];

  private state: WorkflowFilterState = {
    rateType: [],
    actions: [],
    dateFrom: '',
    dateTo: ''
  };

  ngOnInit(): void {
    this.buildModels();
  }

  private defaultDateFrom(): string {
    return '2025-01-01';
  }

  private defaultDateTo(): string {
    return new Date().toISOString().substring(0, 10);
  }

  private buildModels(): void {
    this.state.rateType = [...this.allRateTypes];
    this.state.actions = [...this.allActions];
    this.state.dateFrom = this.defaultDateFrom();
    this.state.dateTo = this.defaultDateTo();

    this.rateTypeInput = new TdInputModel({
      name: 'rateType', type: 'checkselect', label: '', className: 'form-select form-select-sm',
      options: this.allRateTypes.map(r => ({ value: r, label: r })),
      value: [...this.allRateTypes]
    });

    this.actionInput = new TdInputModel({
      name: 'action', type: 'checkselect', label: '', className: 'form-select form-select-sm',
      options: this.allActions.map(a => ({ value: a, label: a })),
      value: [...this.allActions]
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

  onRateTypeChange(out: OutputObject): void {
    if ((out as any)?.action !== 'change') return;
    const val = (out as any)?.data?.value;
    this.state.rateType = Array.isArray(val) ? val : (val ? [val] : []);
    this.emit();
  }

  onActionChange(out: OutputObject): void {
    if ((out as any)?.action !== 'change') return;
    const val = (out as any)?.data?.value;
    this.state.actions = Array.isArray(val) ? val : (val ? [val] : []);
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
    this.state = { rateType: [], actions: [], dateFrom: '', dateTo: '' };
    this.buildModels();
    this.emit();
  }

  private emit(): void {
    this.filterChange.emit({ ...this.state });
  }
}
