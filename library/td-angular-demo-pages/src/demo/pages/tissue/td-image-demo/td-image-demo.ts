// src/demo/pages/tdimage/tdimage.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdImageComponent } from '../../../../lib/components/tissue/td-image/td-image';
import { ImageObject } from '../../../../lib/components/tissue/td-image/td-image.model';

const DEFAULT_RAW: any = {
    id: "demoImage",
    className: "card h-100 rounded-3 shadow-sm",
    link: "/projects/plant-layout",

    // BlockObject-like header (can include iconClass)
    header: {
      name: "Precast Plant Layout",
      className: "card-title mb-1",
      iconClass: "fa-solid fa-industry"
    },

    // BlockObject-like body (main title)
    body: {
      name: "ASTRO™ Wet-Cast Production Line",
      className: "fw-semibold"
    },

    // At least 1 field (BlockObject). These become info lines.
    fields: [
      {
        id: "subtitle",
        name: "3D visualization — bays, batching & curing",
        className: "small text-secondary"
      },
      {
        id: "description",
        name: "Cycle through perspectives to review crane coverage, pallet flow, and curing chamber access.",
        className: "mt-3 text-secondary small"
      },
      {
        id: "badge",
        name: "Concept Design",
        className:
          "badge text-bg-primary-subtle text-primary d-inline-block mt-2"
      }
    ],

    // Optional footer (BlockObject)
    footer: {
      id: "imageFooter",
      name: "Click the large image to cycle through views.",
      className:
        "mt-3 small text-muted d-flex justify-content-between align-items-center"
    },

    // REQUIRED: at least 2 images (ImageMediaObject[])
    images: [
      {
        url: "https://picsum.photos/seed/plant1/900/500",
        altText: "Plant layout — top-down perspective",
        caption: "Top-down view across casting bays.",
        isPrimary: true,
        sortOrder: 1
      },
      {
        url: "https://picsum.photos/seed/plant2/900/500",
        altText: "Plant layout — side elevation",
        caption: "Side elevation showing crane runway.",
        isPrimary: false,
        sortOrder: 2
      },
      {
        url: "https://picsum.photos/seed/plant3/900/500",
        altText: "Plant layout — curing chamber detail",
        caption: "Detail around curing chambers and loading.",
        isPrimary: false,
        sortOrder: 3
      }
    ]
  };
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-image',
  standalone: true,
  imports: [CommonModule, TdImageComponent],
  templateUrl: './td-image-demo.html',
  styleUrls: ['./td-image-demo.css']
})
export class TdImageDemoComponent {
  title = 'TdImage';
  usageSnippet = `<td-image [image]="model" (output)="handleOutput($event)"></td-image>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): ImageObject {
    try {
      return new ImageObject(this.parsed);
    } catch (e: any) {
      return new ImageObject({ name: 'Invalid', url: '', className: 'img-fluid' });
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
