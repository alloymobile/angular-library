import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TranslationService } from '../../../core/i18n/translation.service';
import { RateApiService } from '../../../core/services/rate-api.service';
import { AmountTierAdminView, WorkflowAdminView, PageResponse } from '../../../core/models/api.models';
import { RateMatrixComponent, MatrixTier, MatrixRow, MatrixAction } from '../../../shared/components/rate-matrix/rate-matrix.component';
import { buildViewMatrix, buildEnterMatrix, buildApproveMatrix, buildStatusMatrix } from '../../../shared/components/matrix-data-builder';
import { TdCrud } from '../../../lib/organ/td-crud/td-crud';
import { CrudModel } from '../../../lib/organ/td-crud/td-crud.model';
import { TdTableActionModel } from '../../../lib/tissue/td-table-action/td-table-action.model';
import { TdPaginationModel } from '../../../lib/tissue/td-pagination/td-pagination.model';
import { OutputObject } from '../../../lib/share/output-object';

type Tab = 'view' | 'enter' | 'status' | 'approve' | 'history';

@Component({
  selector: 'plra-super-admin-iloc-rates',
  standalone: true,
  imports: [CommonModule, FormsModule, RateMatrixComponent, TdCrud],
  template: `
    <header class="mb-3">
      <h2 class="page-heading"><i class="fa-solid fa-table-cells-large text-td-green me-2"></i>{{ t.get('pages.iloc_rates') }}</h2>
      <p class="page-subtitle">{{ t.get('pages.iloc_rates_sub') }}</p>
    </header>
    <ul class="nav td-tabs mb-3">
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='view'" (click)="switchTab('view')"><i class="fa-regular fa-eye me-1"></i>{{ t.get('tabs.view_rates') }}</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='enter'" (click)="switchTab('enter')"><i class="fa-solid fa-pen me-1"></i>{{ t.get('tabs.enter_rates') }}</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='status'" (click)="switchTab('status')"><i class="fa-regular fa-circle-check me-1"></i>{{ t.get('tabs.approved_status') }}</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='approve'" (click)="switchTab('approve')"><i class="fa-solid fa-gavel me-1"></i>{{ t.get('tabs.approve') }}</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='history'" (click)="switchTab('history')"><i class="fa-solid fa-clock-rotate-left me-1"></i>{{ t.get('tabs.history') }}</button></li>
    </ul>
    @if (message()) {
      <div class="alert mb-3" [class.alert-success]="messageType()==='success'" [class.alert-danger]="messageType()==='error'" [class.alert-info]="messageType()==='info'">
        {{ message() }}<button type="button" class="btn-close float-end" (click)="message.set('')"></button>
      </div>
    }
    @if (tab() === 'view') {
      <input class="form-control form-control-sm mb-3" style="max-width:300px" [placeholder]="t.get('common.search')" [(ngModel)]="search" />
      <plra-rate-matrix mode="view" productType="ILOC" [tiers]="tiers()" [rows]="viewRows()" [searchTerm]="search" />
    }
    @if (tab() === 'enter') {
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" (click)="copyNewDown()"><i class="fa-solid fa-wand-magic-sparkles me-1"></i>{{ t.get('rates.copy_new_down') }}</button>
          <button class="btn btn-sm btn-outline-secondary" (click)="copyDiscDown()"><i class="fa-solid fa-copy me-1"></i>{{ t.get('rates.copy_disc_down') }}</button>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-success" (click)="saveDrafts()" [disabled]="saving()"><i class="fa-solid fa-floppy-disk me-1"></i>{{ saving() ? t.get('common.loading') : t.get('rates.save_draft') }}</button>
          <button class="btn btn-sm btn-success" (click)="submitSelected()" [disabled]="submitting()"><i class="fa-solid fa-paper-plane me-1"></i>{{ submitting() ? t.get('common.loading') : t.get('rates.submit_selected') }}</button>
        </div>
      </div>
      <plra-rate-matrix mode="enter" productType="ILOC" [tiers]="tiers()" [rows]="enterRows()" [searchTerm]="search" (onAction)="onEnterAction($event)" />
    }
    @if (tab() === 'status') {
      <plra-rate-matrix mode="status" productType="ILOC" [tiers]="tiers()" [rows]="statusRows()" />
    }
    @if (tab() === 'approve') {
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-sm btn-success" (click)="submitDecisions()" [disabled]="approving()"><i class="fa-solid fa-paper-plane me-1"></i>{{ approving() ? t.get('common.loading') : t.get('rates.submit_decisions') }}</button>
      </div>
      <plra-rate-matrix mode="approve" productType="ILOC" [tiers]="tiers()" [rows]="approveRows()" />
    }
    @if (tab() === 'history') {
      @if (historyCrud()) { <td-crud [crud]="historyCrud()!" (output)="onHistoryOutput($event)"></td-crud> }
    }
  `,
  styles: [`.page-heading{font-size:20px;font-weight:700;display:flex;align-items:center;gap:6px;margin:0}.page-subtitle{font-size:13px;color:var(--color-muted);margin:4px 0 0}.td-tabs{border-bottom:2px solid var(--border-color,#e5e7eb);gap:0}.td-tabs .nav-link{border:none;background:none;padding:10px 18px;font-size:14px;font-weight:600;color:var(--color-muted);border-bottom:2px solid transparent;margin-bottom:-2px;cursor:pointer}.td-tabs .nav-link.active{color:var(--td-green);border-bottom-color:var(--td-green)}`]
})
export class SuperAdminIlocRatesComponent implements OnInit {
  t = inject(TranslationService);
  private api = inject(RateApiService);

  tab = signal<Tab>('view');
  tiers = signal<MatrixTier[]>([]);
  viewRows = signal<MatrixRow[]>([]);
  enterRows = signal<MatrixRow[]>([]);
  statusRows = signal<MatrixRow[]>([]);
  approveRows = signal<MatrixRow[]>([]);
  historyCrud = signal<CrudModel | null>(null);

  search = '';
  saving = signal(false);
  submitting = signal(false);
  approving = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');

  private productName = '';
  private tierData: AmountTierAdminView[] = [];
  private histPage = 0;

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
    this.api.getIlocActive({ size: 500 }).subscribe({
      next: r => { this.viewRows.set(buildViewMatrix(this.tierData, r.content, 'ILOC').matrixRows); }
    });
  }

  /* ═══════ ENTER — shows ALL CVP codes, overlays active + drafts ═══════ */
  private loadEnter(): void {
    forkJoin([
      this.api.getIlocActive({ size: 500 }),
      this.api.getIlocDrafts({ status: 'DRAFT', size: 500 }),
      this.api.getCategories(this.productName, { unpaged: true })
    ]).subscribe({
      next: ([activeRes, draftRes, catRes]) => {
        // Load all subcategories from all categories
        if (catRes.content.length === 0) { this.enterRows.set([]); return; }
        const subReqs = catRes.content.map((c: any) => this.api.getSubCategories(c.name, { unpaged: true }));
        forkJoin(subReqs).subscribe({ next: (subArrays: any[]) => {
          const allSubs = subArrays.flatMap((s: any) => s.content).map((s: any) => ({ id: s.id, name: s.name }));
          const m = buildEnterMatrix(this.tierData, activeRes.content, draftRes.content, 'ILOC', allSubs);
          this.enterRows.set(m.matrixRows);
        }});
        return; // forkJoin handles the rest
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
    forkJoin([
      this.api.getIlocDrafts({ size: 500 }),
      this.api.getWorkflows({ size: 500 })
    ]).subscribe({
      next: ([draftRes, wfRes]) => {
        const nonDraft = draftRes.content.filter(d => d.status !== 'DRAFT' && d.status !== 'CANCELLED');
        const ulocWfs = wfRes.content.filter(w => w.rateType === 'ILOC');
        const m = buildStatusMatrix(this.tierData, nonDraft, 'ILOC', ulocWfs);
        this.statusRows.set(m.matrixRows);
      }
    });
  }

  /* ═══════ APPROVE ═══════ */
  private loadApprove(): void {
    forkJoin([
      this.api.getIlocActive({ size: 500 }),
      this.api.getIlocDrafts({ status: 'PENDING', size: 500 })
    ]).subscribe({
      next: ([activeRes, pendingRes]) => {
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
    forkJoin([
      this.api.getIlocHistory({ size: 200 }),
      this.api.getIlocDrafts({ size: 500 })
    ]).subscribe({
      next: ([histRes, draftRes]) => {
        const approved = draftRes.content.filter(d => d.status === 'APPROVED' || d.status === 'REJECTED');
        const all = [...histRes.content, ...approved];
        const rows = all.map((r: any) => ({
          id: r.id,
          name: r.cvpCode?.name ?? r.subCategory?.name ?? '—',
          tier: r.amountTier?.name ?? '—',
          targetRate: r.targetRate, floorRate: r.floorRate,
          startDate: r.startDate?.substring(0, 10) ?? '', expiryDate: r.expiryDate?.substring(0, 10) ?? '',
          status: r.status, notes: r.notes ?? '',
          createdBy: r.createdBy ?? '', createdOn: r.createdOn?.substring(0, 10) ?? ''
        }));
        this.historyCrud.set(new CrudModel({
          id: 'iloc-history', type: 'table',
          search: { search: { name: 'query', type: 'text', layout: 'icon', label: this.t.get('common.search'), placeholder: this.t.get('common.search'), icon: { iconClass: 'fa-solid fa-magnifying-glass', className: '' }, className: 'form-control' } },
          document: new TdTableActionModel({ className: 'table table-hover', showIconColumn: false, rows }),
          page: new TdPaginationModel({ totalPages: Math.ceil(rows.length / 15), totalElements: rows.length, size: 15, pageNumber: 0, first: true, last: rows.length <= 15, empty: rows.length === 0 })
        }));
      }
    });
  }

  onHistoryOutput(event: OutputObject): void { /* TdCrud handles search/sort/pagination client-side */ }

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

  private showMsg(msg: string, type: 'success' | 'error' | 'info'): void { this.message.set(msg); this.messageType.set(type); }
}
