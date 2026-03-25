import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { AmountTierAdminView, WorkflowAdminView, PageResponse } from '../../../core/models/api.models';
import { RateMatrixComponent, MatrixTier, MatrixRow, MatrixAction, PageChangeEvent } from '../../../shared/components/rate-matrix/rate-matrix';
import { RateFilterComponent, FilterState } from '../../../shared/components/rate-filter/rate-filter';
import { RateStatusFilterComponent, StatusFilterState } from '../../../shared/components/rate-status-filter/rate-status-filter';
import { buildViewMatrix, buildEnterMatrix, buildApproveMatrix, buildStatusMatrix } from '../../../shared/components/matrix-data-builder';
import { TdCrud } from '../../../lib/organ/td-crud/td-crud';
import { HistoryFilterComponent, HistoryFilterState } from '../../../shared/components/history-filter/history-filter';
import { CrudModel } from '../../../lib/organ/td-crud/td-crud.model';
import { TdTableActionModel } from '../../../lib/tissue/td-table-action/td-table-action.model';
import { TdPaginationModel } from '../../../lib/tissue/td-pagination/td-pagination.model';
import { OutputObject } from '../../../lib/share/output-object';

type Tab = 'view' | 'enter' | 'status' | 'approve' | 'history';

@Component({
  selector: 'plra-super-admin-iloc-rates',
  standalone: true,
  imports: [CommonModule, FormsModule, RateMatrixComponent, RateFilterComponent, RateStatusFilterComponent, TdCrud, HistoryFilterComponent],
  templateUrl: './super-admin-iloc-rates.html',
  styleUrls: ['./super-admin-iloc-rates.css']
})
export class SuperAdminIlocRatesComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);
  private route = inject(ActivatedRoute);

  tab = signal<Tab>('view');
  tiers = signal<MatrixTier[]>([]);
  viewRows = signal<MatrixRow[]>([]);
  enterRows = signal<MatrixRow[]>([]);
  statusRows = signal<MatrixRow[]>([]);
  approveRows = signal<MatrixRow[]>([]);
  historyCrud = signal<CrudModel | null>(null);

  search = '';
  visibleTierIds: number[] = [];
  currentPage = 0; pageSize = 20; totalElements = 0; totalPages = 0;
  enterPage = 0; enterSize = 20; enterTotal = 0; enterPages = 0;
  statusPage = 0; statusSize = 20; statusTotal = 0; statusPages = 0;
  approvePage = 0; approveSize = 20; approveTotal = 0; approvePages = 0;
  private filterParams: Record<string, any> = {};
  private statusFilterParams: Record<string, any> = {};
  private statusFilterStatuses: string[] = [];
  private allSubs: any[] = [];
  saving = signal(false);
  submitting = signal(false);
  approving = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');

  productName = '';
  private tierData: AmountTierAdminView[] = [];
  private histPage = 0;
  private histSize = 20;
  private histSort = 'createdOn,desc';
  private histSearch = '';
  private histFilterParams: Record<string, any> = {};
  private histFilterStatuses: string[] = [];
  private readonly HIST_SORT_MAP: Record<string, string> = { name: 'subCategory.name', tier: 'amountTier.name', targetRate: 'targetRate', floorRate: 'floorRate', startDate: 'startDate', expiryDate: 'expiryDate', status: 'status', notes: 'notes', createdBy: 'createdBy', createdOn: 'createdOn' };

  ngOnInit(): void {
    this.api.getProducts({ type: 'ILOC', size: 1 }).subscribe({
      next: res => {
        const p = res.content.find(x => x.type === 'ILOC');
        if (!p) return;
        this.productName = p.name;
        this.api.getAmountTiers(p.name, { unpaged: true }).subscribe({
          next: tierRes => {
            this.tierData = tierRes.content;
            this.tiers.set(tierRes.content.map(t => ({ id: t.id, name: t.name })));
            this.loadView();
            this.loadEnter();
            const initTab = this.route.snapshot.queryParamMap.get('tab');
            if (initTab) { this.switchTab(initTab as any); }
          }
        });
      }
    });
  }

  switchTab(tab: Tab): void {
    this.tab.set(tab);
    this.message.set('');
    switch (tab) {
      case 'view': this.loadView(); break;
      case 'enter': this.loadEnter(); break;
      case 'status': this.loadStatus(); break;
      case 'approve': this.loadApprove(); break;
      case 'history': this.loadHistory(); break;
    }
  }

  /* ═══════ VIEW ═══════ */
  private loadView(): void {
    const params: Record<string, any> = { page: this.currentPage, size: this.pageSize, ...this.filterParams };
    this.api.getIlocActive(params).subscribe({
      next: (r: any) => {
        this.totalElements = r.totalElements ?? 0;
        this.totalPages = r.totalPages ?? 0;
        this.viewRows.set(buildViewMatrix(this.tierData, r.content, 'ILOC').matrixRows);
      }
    });
  }

  /* ═══════ ENTER — shows ALL CVP codes, overlays active + drafts ═══════ */
  private loadEnter(): void {
    if (this.allSubs.length === 0) {
      this.api.getCategories(this.productName, { unpaged: true }).subscribe({
        next: (catRes: any) => {
          if (catRes.content.length === 0) { this.enterRows.set([]); return; }
          const subReqs = catRes.content.map((c: any) => this.api.getSubCategories(c.name, { unpaged: true }));
          forkJoin(subReqs).subscribe((subArrays: any) => {
            this.allSubs = (subArrays as any[]).flatMap((s: any) => s.content);
            this.doLoadEnter();
          });
        }
      });
    } else {
      this.doLoadEnter();
    }
  }

  private doLoadEnter(): void {
    let subs = [...this.allSubs];
    const subIds = this.statusFilterParams['subCategoryIds'];
    if (subIds) {
      const ids = subIds.split(',').map((s: string) => Number(s));
      subs = subs.filter((s: any) => ids.includes(s.id));
    }
    this.enterTotal = subs.length;
    this.enterPages = Math.ceil(subs.length / this.enterSize) || 1;
    if (this.enterPage >= this.enterPages) this.enterPage = Math.max(0, this.enterPages - 1);
    const start = this.enterPage * this.enterSize;
    const pageSubs = subs.slice(start, start + this.enterSize);
    if (pageSubs.length === 0) { this.enterRows.set([]); return; }
    const subCatIds = pageSubs.map((s: any) => s.id).join(',');
    forkJoin([
      this.api.getIlocActive({ subCategoryIds: subCatIds, size: 500 }),
      this.api.getIlocDrafts({ subCategoryIds: subCatIds, status: 'DRAFT', size: 500 })
    ]).subscribe({
      next: ([activeRes, draftRes]: any[]) => {
        const entities = pageSubs.map((s: any) => ({ id: s.id, name: s.name }));
        this.enterRows.set(buildEnterMatrix(this.tierData, activeRes.content, draftRes.content, 'ILOC', entities).matrixRows);
      }
    });
  }

  /* ═══════ SAVE — CREATE or UPDATE ═══════ */
  saveDrafts(): void {
    const rows = this.enterRows();
    const today = new Date().toISOString().substring(0, 10);
    const nextYear = new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10);
    const toSave: { draftId: number | null; entityId: number; tierId: number; targetRate: number; floorRate: number; notes: string; startDate: string; expiryDate: string }[] = [];

    for (const row of rows) {
      for (const cell of row.cells) {
        if (cell.newRate !== null && cell.newRate !== undefined) {
          toSave.push({
            draftId: cell.draftId ?? null,
            entityId: row.id, tierId: cell.tierId,
            targetRate: cell.newRate, floorRate: cell.newFloor ?? cell.newRate,
            notes: cell.discretion ?? '',
            startDate: row.effectiveDate || today, expiryDate: row.expiryDate || nextYear,
          });
        }
      }
    }
    if (toSave.length === 0) { this.showMsg('No modified rates to save.', 'info'); return; }
    this.saving.set(true);
    let done = 0, errors = 0;
    for (const item of toSave) {
      const payload = { subCategoryId: item.entityId, amountTierId: item.tierId, targetRate: item.targetRate, floorRate: item.floorRate, startDate: item.startDate, expiryDate: item.expiryDate, notes: item.notes };
      const obs = item.draftId ? this.api.updateIlocDraft(item.draftId, payload) : this.api.createIlocDraft(payload);
      obs.subscribe({
        next: () => { done++; if (done + errors >= toSave.length) { this.saving.set(false); this.showMsg(`Saved ${done} rate(s).${errors > 0 ? ` ${errors} failed.` : ''}`, errors > 0 ? 'error' : 'success'); this.loadEnter(); } },
        error: (err: any) => { console.error('[PLRA] Save FAILED:', item.draftId, err?.error ?? err); errors++; if (done + errors >= toSave.length) { this.saving.set(false); this.showMsg(`Saved ${done} rate(s). ${errors} failed.`, 'error'); this.loadEnter(); } }
      });
    }
  }

  onEnterAction(event: MatrixAction): void {
    if (event.action === 'save-row') {
      const row = event.rows[0];
      const cells = row.cells.filter(c => c.newRate !== null);
      if (cells.length === 0) return;
      const today = new Date().toISOString().substring(0, 10);
      const nextYear = new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10);
      this.saving.set(true);
      let done = 0, errors = 0;
      for (const cell of cells) {
        const p = { subCategoryId: row.id, amountTierId: cell.tierId, targetRate: cell.newRate!, floorRate: cell.newFloor ?? cell.newRate!, startDate: row.effectiveDate || today, expiryDate: row.expiryDate || nextYear, notes: cell.discretion ?? '' };
        const o = cell.draftId ? this.api.updateIlocDraft(cell.draftId, p) : this.api.createIlocDraft(p);
        o.subscribe({
          next: () => { done++; if (done + errors >= cells.length) { this.saving.set(false); this.showMsg(`Row "${row.name}" saved.`, 'success'); this.loadEnter(); } },
          error: () => { errors++; if (done + errors >= cells.length) { this.saving.set(false); this.showMsg(`Row "${row.name}": ${errors} error(s).`, 'error'); } }
        });
      }
    }
  }

  /* ═══════ SUBMIT ═══════ */
  submitSelected(): void {
    const selected = this.enterRows().filter(r => r.selected);
    if (selected.length === 0) { this.showMsg('Select at least one row.', 'info'); return; }
    const draftIds = selected.flatMap(r => r.draftIds);
    if (draftIds.length === 0) { this.showMsg('No drafts to submit.', 'error'); return; }
    this.submitting.set(true);
    let done = 0, errors = 0;
    for (const id of draftIds) {
      this.api.submitIlocDraft(id).subscribe({
        next: () => { done++; if (done + errors >= draftIds.length) { this.submitting.set(false); this.showMsg(`Submitted ${done} draft(s). DRAFT → PENDING.`, 'success'); this.loadEnter(); } },
        error: () => { errors++; if (done + errors >= draftIds.length) { this.submitting.set(false); this.showMsg(`${errors} failed.`, 'error'); } }
      });
    }
  }

  /* ═══════ STATUS — with decision info from workflows ═══════ */
  private loadStatus(): void {
    const p: Record<string, any> = { page: this.statusPage, size: this.statusSize, ...this.statusFilterParams };
    forkJoin([
      this.api.getIlocDrafts(p),
      this.api.getWorkflows({ size: 500 })
    ]).subscribe({
      next: ([draftRes, wfRes]: any[]) => {
        this.statusTotal = draftRes.totalElements ?? 0;
        this.statusPages = draftRes.totalPages ?? 0;
        let filtered = draftRes.content.filter((d: any) => d.status !== 'DRAFT' && d.status !== 'CANCELLED');
        if (this.statusFilterStatuses.length > 0) {
          filtered = filtered.filter((d: any) => this.statusFilterStatuses.includes(d.status));
        }
        const wfs = wfRes.content.filter((w: any) => w.rateType === 'ILOC');
        this.statusRows.set(buildStatusMatrix(this.tierData, filtered, 'ILOC', wfs).matrixRows);
      }
    });
  }

  /* ═══════ APPROVE ═══════ */
  private loadApprove(): void {
    const p: Record<string, any> = { page: this.approvePage, size: this.approveSize, status: 'PENDING', ...this.statusFilterParams };
    forkJoin([
      this.api.getIlocActive({ size: 500, ...this.statusFilterParams }),
      this.api.getIlocDrafts(p)
    ]).subscribe({
      next: ([activeRes, pendingRes]: any[]) => {
        this.approveTotal = pendingRes.totalElements ?? 0;
        this.approvePages = pendingRes.totalPages ?? 0;
        this.approveRows.set(buildApproveMatrix(this.tierData, activeRes.content, pendingRes.content, 'ILOC').matrixRows);
      }
    });
  }

  submitDecisions(): void {
    const rows = this.approveRows();
    if (rows.length === 0) { this.showMsg('No pending rates.', 'info'); return; }
    this.approving.set(true);
    let done = 0, errors = 0, total = 0;
    for (const row of rows) {
      for (const draftId of row.draftIds) {
        total++;
        const obs = row.decision === 'APPROVE' ? this.api.approveIlocDraft(draftId, row.comment || undefined) : this.api.rejectIlocDraft(draftId, row.comment || undefined);
        obs.subscribe({
          next: () => { done++; if (done + errors >= total) { this.approving.set(false); this.showMsg(`Processed ${done} decision(s).`, 'success'); this.loadApprove(); } },
          error: () => { errors++; if (done + errors >= total) { this.approving.set(false); this.showMsg(`${errors} failed.`, 'error'); } }
        });
      }
    }
    if (total === 0) { this.approving.set(false); }
  }

  /* ═══════ HISTORY — TdCrud with search/sort/pagination ═══════ */
  private loadHistory(): void {
    const params: Record<string, any> = {
      page: this.histPage, size: this.histSize, sort: this.histSort,
      ...this.histFilterParams
    };
    if (this.histSearch) params['search'] = this.histSearch;
    this.api.getIlocHistory(params).subscribe({
      next: (res: any) => {
        let content: any[] = res.content;
        if (this.histFilterStatuses.length > 0 && this.histFilterStatuses.length < 4) {
          content = content.filter((r: any) => this.histFilterStatuses.includes(r.status));
        }
        const rows = content.map((r: any) => ({
          id: r.id,
          name: r.subCategory?.name ?? '—',
          tier: r.amountTier?.name ?? '—',
          targetRate: r.targetRate, floorRate: r.floorRate,
          startDate: r.startDate?.substring(0, 10) ?? '', expiryDate: r.expiryDate?.substring(0, 10) ?? '',
          status: r.status, notes: r.notes ?? '',
          createdBy: r.createdBy ?? '', createdOn: r.createdOn?.substring(0, 10) ?? ''
        }));
        this.historyCrud.set(new CrudModel({
          id: 'iloc-history', type: 'table',
          search: { search: { name: 'query', type: 'text', layout: 'icon', label: this.t.get('common.search'), placeholder: this.t.get('common.search'), icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control', value: this.histSearch } },
          document: new TdTableActionModel({ className: 'table table-hover', showIconColumn: false, rows }),
          page: new TdPaginationModel({ totalPages: res.totalPages, totalElements: res.totalElements, size: res.size, pageNumber: res.page, first: res.first, last: res.last, empty: res.empty })
        }));
      },
      error: (err: any) => console.error('[PLRA] History load failed:', err?.status, err?.error ?? err)
    });
  }

  onHistoryOutput(event: OutputObject): void {
    const e = event.toJSON();
    switch (e.action ?? '') {
      case 'page': case 'Page':
        this.histPage = (e.data as any)?.pageNumber ?? 0;
        this.loadHistory();
        break;
      case 'sort':
        const data = e.data || {};
        const col = Object.keys(data)[0];
        const dir = data[col] || 'asc';
        const backendField = this.HIST_SORT_MAP[col] || col;
        this.histSort = `${backendField},${dir}`;
        this.histPage = 0;
        this.loadHistory();
        break;
      case 'search':
        this.histSearch = (e.data as any)?.query || (e.data as any)?.value || '';
        this.histPage = 0;
        this.loadHistory();
        break;
      case 'clear':
        this.histSearch = '';
        this.histPage = 0;
        this.loadHistory();
        break;
    }
  }

  onHistoryFilterChange(f: HistoryFilterState): void {
    this.histFilterParams = {};
    if (f.dateFrom) this.histFilterParams['startDateFrom'] = f.dateFrom;
    if (f.dateTo) this.histFilterParams['startDateTo'] = f.dateTo;
    this.histFilterStatuses = f.statuses;
    this.histPage = 0;
    this.loadHistory();
  }

  /* ═══════ TOOLBAR ═══════ */
  copyNewDown(): void {
    const sel = this.enterRows().filter(r => r.selected);
    if (sel.length < 2) { this.showMsg('Select 2+ rows.', 'info'); return; }
    for (let i = 1; i < sel.length; i++) { for (let j = 0; j < sel[0].cells.length; j++) { if (sel[0].cells[j].newRate !== null) { sel[i].cells[j].newRate = sel[0].cells[j].newRate; sel[i].cells[j].newFloor = sel[0].cells[j].newFloor; } } }
    this.showMsg(`Copied to ${sel.length - 1} row(s).`, 'success');
  }

  copyDiscDown(): void {
    const sel = this.enterRows().filter(r => r.selected);
    if (sel.length < 2) { this.showMsg('Select 2+ rows.', 'info'); return; }
    for (let i = 1; i < sel.length; i++) { for (let j = 0; j < sel[0].cells.length; j++) { if (sel[0].cells[j].discretion) { sel[i].cells[j].discretion = sel[0].cells[j].discretion; } } }
    this.showMsg(`Copied to ${sel.length - 1} row(s).`, 'success');
  }

  onFilter(f: FilterState): void {
    this.search = f.search;
    this.visibleTierIds = f.tierIds.map((id: string) => Number(id));
    const params: Record<string, any> = {};
    if (f.subCategoryIds.length > 0) params['subCategoryIds'] = f.subCategoryIds.join(',');
    this.filterParams = params;
    this.currentPage = 0;
    this.loadView();
  }

  onPageChange(e: PageChangeEvent): void {
    this.currentPage = e.page;
    this.pageSize = e.size;
    this.loadView();
  }

  onEnterPageChange(e: PageChangeEvent): void {
    this.enterPage = e.page;
    this.enterSize = e.size;
    this.loadEnter();
  }

  onStatusPageChange(e: PageChangeEvent): void {
    this.statusPage = e.page;
    this.statusSize = e.size;
    this.loadStatus();
  }

  onApprovePageChange(e: PageChangeEvent): void {
    this.approvePage = e.page;
    this.approveSize = e.size;
    this.loadApprove();
  }

  onStatusFilter(f: StatusFilterState): void {
    this.search = f.search;
    this.statusFilterParams = {};
    if (f.subCategoryIds.length > 0) this.statusFilterParams['subCategoryIds'] = f.subCategoryIds.join(',');
    this.statusFilterStatuses = f.statuses;
    this.enterPage = 0; this.statusPage = 0; this.approvePage = 0;
    switch (this.tab()) {
      case 'enter': this.loadEnter(); break;
      case 'status': this.loadStatus(); break;
      case 'approve': this.loadApprove(); break;
    }
  }

  private showMsg(msg: string, type: 'success' | 'error' | 'info'): void { this.message.set(msg); this.messageType.set(type); }
}
