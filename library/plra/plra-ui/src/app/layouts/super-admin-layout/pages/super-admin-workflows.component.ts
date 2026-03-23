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

@Component({
  selector: 'plra-super-admin-workflows',
  standalone: true,
  imports: [CommonModule, TdCrud],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="mb-4">
      <h2 class="page-heading"><i class="fa-solid fa-code-branch text-td-green me-2"></i>{{ t.get('pages.workflows_title') }}</h2>
      <p class="page-subtitle">{{ t.get('pages.workflows_sub') }}</p>
    </header>
    @if (crud()) { <td-crud [crud]="crud()!" (output)="onCrudOutput($event)"></td-crud> }
  `,
  styles: [`.page-heading{font-size:20px;font-weight:700;display:flex;align-items:center;gap:8px;margin:0}.page-subtitle{font-size:13px;color:var(--color-muted);margin:4px 0 0}`]
})
export class SuperAdminWorkflowsComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  crud = signal<CrudModel | null>(null);
  private page = 0;
  private size = 20;

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.api.getWorkflows({ page: this.page, size: this.size, sort: 'createdOn,desc' }).subscribe({
      next: (res: PageResponse<WorkflowAdminView>) => this.crud.set(this.buildCrud(res))
    });
  }

  private buildCrud(res: PageResponse<WorkflowAdminView>): CrudModel {
    const rows = res.content.map(w => ({
      id: w.id, rateType: w.rateType, rateId: w.rateId,
      action: w.action, fromStatus: w.fromStatus ?? '—', toStatus: w.toStatus,
      message: w.message ?? '—', changeId: w.changeId,
      changeBy: w.changeBy ?? 'system', changeOn: w.changeOn?.substring(0, 16) ?? w.createdOn?.substring(0, 16) ?? '—'
    }));
    return new CrudModel({
      id: 'workflows', type: 'table',
      search: { search: { name: 'query', type: 'text', layout: 'icon', label: this.t.get('common.search'), placeholder: this.t.get('common.search'), icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control' } },
      document: new TdTableActionModel({ className: 'table table-hover', showIconColumn: false, rows }),
      page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
    });
  }

  onCrudOutput(event: OutputObject): void {
    const e = event.toJSON();
    switch (e.action ?? '') {
      case 'page': this.page = (e.data as any)?.pageNumber ?? 0; this.load(); break;
    }
  }
}
