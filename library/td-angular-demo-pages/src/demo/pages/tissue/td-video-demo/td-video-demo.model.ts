// demo model placeholder for td-video
export interface TdVideoDemoModel { title: string; }

function to_pascal(s: string): string {
  return s.split('-').map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '').join('');
}
