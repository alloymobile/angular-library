import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { WorkflowAdminView, PageResponse } from '../../../core/models/api.models';
import { TdCrud } from '../../../lib/organ/td-crud/td-crud';
import { CrudModel } from '../../../lib/organ/td-crud/td-crud.model';
import { TdTableActionModel } from '../../../lib/tissue/td-table-action/td-table-action.model';
import { TdPaginationModel } from '../../../lib/tissue/td-pagination/td-pagination.model';
import { OutputObject } from '../../../lib/share/output-object';
import { WorkflowFilterComponent, WorkflowFilterState } from '../../../shared/components/workflow-filter/workflow-filter';

const SORT_MAP: Record<string, string> = {
  rateType: 'rateType', rateId: 'rateId', action: 'action',
  fromStatus: 'fromStatus', toStatus: 'toStatus',
  message: 'message', changeId: 'changeId',
  changeBy: 'changeBy', changeOn: 'changeOn'
};

@Component({
  selector: 'plra-super-admin-workflows',
  standalone: true,
  imports: [CommonModule, TdCrud, WorkflowFilterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './super-admin-workflows.html',
  styleUrls: ['./super-admin-workflows.css']
})
export class SuperAdminWorkflowsComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  crud = signal<CrudModel | null>(null);
  private page = 0;
  private size = 20;
  private sort = 'createdOn,desc';
  private sortCol = ''; private sortDir: 'asc' | 'desc' = 'asc';
  private filterParams: Record<string, any> = {};
  private searchTerm = '';
  private activeFilterActions: string[] = [];

  ngOnInit(): void { this.load(); }

  private load(): void {
    const params: Record<string, any> = {
      page: this.page, size: this.size, sort: this.sort,
      ...this.filterParams
    };
    if (this.searchTerm) params['search'] = this.searchTerm;

    this.api.getWorkflows(params).subscribe({
      next: (res: PageResponse<WorkflowAdminView>) => {
        let rows: any[] = res.content;
        if (this.activeFilterActions.length > 0) {
          rows = rows.filter((w: any) => this.activeFilterActions.includes(w.action));
        }
        this.crud.set(this.buildCrud(res, rows));
      },
      error: (err: any) => console.error('[PLRA] Workflow load failed:', err?.status, err?.error ?? err)
    });
  }

  private buildCrud(res: PageResponse<WorkflowAdminView>, rows: any[]): CrudModel {
    const mapped = rows.map((w: any) => ({
      id: w.id, rateType: w.rateType, rateId: w.rateId,
      action: w.action, fromStatus: w.fromStatus ?? '—', toStatus: w.toStatus,
      message: w.message ?? '—', changeId: w.changeId,
      changeBy: w.changeBy ?? 'system', changeOn: w.changeOn?.substring(0, 16) ?? w.createdOn?.substring(0, 16) ?? '—'
    }));
    return new CrudModel({
      id: 'workflows', type: 'table',
      search: { search: { name: 'query', type: 'text', layout: 'icon', label: this.t.get('common.search'), placeholder: this.t.get('common.search'), icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control', value: this.searchTerm } },
      document: new TdTableActionModel({ className: 'table table-hover', showIconColumn: false, rows: mapped, sortState: this.sortCol ? { col: this.sortCol, dir: this.sortDir } : undefined }),
      page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
    });
  }

  onCrudOutput(event: OutputObject): void {
    const e = event.toJSON();
    switch (e.action ?? '') {
      case 'page':
      case 'Page':
        this.page = (e.data as any)?.pageNumber ?? 0;
        this.load();
        break;
      case 'sort':
        const data = e.data || {};
        const col = Object.keys(data)[0];
        if (col === this.sortCol) { this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'; }
        else { this.sortCol = col; this.sortDir = 'asc'; }
        const backendField = SORT_MAP[col] || col;
        this.sort = backendField + ',' + this.sortDir;
        this.page = 0;
        this.load();
        break;
      case 'search':
        this.searchTerm = (e.data as any)?.query || (e.data as any)?.value || '';
        this.page = 0;
        this.load();
        break;
      case 'clear':
        this.searchTerm = '';
        this.page = 0;
        this.load();
        break;
    }
  }

  onFilterChange(f: WorkflowFilterState): void {
    const params: Record<string, any> = {};
    if (f.rateType.length === 1) {
      params['rateType'] = f.rateType[0];
    }
    if (f.actions.length === 1) {
      params['action'] = f.actions[0];
      this.activeFilterActions = [];
    } else if (f.actions.length > 0 && f.actions.length < 9) {
      this.activeFilterActions = [...f.actions];
    } else {
      this.activeFilterActions = [];
    }
    if (f.dateFrom) params['changeFrom'] = f.dateFrom;
    if (f.dateTo) params['changeTo'] = f.dateTo;
    this.filterParams = params;
    this.page = 0;
    this.load();
  }
}
