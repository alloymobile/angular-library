// src/demo/pages/tdcarousel/tdcarousel.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdCarouselComponent } from '../../../../lib/components/tissue/td-carousel/td-carousel';
import { CarouselObject } from '../../../../lib/components/tissue/td-carousel/td-carousel.model';

const DEFAULT_RAW: any = {
    id: "demoCarousel",
    className: "card h-100 rounded-3 shadow-sm",
    link: "/products/astro-septic-tank",

    // BlockObject-like header (can include iconClass)
    header: {
      name: "Septic Tanks",
      className: "card-title mb-1",
      iconClass: "fa-solid fa-dumpster"
    },

    // BlockObject-like body (main title)
    body: {
      name: "ASTRO™ Septic Tank Mold",
      className: "fw-semibold"
    },

    // At least 1 field (BlockObject). These become info lines.
    fields: [
      {
        id: "subtitle",
        name: "Steel form — 1,000–3,000 gal",
        className: "small text-secondary"
      },
      {
        id: "description",
        name: "High-throughput modular formwork with quick-release panels for accelerated cycles.",
        className: "mt-3 text-secondary small"
      },
      {
        id: "badge",
        name: "New Equipment",
        className:
          "badge text-bg-primary-subtle text-primary d-inline-block mt-2"
      }
    ],

    // Optional footer (BlockObject)
    footer: {
      id: "carouselFooter",
      name: "Click to view full product details.",
      className:
        "mt-3 small text-muted d-flex justify-content-between align-items-center"
    },

    // REQUIRED: at least 2 images (CarouselImageObject[])
    images: [
      {
        url: "https://picsum.photos/seed/septic1/600/350",
        altText: "Septic tank mold — angle 1",
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: "https://picsum.photos/seed/septic2/600/350",
        altText: "Septic tank mold — angle 2",
        isPrimary: false,
        sortOrder: 2
      },
      {
        url: "https://picsum.photos/seed/septic3/600/350",
        altText: "Septic tank mold — angle 3",
        isPrimary: false,
        sortOrder: 3
      }
    ]
  };
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-carousel',
  standalone: true,
  imports: [CommonModule, TdCarouselComponent],
  templateUrl: './td-carousel-demo.html',
  styleUrls: ['./td-carousel-demo.css']
})
export class TdCarouselDemoComponent {
  title = 'TdCarousel';
  usageSnippet = `<td-carousel [carousel]="model" (output)="handleOutput($event)"></td-carousel>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): CarouselObject {
    try {
      return new CarouselObject(this.parsed);
    } catch (e: any) {
      return new CarouselObject({ name: 'Invalid', items: [] });
    }
  }

  onInputChange(val: string): void {
    this.inputJson = val;
    try {
      const obj = JSON.parse(val || '{}');
      if (!obj || typeof obj !== 'object') throw new Error('JSON must be an object.');
      this.parsed = obj;
      this.parseError = '';
    } catch (e: any) {
      this.parseError = String(e?.message || e || 'Invalid JSON.');
    }
  }

  onReset(): void {
    this.inputJson = DEFAULT_JSON;
    this.parsed = DEFAULT_RAW;
    this.parseError = '';
    this.outputJson = '// Interact with the component to see output here…';
  }

  onFormat(): void {
    try {
      const obj = JSON.parse(this.inputJson || '{}');
      this.inputJson = JSON.stringify(obj, null, 2);
      this.parsed = obj;
      this.parseError = '';
    } catch {
      // ignore
    }
  }

  onClearOutput(): void {
    this.outputJson = '// cleared';
  }

  handleOutput(out: any): void {
    const payload = out && typeof out === 'object' && typeof out.toJSON === 'function' ? out.toJSON() : out;
    this.outputJson = JSON.stringify(payload ?? out, null, 2);
  }

}

function to_pascal(s: string): string {
  return s.split('-').map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '').join('');
}
