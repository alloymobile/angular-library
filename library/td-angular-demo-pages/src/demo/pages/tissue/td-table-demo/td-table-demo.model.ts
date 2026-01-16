// demo model placeholder for td-table
export interface TdTableDemoModel { title: string; }

function to_pascal(s: string): string {
  return s.split('-').map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '').join('');
}
