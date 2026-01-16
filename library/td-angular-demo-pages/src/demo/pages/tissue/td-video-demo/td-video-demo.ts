// src/demo/pages/tdvideo/tdvideo.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdVideoComponent } from '../../../../lib/components/tissue/td-video/td-video';
import { VideoObject } from '../../../../lib/components/tissue/td-video/td-video.model';

const DEFAULT_RAW: any = {
    id: "demoVideo",
    className: "card h-100 rounded-3 shadow-sm",

    // BlockObject-like header (can include iconClass)
    header: {
      name: "Precast Training Session",
      className: "card-title mb-1",
      iconClass: "fa-solid fa-chalkboard-teacher"
    },

    // BlockObject-like body (main title)
    body: {
      name: "ASTRO™ Wet-Cast Line — Operator Overview",
      className: "fw-semibold"
    },

    // At least 1 field (BlockObject). These become info lines.
    fields: [
      {
        id: "subtitle",
        name: "Introduction to cycle times, safety zones and crane interface.",
        className: "small text-secondary"
      },
      {
        id: "description",
        name: "Use this clip to onboard new operators on batching sequence, casting order and curing workflow.",
        className: "mt-3 text-secondary small"
      },
      {
        id: "badge",
        name: "Internal Training",
        className:
          "badge text-bg-primary-subtle text-primary d-inline-block mt-2"
      }
    ],

    // Optional footer (BlockObject)
    footer: {
      id: "videoFooter",
      name: "Use in LMS or embed on your operator portal.",
      className:
        "mt-3 small text-muted d-flex justify-content-between align-items-center"
    },

    // REQUIRED: video (VideoMediaObject)
    video: {
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      poster: "https://picsum.photos/seed/videoposter/900/500",
      caption: "Sample training clip — replace with your own precast walkthrough.",
      controls: true,
      autoPlay: false,
      loop: false,
      muted: false,
      playsInline: true
    }
  };
const DEFAULT_JSON = JSON.stringify(DEFAULT_RAW, null, 2);

@Component({
  selector: 'td-demo-td-video',
  standalone: true,
  imports: [CommonModule, TdVideoComponent],
  templateUrl: './td-video-demo.html',
  styleUrls: ['./td-video-demo.css']
})
export class TdVideoDemoComponent {
  title = 'TdVideo';
  usageSnippet = `<td-video [video]="model" (output)="handleOutput($event)"></td-video>`;

  inputJson = DEFAULT_JSON;
  parseError = '';
  outputJson = '// Interact with the component to see output here…';

  // keep last valid object while typing invalid JSON
  parsed: any = DEFAULT_RAW;


  get model(): VideoObject {
    try {
      return new VideoObject(this.parsed);
    } catch (e: any) {
      return new VideoObject({ name: 'Invalid', url: '', className: 'ratio ratio-16x9' });
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
