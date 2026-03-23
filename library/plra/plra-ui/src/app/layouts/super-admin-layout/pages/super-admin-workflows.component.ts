import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RateApiService } from '../../../core/services/rate-api.service';
import { WorkflowAdminView, PageResponse } from '../../../core/models/api.models';

@Component({
  selector: 'plra-super-admin-workflows',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="mb-3">
      <h2 class="page-heading"><i class="fa-solid fa-code-branch text-td-green me-2"></i>Audit Trail — Workflows</h2>
      <p class="page-subtitle">All rate lifecycle transitions (CREATE → DRAFT → PENDING → APPROVED/REJECTED)</p>
    </header>

    <div class="d-flex align-items-center gap-2 mb-3">
      <input class="form-control form-control-sm" style="max-width:300px" placeholder="Search by action, type, user..." [(ngModel)]="search" (ngModelChange)="applyFilter()" />
      <button class="btn btn-sm btn-outline-secondary" (click)="load()"><i class="fa-solid fa-rotate me-1"></i>Refresh</button>
      <span class="text-muted ms-auto" style="font-size:12px">{{ filtered().length }} of {{ allRows().length }} entries</span>
    </div>

    <div class="table-wrap">
      <table class="wf-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Rate ID</th>
            <th>Action</th>
            <th>From</th>
            <th>To</th>
            <th>Message</th>
            <th>Change ID</th>
            <th>Changed By</th>
            <th>Changed On</th>
          </tr>
        </thead>
        <tbody>
          @for (w of filtered(); track w.id) {
            <tr>
              <td>{{ w.id }}</td>
              <td><span class="type-badge" [attr.data-type]="w.rateType">{{ w.rateType }}</span></td>
              <td>{{ w.rateId }}</td>
              <td><span class="action-badge" [attr.data-action]="w.action">{{ w.action }}</span></td>
              <td><span class="status-pill" [attr.data-status]="w.fromStatus">{{ w.fromStatus || '—' }}</span></td>
              <td><span class="status-pill" [attr.data-status]="w.toStatus">{{ w.toStatus }}</span></td>
              <td class="msg-cell">{{ w.message || '—' }}</td>
              <td>{{ w.changeId }}</td>
              <td>{{ w.changeBy || 'system' }}</td>
              <td>{{ w.changeOn?.substring(0, 16) || w.createdOn?.substring(0, 16) || '—' }}</td>
            </tr>
          } @empty {
            <tr><td colspan="10" class="empty-cell"><i class="fa-solid fa-inbox"></i> No workflow entries found</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-heading { font-size:20px; font-weight:700; display:flex; align-items:center; gap:6px; margin:0; }
    .page-subtitle { font-size:13px; color:var(--color-muted); margin:4px 0 0; }
    .table-wrap { overflow-x:auto; border:1px solid var(--border-color,#e0e0e0); border-radius:10px; background:#fff; }
    .wf-table { width:100%; border-collapse:collapse; font-size:12px; }
    .wf-table thead th { background:#f8fafb; padding:10px 12px; font-size:11px; font-weight:700; color:var(--color-muted); border-bottom:2px solid var(--border-color); white-space:nowrap; text-align:left; }
    .wf-table tbody td { padding:8px 12px; border-bottom:1px solid #f3f4f6; vertical-align:middle; }
    .wf-table tbody tr:hover { background:#f8fafb; }
    .msg-cell { max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--color-muted); font-style:italic; }
    .type-badge { display:inline-block; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:700; }
    .type-badge[data-type="ULOC"] { background:#e8ebf5; color:#253380; }
    .type-badge[data-type="ILOC"] { background:#fef3c7; color:#92400e; }
    .action-badge { display:inline-block; padding:2px 8px; border-radius:6px; font-size:10px; font-weight:700; background:#f3f4f6; color:#374151; }
    .action-badge[data-action="CREATE"] { background:#dbeafe; color:#1e40af; }
    .action-badge[data-action="MODIFY"] { background:#e8ebf5; color:#253380; }
    .action-badge[data-action="SUBMIT"] { background:#fef3c7; color:#92400e; }
    .action-badge[data-action="APPROVE"] { background:#dcfce7; color:#166534; }
    .action-badge[data-action="REJECT"] { background:#fee2e2; color:#991b1b; }
    .action-badge[data-action="CANCEL"] { background:#f3f4f6; color:#6b7280; }
    .action-badge[data-action="ARCHIVE"] { background:#f3e8ff; color:#7c3aed; }
    .action-badge[data-action="EXPIRE"] { background:#f3f4f6; color:#6b7280; }
    .status-pill { display:inline-block; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:700; background:#f3f4f6; color:#6b7280; }
    .status-pill[data-status="ACTIVE"] { background:#dcfce7; color:#166534; }
    .status-pill[data-status="DRAFT"] { background:#dbeafe; color:#1e40af; }
    .status-pill[data-status="PENDING"] { background:#fef3c7; color:#92400e; }
    .status-pill[data-status="APPROVED"] { background:#dcfce7; color:#166534; }
    .status-pill[data-status="REJECTED"] { background:#fee2e2; color:#991b1b; }
    .status-pill[data-status="CANCELLED"] { background:#f3f4f6; color:#6b7280; }
    .status-pill[data-status="SUPERSEDED"] { background:#f3e8ff; color:#7c3aed; }
    .status-pill[data-status="EXPIRED"] { background:#f3f4f6; color:#6b7280; }
    .empty-cell { text-align:center !important; padding:40px !important; color:var(--color-muted); font-size:14px; }
    .empty-cell i { display:block; font-size:28px; margin-bottom:8px; opacity:.4; }
  `]
})
export class SuperAdminWorkflowsComponent implements OnInit {
  private api = inject(RateApiService);
  allRows = signal<WorkflowAdminView[]>([]);
  filtered = signal<WorkflowAdminView[]>([]);
  search = '';

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getWorkflows({ size: 200, sort: 'createdOn,desc' }).subscribe({
      next: (res: PageResponse<WorkflowAdminView>) => {
        this.allRows.set(res.content);
        this.applyFilter();
      }
    });
  }

  applyFilter(): void {
    if (!this.search) { this.filtered.set(this.allRows()); return; }
    const term = this.search.toLowerCase();
    this.filtered.set(this.allRows().filter(w =>
      (w.action?.toLowerCase().includes(term)) ||
      (w.rateType?.toLowerCase().includes(term)) ||
      (w.changeBy?.toLowerCase().includes(term)) ||
      (w.toStatus?.toLowerCase().includes(term)) ||
      (w.message?.toLowerCase().includes(term)) ||
      String(w.rateId).includes(term) ||
      String(w.changeId).includes(term)
    ));
  }
}
