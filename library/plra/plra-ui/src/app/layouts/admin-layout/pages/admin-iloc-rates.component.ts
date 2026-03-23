import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { RateApiService } from '../../../core/services/rate-api.service';
import { AmountTierAdminView } from '../../../core/models/api.models';
import {
  RateMatrixComponent, MatrixTier, MatrixRow, MatrixAction
} from '../../../shared/components/rate-matrix/rate-matrix.component';
import {
  buildViewMatrix, buildEnterMatrix, buildApproveMatrix, buildStatusMatrix
} from '../../../shared/components/matrix-data-builder';

type Tab = 'view' | 'enter' | 'status' | 'approve' | 'history';

@Component({
  selector: 'plra-admin-iloc-rates',
  standalone: true,
  imports: [CommonModule, FormsModule, RateMatrixComponent],
  template: `
    <header class="mb-3">
      <h2 class="page-heading"><i class="fa-solid fa-table-cells-large text-td-green me-2"></i>ILOC — Administration</h2>
      <p class="page-subtitle">Enter rates and track approval status</p>
    </header>

    <ul class="nav td-tabs mb-3">
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='view'" (click)="switchTab('view')"><i class="fa-regular fa-eye me-1"></i>View Rates</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='enter'" (click)="switchTab('enter')"><i class="fa-solid fa-pen me-1"></i>Enter Rates</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='status'" (click)="switchTab('status')"><i class="fa-regular fa-circle-check me-1"></i>Approved Status</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='approve'" (click)="switchTab('approve')"><i class="fa-solid fa-gavel me-1"></i>Approve</button></li>
      <li class="nav-item"><button class="nav-link" [class.active]="tab()==='history'" (click)="switchTab('history')"><i class="fa-solid fa-clock-rotate-left me-1"></i>History</button></li>
    </ul>

    <!-- ═══ Alert messages ═══ -->
    @if (message()) {
      <div class="alert mb-3" [class.alert-success]="messageType()==='success'" [class.alert-danger]="messageType()==='error'" [class.alert-info]="messageType()==='info'">
        {{ message() }}
        <button type="button" class="btn-close float-end" (click)="message.set('')"></button>
      </div>
    }

    <!-- ═══ VIEW TAB ═══ -->
    @if (tab() === 'view') {
      <input class="form-control form-control-sm mb-3" style="max-width:300px" placeholder="Search subcategory..." [(ngModel)]="search" />
      <plra-rate-matrix mode="view" productType="ILOC" [tiers]="tiers()" [rows]="viewRows()" [searchTerm]="search" />
    }

    <!-- ═══ ENTER TAB ═══ -->
    @if (tab() === 'enter') {
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" (click)="copyNewDown()"><i class="fa-solid fa-wand-magic-sparkles me-1"></i>Copy New Down</button>
          <button class="btn btn-sm btn-outline-secondary" (click)="copyDiscDown()"><i class="fa-solid fa-copy me-1"></i>Copy Disc. Down</button>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-success" (click)="saveDrafts()" [disabled]="saving()">
            <i class="fa-solid fa-floppy-disk me-1"></i>{{ saving() ? 'Saving...' : 'Save Draft' }}
          </button>
          <button class="btn btn-sm btn-success" (click)="submitSelected()" [disabled]="submitting()">
            <i class="fa-solid fa-paper-plane me-1"></i>{{ submitting() ? 'Submitting...' : 'Submit Selected' }}
          </button>
        </div>
      </div>
      <plra-rate-matrix mode="enter" productType="ILOC" [tiers]="tiers()" [rows]="enterRows()" [searchTerm]="search" (onAction)="onEnterAction($event)" />
    }

    <!-- ═══ STATUS TAB ═══ -->
    @if (tab() === 'status') {
      <plra-rate-matrix mode="status" productType="ILOC" [tiers]="tiers()" [rows]="statusRows()" />
    }

    <!-- ═══ APPROVE TAB ═══ -->
    @if (tab() === 'approve') {
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-sm btn-success" (click)="submitDecisions()" [disabled]="approving()">
          <i class="fa-solid fa-paper-plane me-1"></i>{{ approving() ? 'Processing...' : 'Submit Decisions' }}
        </button>
      </div>
      <plra-rate-matrix mode="approve" productType="ILOC" [tiers]="tiers()" [rows]="approveRows()" />
    }

    <!-- ═══ HISTORY TAB ═══ -->
    @if (tab() === 'history') {
      <plra-rate-matrix mode="history" productType="ILOC" [tiers]="tiers()" [rows]="historyRows()" />
    }
  `,
  styles: [`.page-heading{font-size:20px;font-weight:700;display:flex;align-items:center;gap:6px;margin:0}.page-subtitle{font-size:13px;color:var(--color-muted);margin:4px 0 0}.td-tabs{border-bottom:2px solid var(--border-color,#e5e7eb);gap:0}.td-tabs .nav-link{border:none;background:none;padding:10px 18px;font-size:14px;font-weight:600;color:var(--color-muted);border-bottom:2px solid transparent;margin-bottom:-2px;cursor:pointer}.td-tabs .nav-link.active{color:var(--td-green);border-bottom-color:var(--td-green)}`]
})
export class AdminIlocRatesComponent implements OnInit {
  private api = inject(RateApiService);

  tab = signal<Tab>('view');
  tiers = signal<MatrixTier[]>([]);
  viewRows = signal<MatrixRow[]>([]);
  enterRows = signal<MatrixRow[]>([]);
  statusRows = signal<MatrixRow[]>([]);
  approveRows = signal<MatrixRow[]>([]);
  historyRows = signal<MatrixRow[]>([]);

  search = '';
  saving = signal(false);
  submitting = signal(false);
  approving = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error' | 'info'>('info');

  private productName = '';
  private tierData: AmountTierAdminView[] = [];

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

  /* ═══════ VIEW — active rates ═══════ */
  private loadView(): void {
    this.api.getIlocActive({ size: 500 }).subscribe({
      next: r => {
        const m = buildViewMatrix(this.tierData, r.content, 'ILOC');
        this.viewRows.set(m.matrixRows);
      }
    });
  }

  /* ═══════ ENTER — draft rates with current overlay ═══════ */
  private loadEnter(): void {
    forkJoin([
      this.api.getIlocActive({ size: 500 }),
      this.api.getIlocDrafts({ status: 'DRAFT', size: 500 })
    ]).subscribe({
      next: ([activeRes, draftRes]) => {
        const m = buildEnterMatrix(this.tierData, activeRes.content, draftRes.content, 'ILOC');
        this.enterRows.set(m.matrixRows);
      }
    });
  }

  /* ═══════ SAVE DRAFTS — PUT each modified cell ═══════ */
  saveDrafts(): void {
    const rows = this.enterRows();
    const toSave: { draftId: number | null; entityId: number; tierId: number; targetRate: number; floorRate: number; notes: string; startDate: string; expiryDate: string }[] = [];

    for (const row of rows) {
      for (const cell of row.cells) {
        if (cell.newRate !== null && cell.newRate !== undefined) {
          toSave.push({ entityId: row.id, tierId: cell.tierId, startDate: row.effectiveDate || new Date().toISOString().substring(0,10), expiryDate: row.expiryDate || new Date(Date.now()+365*86400000).toISOString().substring(0,10),
            draftId: cell.draftId ?? null,  // null = CREATE new draft
            targetRate: cell.newRate,
            floorRate: cell.newFloor ?? cell.newRate, // default floor = target if not set
            notes: cell.discretion ?? ''
          });
        }
      }
    }

    console.log('[PLRA] toSave items:', toSave.length, toSave.map(i => ({ id: i.draftId, rate: i.targetRate, start: i.startDate })));
    if (toSave.length === 0) {
      this.showMsg('No modified rates to save.', 'info');
      return;
    }

    this.saving.set(true);
    let done = 0;
    let errors = 0;

    for (const item of toSave) {
      console.log('[PLRA] Saving draft:', item.draftId, 'payload:', JSON.stringify({
        entityId: item.entityId, tierId: item.tierId,
        targetRate: item.targetRate, floorRate: item.floorRate,
        startDate: item.startDate, expiryDate: item.expiryDate, notes: item.notes
      }));
      const payload = { subCategoryId: item.entityId, amountTierId: item.tierId, targetRate: item.targetRate, floorRate: item.floorRate, startDate: item.startDate, expiryDate: item.expiryDate, notes: item.notes };
      const obs = item.draftId ? this.api.updateIlocDraft(item.draftId, payload) : this.api.createIlocDraft(payload);
      obs.subscribe({
        next: () => { done++; if (done + errors >= toSave.length) this.onSaveComplete(done, errors); },
        error: (err: any) => { console.error('[PLRA] Save draft FAILED:', item.draftId, err?.status, err?.error ?? err?.message ?? err); errors++; if (done + errors >= toSave.length) this.onSaveComplete(done, errors); }
      });
    }
  }

  private onSaveComplete(saved: number, errors: number): void {
    this.saving.set(false);
    this.showMsg(`Saved ${saved} rate(s).${errors > 0 ? ` ${errors} failed.` : ''}`, errors > 0 ? 'error' : 'success');
    this.loadEnter();
  }

  onEnterAction(event: MatrixAction): void {
    if (event.action === 'save-row') {
      // Save just this one row's cells
      const row = event.rows[0];
      const cells = row.cells.filter(c => c.newRate !== null);
      if (cells.length === 0) return;

      this.saving.set(true);
      let done = 0;
      let errors = 0;
      for (const cell of cells) {
        const p = { subCategoryId: row.id, amountTierId: cell.tierId, targetRate: cell.newRate!, floorRate: cell.newFloor ?? cell.newRate!, startDate: row.effectiveDate || new Date().toISOString().substring(0,10), expiryDate: row.expiryDate || new Date(Date.now()+365*86400000).toISOString().substring(0,10), notes: cell.discretion ?? '' };
        const o = cell.draftId ? this.api.updateIlocDraft(cell.draftId, p) : this.api.createIlocDraft(p);
        o.subscribe({
          next: () => { done++; if (done + errors >= cells.length) { this.saving.set(false); this.showMsg(`Row "${row.name}" saved (${done} tier(s)).`, 'success'); this.loadEnter(); } },
          error: (err: any) => { console.error('[PLRA] Save row cell FAILED:', cell.draftId, err?.status, err?.error ?? err?.message ?? err); errors++; if (done + errors >= cells.length) { this.saving.set(false); this.showMsg(`Row "${row.name}": ${errors} error(s).`, 'error'); } }
        });
      }
    }
  }

  /* ═══════ SUBMIT — PATCH /drafts/{id}/submit per selected row ═══════ */
  submitSelected(): void {
    const selected = this.enterRows().filter(r => r.selected);
    if (selected.length === 0) {
      this.showMsg('Select at least one row to submit.', 'info');
      return;
    }

    const draftIds = selected.flatMap(r => r.draftIds);
    if (draftIds.length === 0) {
      this.showMsg('No draft IDs found for selected rows.', 'error');
      return;
    }

    this.submitting.set(true);
    let done = 0;
    let errors = 0;

    for (const id of draftIds) {
      this.api.submitIlocDraft(id).subscribe({
        next: () => { console.log('[PLRA] Submitted draft:', id); done++; if (done + errors >= draftIds.length) this.onSubmitComplete(done, errors, selected.length); },
        error: () => { errors++; if (done + errors >= draftIds.length) this.onSubmitComplete(done, errors, selected.length); }
      });
    }
  }

  private onSubmitComplete(submitted: number, errors: number, rowCount: number): void {
    this.submitting.set(false);
    this.showMsg(
      `Submitted ${rowCount} row(s) (${submitted} draft(s)). Status: DRAFT → PENDING.${errors > 0 ? ` ${errors} failed.` : ''}`,
      errors > 0 ? 'error' : 'success'
    );
    this.loadEnter(); // Refresh — submitted rows will no longer be DRAFT
  }

  /* ═══════ APPROVE/REJECT — PATCH /drafts/{id}/approve or /reject ═══════ */
  private loadApprove(): void {
    forkJoin([
      this.api.getIlocActive({ size: 500 }),
      this.api.getIlocDrafts({ status: 'PENDING', size: 500 })
    ]).subscribe({
      next: ([activeRes, pendingRes]) => {
        const m = buildApproveMatrix(this.tierData, activeRes.content, pendingRes.content, 'ILOC');
        this.approveRows.set(m.matrixRows);
      }
    });
  }

  submitDecisions(): void {
    const rows = this.approveRows();
    if (rows.length === 0) {
      this.showMsg('No pending rates to process.', 'info');
      return;
    }

    this.approving.set(true);
    let done = 0;
    let errors = 0;
    let total = 0;

    for (const row of rows) {
      for (const draftId of row.draftIds) {
        total++;
        const obs = row.decision === 'APPROVE'
          ? this.api.approveIlocDraft(draftId, row.comment || undefined)
          : this.api.rejectIlocDraft(draftId, row.comment || undefined);

        obs.subscribe({
          next: () => { done++; if (done + errors >= total) this.onApproveComplete(done, errors); },
          error: () => { errors++; if (done + errors >= total) this.onApproveComplete(done, errors); }
        });
      }
    }

    if (total === 0) {
      this.approving.set(false);
      this.showMsg('No draft IDs to process.', 'info');
    }
  }

  private onApproveComplete(processed: number, errors: number): void {
    this.approving.set(false);
    this.showMsg(
      `Processed ${processed} decision(s). Approved → ACTIVE, Declined → REJECTED.${errors > 0 ? ` ${errors} failed.` : ''}`,
      errors > 0 ? 'error' : 'success'
    );
    this.loadApprove();
  }

  /* ═══════ STATUS — APPROVED/REJECTED drafts ═══════ */
  private loadStatus(): void {
    this.api.getIlocDrafts({ size: 500 }).subscribe({
      next: r => {
        const decided = r.content.filter(d => d.status !== 'DRAFT' && d.status !== 'CANCELLED');
        const m = buildStatusMatrix(this.tierData, decided, 'ILOC');
        this.statusRows.set(m.matrixRows);
      }
    });
  }

  /* ═══════ HISTORY — from history table ═══════ */
  private loadHistory(): void {
    forkJoin([
      this.api.getIlocHistory({ size: 500 }),
      this.api.getIlocDrafts({ size: 500 })
    ]).subscribe({
      next: ([histRes, draftRes]) => {
        // Combine: actual history records + approved/rejected drafts
        const approvedDrafts = draftRes.content.filter(d => d.status === 'APPROVED' || d.status === 'REJECTED');
        const allHistorical = [...histRes.content, ...approvedDrafts];
        const m = buildStatusMatrix(this.tierData, allHistorical, 'ILOC');
        this.historyRows.set(m.matrixRows);
      }
    });
  }

  /* ═══════ TOOLBAR HELPERS ═══════ */
  copyNewDown(): void {
    const rows = this.enterRows();
    const selected = rows.filter(r => r.selected);
    if (selected.length < 2) { this.showMsg('Select 2+ rows to copy down.', 'info'); return; }
    const source = selected[0];
    for (let i = 1; i < selected.length; i++) {
      for (let j = 0; j < source.cells.length; j++) {
        if (source.cells[j].newRate !== null) {
          selected[i].cells[j].newRate = source.cells[j].newRate;
          selected[i].cells[j].newFloor = source.cells[j].newFloor;
        }
      }
    }
    this.showMsg(`Copied new rates from "${source.name}" to ${selected.length - 1} row(s).`, 'success');
  }

  copyDiscDown(): void {
    const rows = this.enterRows();
    const selected = rows.filter(r => r.selected);
    if (selected.length < 2) { this.showMsg('Select 2+ rows to copy down.', 'info'); return; }
    const source = selected[0];
    for (let i = 1; i < selected.length; i++) {
      for (let j = 0; j < source.cells.length; j++) {
        if (source.cells[j].discretion) {
          selected[i].cells[j].discretion = source.cells[j].discretion;
        }
      }
    }
    this.showMsg(`Copied discretion from "${source.name}" to ${selected.length - 1} row(s).`, 'success');
  }

  private showMsg(msg: string, type: 'success' | 'error' | 'info'): void {
    this.message.set(msg);
    this.messageType.set(type);
  }
}
