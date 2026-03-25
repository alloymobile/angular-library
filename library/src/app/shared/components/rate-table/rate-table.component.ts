import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'plra-rate-table',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="table-responsive">
      <table class="table table-sm table-hover mb-0 rate-tbl">
        <thead>
          <tr>
            @for (col of columns; track col.key) {
              <th [style.width]="col.width || 'auto'" (click)="onSort(col.key)">
                {{ col.label }}
                @if (sortKey === col.key) { <i class="fa-solid" [class.fa-sort-up]="sortDir==='asc'" [class.fa-sort-down]="sortDir==='desc'" style="font-size:10px;margin-left:4px;"></i> }
              </th>
            }
            @if (showActions) { <th style="width:100px">Actions</th> }
          </tr>
        </thead>
        <tbody>
          @for (row of rows; track row['id'] || $index) {
            <tr>
              @for (col of columns; track col.key) {
                <td>
                  @if (col.type === 'status') { <plra-status-badge [status]="row[col.key]" /> }
                  @else if (col.type === 'date') { {{ row[col.key] | date:'yyyy-MM-dd' }} }
                  @else if (col.type === 'rate') { {{ row[col.key] | number:'1.2-4' }}% }
                  @else if (col.type === 'currency') { {{ row[col.key] | number:'1.0-0' }} }
                  @else { {{ row[col.key] }} }
                </td>
              }
              @if (showActions) {
                <td>
                  <div class="d-flex gap-1">
                    @for (act of actions; track act) {
                      <button class="btn btn-sm btn-outline-secondary" style="padding:2px 6px;font-size:11px;" (click)="onAction(act, row)" [title]="act">
                        <i [class]="actionIcons[act] || 'fa-solid fa-ellipsis'"></i>
                      </button>
                    }
                  </div>
                </td>
              }
            </tr>
          } @empty {
            <tr><td [attr.colspan]="columns.length + (showActions ? 1 : 0)" class="text-center text-muted py-4">No data found</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .rate-tbl th { font-size:11px; text-transform:uppercase; letter-spacing:.3px; color:var(--color-muted,#6b7280); background:#f8f9fa; font-weight:600; padding:8px 12px; cursor:pointer; white-space:nowrap; user-select:none; }
    .rate-tbl td { padding:8px 12px; font-size:13px; vertical-align:middle; }
  `]
})
export class RateTableComponent {
  @Input() columns: {key: string; label: string; type?: string; width?: string}[] = [];
  @Input() rows: Record<string, any>[] = [];
  @Input() showActions = false;
  @Input() actions: string[] = [];
  @Output() actionClick = new EventEmitter<{action: string; row: any}>();
  @Output() sortChange = new EventEmitter<{key: string; dir: string}>();

  sortKey = '';
  sortDir: 'asc' | 'desc' = 'asc';

  actionIcons: Record<string, string> = {
    edit: 'fa-solid fa-pen', delete: 'fa-solid fa-trash', view: 'fa-solid fa-eye',
    approve: 'fa-solid fa-check', reject: 'fa-solid fa-xmark', drill: 'fa-solid fa-arrow-right'
  };

  onSort(key: string): void {
    this.sortDir = this.sortKey === key && this.sortDir === 'asc' ? 'desc' : 'asc';
    this.sortKey = key;
    this.sortChange.emit({ key, dir: this.sortDir });
  }

  onAction(action: string, row: any): void {
    this.actionClick.emit({ action, row });
  }
}
