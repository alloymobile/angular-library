import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Rate Matrix — CVP Code × Amount Tier grid
 *
 * Each visual row = 1 CVP Code (ULOC) or SubCategory (ILOC)
 * Each cell = 1 draft/active rate record (has its own draftId in DB)
 *
 * Modes:
 *   view    — Read-only Target/Floor
 *   enter   — Current (locked) + New (input) + Discretion (input)
 *   approve — Curr vs Req + Decision + Comment
 *   status  — Current/Disc + Result + Decision audit
 *   history — Old/New + audit trail
 */

export type MatrixMode = 'view' | 'enter' | 'approve' | 'status' | 'history';

export interface MatrixTier { id: number; name: string; }

export interface MatrixCell {
  tierId: number;
  draftId?: number | null;       // ID of the draft rate record in DB
  activeId?: number | null;      // ID of the active rate record
  currentRate: number | null;    // Current active rate (read-only)
  currentFloor: number | null;
  newRate: number | null;        // New proposed rate (editable in enter mode)
  newFloor: number | null;
  discretion: string;            // Free text (e.g. "Prime-0.5")
  // Approve mode
  reqRate: number | null;        // Requested rate (from pending draft)
  changed: boolean;              // Highlight if curr !== req
  // History
  oldRate: number | null;
  newHistRate: number | null;
}

export interface MatrixRow {
  id: number;                    // CVP Code ID or SubCategory ID
  name: string;
  draftIds: number[];            // All draft IDs for this row (for bulk submit)
  cells: MatrixCell[];
  effectiveDate: string;
  expiryDate: string;
  status: string;
  selected: boolean;
  // Approve
  submittedBy: string;
  submittedOn: string;
  decision: string;
  comment: string;
  // Status/History
  result: string;
  decisionBy: string;
  decisionOn: string;
  changedBy: string;
  changedOn: string;
}

export interface MatrixAction {
  action: 'save-row' | 'submit-rows' | 'approve-rows' | 'reject-rows';
  rows: MatrixRow[];
}

@Component({
  selector: 'plra-rate-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="matrix-wrap">
      <div class="table-responsive">
        <table class="rate-matrix">
          <thead>
            <tr>
              @if (mode === 'enter') { <th rowspan="2" class="sel-col"><input type="checkbox" [checked]="allSelected" (change)="toggleAll($event)" /></th> }
              <th rowspan="2" class="cvp-col">{{ productType === 'ULOC' ? 'CVP' : 'SubCategory' }}</th>
              @for (tier of tiers; track tier.id) {
                <th [attr.colspan]="colsPerTier" class="tier-group">{{ tier.name }}</th>
              }
              <th rowspan="2">Eff. Date</th>
              <th rowspan="2">Expiry</th>
              @if (mode === 'enter') { <th rowspan="2">Status</th><th rowspan="2">Actions</th> }
              @if (mode === 'approve') { <th rowspan="2">By</th><th rowspan="2">Submitted</th><th rowspan="2">Decision</th><th rowspan="2">Comment</th> }
              @if (mode === 'status') { <th rowspan="2">Submitted</th><th rowspan="2">Result</th><th rowspan="2">Decision By</th><th rowspan="2">Decision On</th><th rowspan="2">Comment</th> }
              @if (mode === 'history') { <th rowspan="2">Changed By</th><th rowspan="2">Changed On</th><th rowspan="2">Decision</th><th rowspan="2">Decision By</th><th rowspan="2">Comment</th> }
            </tr>
            <tr class="sub-hdr">
              @for (tier of tiers; track tier.id) {
                @if (mode === 'view') { <th class="sub-th">Target</th><th class="sub-th">Floor</th> }
                @if (mode === 'enter') { <th class="sub-th curr-th"><i class="fa-solid fa-lock" style="font-size:9px"></i> Current</th><th class="sub-th new-th">New</th><th class="sub-th">Disc.</th> }
                @if (mode === 'approve') { <th class="sub-th">Curr</th><th class="sub-th req-th">Req</th> }
                @if (mode === 'status') { <th class="sub-th">Current</th><th class="sub-th">Disc.</th> }
                @if (mode === 'history') { <th class="sub-th">Old</th><th class="sub-th">New</th> }
              }
            </tr>
          </thead>
          <tbody>
            @for (row of filteredRows; track row.id; let i = $index) {
              <tr [class.row-selected]="row.selected" [class.row-modified]="isRowModified(row)">
                @if (mode === 'enter') { <td class="sel-col"><input type="checkbox" [(ngModel)]="row.selected" /></td> }
                <td class="cvp-cell">{{ row.name }}</td>
                @for (cell of row.cells; track cell.tierId) {
                  @if (mode === 'view') {
                    <td class="rate-cell">{{ cell.currentRate !== null ? (cell.currentRate | number:'1.2-2') : '—' }}</td>
                    <td class="rate-cell">{{ cell.currentFloor !== null ? (cell.currentFloor | number:'1.2-2') : '—' }}</td>
                  }
                  @if (mode === 'enter') {
                    <td class="rate-cell curr-cell"><span class="curr-pill">{{ cell.currentRate !== null ? (cell.currentRate | number:'1.2-2') : '—' }}</span></td>
                    <td class="rate-cell new-cell"><input class="rate-input" type="number" step="0.01" min="0" [(ngModel)]="cell.newRate" placeholder="—" /></td>
                    <td class="rate-cell"><input class="disc-input" type="text" [(ngModel)]="cell.discretion" placeholder="—" /></td>
                  }
                  @if (mode === 'approve') {
                    <td class="rate-cell">{{ cell.currentRate !== null ? (cell.currentRate | number:'1.2-2') : '—' }}</td>
                    <td class="rate-cell" [class.changed]="cell.changed">{{ cell.reqRate !== null ? (cell.reqRate | number:'1.2-2') : '—' }}</td>
                  }
                  @if (mode === 'status') {
                    <td class="rate-cell">{{ cell.currentRate !== null ? (cell.currentRate | number:'1.2-2') : '—' }}</td>
                    <td class="rate-cell">{{ cell.discretion || '—' }}</td>
                  }
                  @if (mode === 'history') {
                    <td class="rate-cell">{{ cell.oldRate !== null ? (cell.oldRate | number:'1.2-2') : '—' }}</td>
                    <td class="rate-cell">{{ cell.newHistRate !== null ? (cell.newHistRate | number:'1.2-2') : '—' }}</td>
                  }
                }
                <td>{{ row.effectiveDate || '—' }}</td>
                <td>{{ row.expiryDate || '—' }}</td>
                @if (mode === 'enter') {
                  <td><span class="status-pill" [attr.data-status]="row.status">{{ row.status }}</span></td>
                  <td class="act-cell">
                    <button class="btn btn-sm btn-outline-success" title="Save this row" (click)="onSaveRow(row)"><i class="fa-solid fa-floppy-disk"></i></button>
                  </td>
                }
                @if (mode === 'approve') {
                  <td>{{ row.submittedBy }}</td>
                  <td>{{ row.submittedOn }}</td>
                  <td><select class="form-select form-select-sm" [(ngModel)]="row.decision"><option value="APPROVE">Approve</option><option value="DECLINE">Decline</option></select></td>
                  <td><input class="form-control form-control-sm" type="text" [(ngModel)]="row.comment" placeholder="Comment..." /></td>
                }
                @if (mode === 'status') {
                  <td>{{ row.submittedOn }}</td>
                  <td><span class="status-pill" [attr.data-status]="row.result">{{ row.result }}</span></td>
                  <td>{{ row.decisionBy }}</td>
                  <td>{{ row.decisionOn }}</td>
                  <td>{{ row.comment }}</td>
                }
                @if (mode === 'history') {
                  <td>{{ row.changedBy }}</td>
                  <td>{{ row.changedOn }}</td>
                  <td><span class="status-pill" [attr.data-status]="row.result">{{ row.result }}</span></td>
                  <td>{{ row.decisionBy }}</td>
                  <td>{{ row.comment }}</td>
                }
              </tr>
            } @empty {
              <tr><td [attr.colspan]="99" class="empty-cell"><i class="fa-solid fa-inbox"></i> No rates found</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .matrix-wrap { overflow:hidden; border:1px solid var(--border-color,#e0e0e0); border-radius:10px; background:#fff; }
    .table-responsive { overflow-x:auto; }
    .rate-matrix { width:100%; border-collapse:collapse; font-size:12px; }
    .rate-matrix thead th { background:#f8fafb; padding:8px 10px; text-align:center; font-size:11px; font-weight:700; color:var(--color-muted,#5f6368); border-bottom:1px solid var(--border-color); white-space:nowrap; }
    .tier-group { border-left:1px solid var(--border-color); background:#f0f4f8 !important; font-weight:800 !important; color:var(--color-ink) !important; }
    .sub-hdr th { font-size:10px; font-weight:600; padding:5px 8px; }
    .curr-th { background:#f7f8fa !important; }
    .new-th { background:rgba(37,99,235,.06) !important; color:#2563eb !important; }
    .req-th { background:rgba(37,99,235,.06) !important; }
    .rate-matrix tbody td { padding:6px 8px; text-align:center; border-bottom:1px solid #f3f4f6; font-size:12px; }
    .rate-matrix tbody tr:hover { background:#f8fafb; }
    .row-selected { background:#f0fdf4 !important; }
    .row-modified { border-left:3px solid var(--td-green); }
    .cvp-col { text-align:left !important; min-width:80px; position:sticky; left:0; z-index:2; }
    .cvp-cell { font-weight:700; text-align:left !important; position:sticky; left:0; background:#fff; z-index:1; white-space:nowrap; }
    .rate-matrix tbody tr:hover .cvp-cell { background:#f8fafb; }
    .sel-col { width:32px; }
    .rate-cell { font-variant-numeric:tabular-nums; }
    .curr-cell { background:#f9fafb !important; }
    .curr-pill { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:6px; background:#f3f4f6; color:#6b7280; font-size:12px; font-weight:600; white-space:nowrap; }
    .new-cell { background:rgba(37,99,235,.03) !important; }
    .changed { background:rgba(37,99,235,.1) !important; font-weight:700; color:#2563eb; }
    .rate-input { width:68px; text-align:center; padding:4px 6px; border:1px solid var(--border-color); border-radius:6px; font-size:12px; font-weight:600; }
    .rate-input:focus { border-color:#2563eb; outline:none; box-shadow:0 0 0 2px rgba(37,99,235,.15); }
    .disc-input { width:80px; text-align:center; padding:4px 6px; border:1px solid var(--border-color); border-radius:6px; font-size:11px; }
    .disc-input:focus { border-color:#2563eb; outline:none; box-shadow:0 0 0 2px rgba(37,99,235,.15); }
    .act-cell { white-space:nowrap; }
    .status-pill { display:inline-block; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:700; background:#f3f4f6; color:#6b7280; }
    .status-pill[data-status="ACTIVE"],.status-pill[data-status="APPROVED"] { background:#dcfce7; color:#166534; }
    .status-pill[data-status="PENDING"] { background:#fef3c7; color:#92400e; }
    .status-pill[data-status="DRAFT"] { background:#e8ebf5; color:#253380; }
    .status-pill[data-status="REJECTED"],.status-pill[data-status="DECLINED"] { background:#fee2e2; color:#991b1b; }
    .empty-cell { text-align:center !important; padding:40px !important; color:var(--color-muted); }
    .empty-cell i { display:block; font-size:28px; margin-bottom:8px; opacity:.4; }
  `]
})
export class RateMatrixComponent implements OnChanges {
  @Input() mode: MatrixMode = 'view';
  @Input() productType: 'ULOC' | 'ILOC' = 'ULOC';
  @Input() tiers: MatrixTier[] = [];
  @Input() rows: MatrixRow[] = [];
  @Input() searchTerm = '';
  @Output() onAction = new EventEmitter<MatrixAction>();

  filteredRows: MatrixRow[] = [];
  colsPerTier = 2;
  allSelected = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.colsPerTier = this.mode === 'enter' ? 3 : 2;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.searchTerm) { this.filteredRows = this.rows; return; }
    const term = this.searchTerm.toLowerCase();
    this.filteredRows = this.rows.filter(r => r.name.toLowerCase().includes(term));
  }

  toggleAll(e: Event): void {
    const checked = (e.target as HTMLInputElement).checked;
    this.filteredRows.forEach(r => r.selected = checked);
    this.allSelected = checked;
  }

  isRowModified(row: MatrixRow): boolean {
    return row.cells.some(c => c.newRate !== null && c.newRate !== undefined && c.newRate !== c.currentRate);
  }

  onSaveRow(row: MatrixRow): void {
    this.onAction.emit({ action: 'save-row', rows: [row] });
  }
}
