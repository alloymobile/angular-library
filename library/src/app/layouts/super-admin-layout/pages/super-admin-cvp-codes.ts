import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateApiService } from '../../../core/services/rate-api.service';
import { CvpCodeAdminView, PageResponse } from '../../../core/models/api.models';
import { TdCrud } from '../../../lib/organ/td-crud/td-crud';
import { CrudModel } from '../../../lib/organ/td-crud/td-crud.model';
import { TdTableActionModel } from '../../../lib/tissue/td-table-action/td-table-action.model';
import { TdModalModel } from '../../../lib/tissue/td-modal/td-modal.model';
import { TdModalToastModel } from '../../../lib/tissue/td-modal-toast/td-modal-toast.model';
import { TdPaginationModel } from '../../../lib/tissue/td-pagination/td-pagination.model';
import { TdButtonIconModel } from '../../../lib/cell/td-button-icon/td-button-icon.model';
import { OutputObject } from '../../../lib/share/output-object';

@Component({
  selector: 'plra-super-admin-cvp-codes',
  standalone: true,
  imports: [CommonModule, TdCrud],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './super-admin-cvp-codes.html',
  styleUrls: ['./super-admin-cvp-codes.css']
})
export class SuperAdminCvpCodesComponent implements OnInit {
  private api = inject(RateApiService);
  crud = signal<CrudModel | null>(null);
  private page = 0;
  private size = 10;
  private query = '';
  private sortCol = ''; private sortDir: 'asc' | 'desc' = 'asc';

  ngOnInit(): void { this.load(); }

  private load(): void {
    const params: Record<string, any> = { page: this.page, size: this.size };
    if (this.sortCol) params['sort'] = this.sortCol + ',' + this.sortDir;
    if (this.query) params['search'] = this.query;

    this.api.getCvpCodes(params).subscribe({
      next: (res: PageResponse<CvpCodeAdminView>) => this.crud.set(this.buildCrud(res))
    });
  }

  private buildCrud(res: PageResponse<CvpCodeAdminView>): CrudModel {
    const rows = res.content.map(c => ({
      id: c.id, name: c.name, detail: c.detail,
      categoryName: c.category?.name ?? '',
      subCategoryName: c.subCategory?.name ?? '',
      active: c.active ? 'Active' : 'Inactive',
      createdBy: c.createdBy, createdOn: c.createdOn?.substring(0, 10) ?? '',
      subCategoryId: c.subCategory?.id, version: c.version
    }));

    return new CrudModel({
      id: 'cvp-codes-crud', type: 'table',
      search: { search: { name: 'query', type: 'text', layout: 'icon', label: 'Search CVP Codes', placeholder: 'Search by name, category…', icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control', value: this.query } },
      add: new TdButtonIconModel({ name: 'Add CVP Code', icon: { iconClass: 'fa-solid fa-plus', className: '' }, className: 'btn btn-success', title: 'Add CVP Code' }),
      document: new TdTableActionModel({
        className: 'table table-hover', showIconColumn: false, rows,
        sortState: this.sortCol ? { col: this.sortCol, dir: this.sortDir } : undefined,
        actions: { className: 'd-flex gap-1 justify-content-end', buttons: [
          { name: 'Edit', className: 'btn btn-sm btn-outline-success', icon: { iconClass: 'fa-solid fa-pen-to-square', className: '' } },
          { name: 'Delete', className: 'btn btn-sm btn-outline-danger', icon: { iconClass: 'fa-solid fa-trash', className: '' } }
        ]}
      }),
      modal: new TdModalModel({
        id: 'cvp-modal', title: 'CVP Code', action: 'create',
        fields: [
          { name: 'name', type: 'text', label: 'CVP Code Name', placeholder: 'e.g. CVP-PB-A', required: true },
          { name: 'subCategoryId', type: 'number', label: 'SubCategory ID', required: true },
          { name: 'detail', type: 'textarea', label: 'Description' }
        ],
        submit: { name: 'Save', className: 'btn btn-success' }
      }),
      toast: new TdModalToastModel({ id: 'cvp-toast', title: 'Delete CVP Code', action: 'Confirm', message: 'Deactivate this CVP code?', submit: { name: 'Deactivate', className: 'btn btn-danger' } }),
      page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
    });
  }

  onCrudOutput(event: OutputObject): void {
    const e = event.toJSON();
    const action = e.action ?? '';
    const data = (e.data ?? {}) as Record<string, any>;

    switch (action) {
      case 'search': this.query = String(data['query'] || data['value'] || ''); this.page = 0; this.load(); break;
      case 'clear': this.query = ''; this.page = 0; this.load(); break;
      case 'sort': {
        const col = Object.keys(data)[0];
        if (col === this.sortCol) { this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'; }
        else { this.sortCol = col; this.sortDir = 'asc'; }
        this.page = 0; this.load(); break;
      }
      case 'create':
        this.api.createCvpCode({ name: data['name'], subCategoryId: Number(data['subCategoryId']), detail: data['detail'] ?? '' })
          .subscribe({ next: () => this.load() });
        break;
      case 'edit':
        this.api.updateCvpCode(data['id'], { name: data['name'], subCategoryId: Number(data['subCategoryId']), detail: data['detail'] ?? '' })
          .subscribe({ next: () => this.load() });
        break;
      case 'delete':
        this.api.deleteCvpCode(data['id']).subscribe({ next: () => this.load() });
        break;
      case 'page': this.page = data['pageNumber'] as number; this.load(); break;
    }
  }
}
