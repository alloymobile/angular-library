// demo model placeholder for td-carousel
export interface TdCarouselDemoModel { title: string; }

function to_pascal(s: string): string {
  return s.split('-').map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '').join('');
}
