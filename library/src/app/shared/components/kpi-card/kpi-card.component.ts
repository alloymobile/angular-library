import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'plra-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card">
      <div class="kpi-icon" [style.background]="bgMap[color]" [style.color]="fgMap[color]">
        <i [class]="icon"></i>
      </div>
      <div class="kpi-body">
        <div class="kpi-value">{{ value }}</div>
        <div class="kpi-title">{{ title }}</div>
        @if (subtitle) { <div class="kpi-sub">{{ subtitle }}</div> }
      </div>
    </div>
  `,
  styles: [`
    .kpi-card { display:flex; align-items:center; gap:14px; background:#fff; border:1px solid var(--border-color,#e2e6ea); border-radius:10px; padding:18px 20px; transition:box-shadow .2s; }
    .kpi-card:hover { box-shadow:0 4px 12px rgba(0,0,0,.06); }
    .kpi-icon { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
    .kpi-value { font-size:22px; font-weight:700; color:var(--td-dark,#1d1d1d); line-height:1.1; }
    .kpi-title { font-size:13px; font-weight:600; color:var(--color-ink,#111827); margin-top:2px; }
    .kpi-sub { font-size:11px; color:var(--color-muted,#6b7280); }
  `]
})
export class KpiCardComponent {
  @Input() title = '';
  @Input() value: string | number = 0;
  @Input() subtitle = '';
  @Input() icon = 'fa-solid fa-chart-bar';
  @Input() color: 'green' | 'blue' | 'purple' | 'amber' | 'red' = 'green';

  bgMap: Record<string, string> = { green:'#e6f4e6', blue:'#e8ebf5', purple:'#f3e8ff', amber:'#fef3c7', red:'#fce8eb' };
  fgMap: Record<string, string> = { green:'#008A00', blue:'#253380', purple:'#7c3aed', amber:'#d97706', red:'#b12030' };
}
