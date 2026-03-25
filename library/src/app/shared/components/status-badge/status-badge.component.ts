import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'plra-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge-pill" [style.background]="bg" [style.color]="fg">{{ status }}</span>`,
  styles: [`.badge-pill { display:inline-flex; padding:2px 10px; border-radius:12px; font-size:12px; font-weight:500; }`]
})
export class StatusBadgeComponent {
  @Input() status = '';
  get bg(): string {
    const m: Record<string, string> = { ACTIVE:'#dcfce7', DRAFT:'#e0e7ff', PENDING_APPROVAL:'#fef3c7', APPROVED:'#dcfce7', REJECTED:'#fee2e2', EXPIRED:'#f3f4f6', CANCELLED:'#f3f4f6', SUPERSEDED:'#f3f4f6' };
    return m[this.status] || '#f3f4f6';
  }
  get fg(): string {
    const m: Record<string, string> = { ACTIVE:'#166534', DRAFT:'#3730a3', PENDING_APPROVAL:'#b45309', APPROVED:'#166534', REJECTED:'#991b1b', EXPIRED:'#4b5563', CANCELLED:'#4b5563', SUPERSEDED:'#4b5563' };
    return m[this.status] || '#4b5563';
  }
}
