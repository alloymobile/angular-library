// src/lib/components/cell/td-media/td-media.model.ts

import { generateId, TagObject } from '../../../utils/id-helper';
import { LinkObject } from '../td-link/td-link.model';

/* ----------------------------- helpers ----------------------------- */

function cleanUrl(u: string): string {
  const s = String(u || '').trim();
  if (!s) return '';
  return s.split('#')[0].split('?')[0];
}

function extOf(u: string): string {
  const c = cleanUrl(u).toLowerCase();
  const i = c.lastIndexOf('.');
  return i >= 0 ? c.slice(i + 1) : '';
}

export function inferKindFromUrl(url: string): string {
  const ext = extOf(url);

  if (ext === 'glb') return 'glb';
  if (ext === 'pdf') return 'pdf';

  if (['mp4', 'webm', 'ogg', 'ogv'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'm4a', 'aac', 'opus', 'oga', 'flac'].includes(ext)) return 'audio';

  if (['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg', 'bmp'].includes(ext)) return 'image';

  return 'unknown';
}

export function namePosition(pos: string): string {
  const p = String(pos || '').trim().toLowerCase();
  return p || 'below';
}

export function isOverlayPos(pos: string): boolean {
  const p = namePosition(pos);
  return p.startsWith('overlay-');
}

export function overlayPosClass(pos: string): string {
  const p = namePosition(pos);
  return p === 'overlay-top-left'
    ? 'top-0 start-0'
    : p === 'overlay-top-right'
    ? 'top-0 end-0'
    : p === 'overlay-bottom-right'
    ? 'bottom-0 end-0'
    : 'bottom-0 start-0';
}

export function pickIconClass(fallback: any, def: string): string {
  const c = String(fallback?.iconClass || '').trim();
  return c || def;
}

/* -------------------------- Z-Index layers -------------------------- */

export const Z_MEDIA = 1;
export const Z_NAME = 15;
export const Z_CAROUSEL = 20;
export const Z_ZOOM = 25;

/* -------------------------- MediaItemObject -------------------------- */

export interface MediaItemConfig {
  id?: string;
  url?: string;
  thumbUrl?: string;
  thumbnailUrl?: string;
  isPrimary?: boolean;
}

export class MediaItemObject {
  id: string;
  url: string;
  thumbUrl: string;
  isPrimary: boolean;

  constructor(it: MediaItemConfig = {}, idx: number = 0) {
    this.id = String(it?.id || `media-item-${idx}`);
    this.url = String(it?.url || '').trim();
    this.thumbUrl = String(it?.thumbUrl || it?.thumbnailUrl || '').trim() || '';
    this.isPrimary = !!it?.isPrimary;
  }

  kind(): string {
    return inferKindFromUrl(this.url);
  }
}

/* -------------------------- NameDisplay Config -------------------------- */

export interface NameDisplayConfig {
  position?: string;
  className?: string;
  wrapperClassName?: string;
}

/* -------------------------- Carousel Config -------------------------- */

export interface CarouselConfig {
  controls?: boolean;
  indicators?: boolean;
  keyboard?: boolean;
  swipe?: boolean;
}

/* -------------------------- Zoom Config -------------------------- */

export interface ZoomConfig {
  icon?: { iconClass: string };
  buttonClassName?: string;
  wrapperClassName?: string;
}

/* -------------------------- Auto Config -------------------------- */

export interface AutoConfig {
  enabled?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  pauseOnZoom?: boolean;
  loop?: boolean;
}

/* -------------------------- Media Type Configs -------------------------- */

export interface ImgConfig {
  alt?: string;
  className?: string;
  cardFitClass?: string;
  zoomFitClass?: string;
  fallbackIcon?: { iconClass: string };
  attrs?: Record<string, any>;
}

export interface VidConfig {
  className?: string;
  cardFitClass?: string;
  zoomFitClass?: string;
  fallbackIcon?: { iconClass: string };
  attrs?: Record<string, any>;
}

export interface AudConfig {
  className?: string;
  fallbackIcon?: { iconClass: string };
  attrs?: Record<string, any>;
}

export interface PdfConfig {
  className?: string;
  fallbackIcon?: { iconClass: string };
  attrs?: Record<string, any>;
}

export interface GlbConfig {
  alt?: string;
  className?: string;
  fallbackIcon?: { iconClass: string };
  attrs?: Record<string, any>;
}

/* -------------------------- MediaObject -------------------------- */

export interface MediaConfig {
  id?: string;
  className?: string;
  frameClassName?: string;
  colSpan?: number;
  rowSpan?: number;
  name?: any;
  nameDisplay?: NameDisplayConfig;
  thumbSize?: number;
  carousel?: CarouselConfig;
  zoom?: ZoomConfig;
  auto?: AutoConfig;
  img?: ImgConfig;
  vid?: VidConfig;
  aud?: AudConfig;
  pdf?: PdfConfig;
  glb?: GlbConfig;
  detailsClassName?: string;
  details?: any[];
  items: MediaItemConfig[];
}

export class MediaObject {
  id: string;
  className: string;
  frameClassName: string;
  colSpan: number;
  rowSpan: number;
  name: LinkObject | null;
  nameDisplay: { position: string; className: string; wrapperClassName: string } | null;
  thumbSize: number | null;
  carousel: { controls: boolean; indicators: boolean; keyboard: boolean; swipe: boolean } | null;
  zoom: { icon: { iconClass: string }; buttonClassName: string; wrapperClassName: string } | null;
  auto: { enabled: boolean; intervalMs: number; pauseOnHover: boolean; pauseOnZoom: boolean; loop: boolean } | null;
  img: ImgConfig | null;
  vid: VidConfig | null;
  aud: AudConfig | null;
  pdf: PdfConfig | null;
  glb: GlbConfig | null;
  detailsClassName: string;
  details: TagObject[];
  items: MediaItemObject[];

  constructor(cfg: MediaConfig) {
    this.id = cfg.id ?? generateId('media');

    this.className = typeof cfg.className === 'string' ? cfg.className : '';
    this.frameClassName = typeof cfg.frameClassName === 'string' ? cfg.frameClassName : '';
    this.colSpan = Number.isFinite(Number(cfg.colSpan)) ? Math.max(1, Math.floor(Number(cfg.colSpan))) : 1;
    this.rowSpan = Number.isFinite(Number(cfg.rowSpan)) ? Math.max(1, Math.floor(Number(cfg.rowSpan))) : 1;

    // Name (LinkObject)
    const rawName = cfg.name ?? null;
    this.name = rawName
      ? rawName instanceof LinkObject
        ? rawName
        : new LinkObject(rawName)
      : null;

    // Name display config
    const nd = cfg.nameDisplay && typeof cfg.nameDisplay === 'object' ? cfg.nameDisplay : null;
    this.nameDisplay = nd
      ? {
          position: namePosition(nd.position || ''),
          className: typeof nd.className === 'string' ? nd.className : '',
          wrapperClassName: typeof nd.wrapperClassName === 'string' ? nd.wrapperClassName : '',
        }
      : null;

    this.thumbSize = Number.isFinite(Number(cfg.thumbSize)) ? Number(cfg.thumbSize) : null;

    // Carousel config
    const car = cfg.carousel && typeof cfg.carousel === 'object' ? cfg.carousel : null;
    this.carousel = car
      ? {
          controls: car.controls !== false,
          indicators: car.indicators !== false,
          keyboard: car.keyboard !== false,
          swipe: car.swipe !== false,
        }
      : null;

    // Zoom config
    const zoom = cfg.zoom && typeof cfg.zoom === 'object' ? cfg.zoom : null;
    this.zoom = zoom
      ? {
          icon: zoom.icon ?? { iconClass: 'fa-solid fa-magnifying-glass-plus' },
          buttonClassName:
            zoom.buttonClassName ??
            'btn btn-light btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center',
          wrapperClassName: zoom.wrapperClassName ?? 'position-absolute top-0 end-0 m-2',
        }
      : null;

    // Auto config
    const rawAuto = cfg.auto && typeof cfg.auto === 'object' ? cfg.auto : null;
    if (rawAuto) {
      const ms = Number(rawAuto.intervalMs);
      this.auto = {
        enabled: !!rawAuto.enabled,
        intervalMs: Number.isFinite(ms) ? Math.max(1000, ms) : 5000,
        pauseOnHover: rawAuto.pauseOnHover !== false,
        pauseOnZoom: rawAuto.pauseOnZoom !== false,
        loop: rawAuto.loop !== false,
      };
    } else {
      this.auto = null;
    }

    // Image config
    const img = cfg.img && typeof cfg.img === 'object' ? cfg.img : null;
    this.img = img
      ? {
          alt: img.alt ?? 'Image',
          className: img.className ?? '',
          cardFitClass: img.cardFitClass ?? 'object-fit-cover',
          zoomFitClass: img.zoomFitClass ?? 'object-fit-contain',
          fallbackIcon: img.fallbackIcon ?? { iconClass: 'fa-regular fa-image' },
          attrs: img.attrs && typeof img.attrs === 'object' ? img.attrs : {},
        }
      : null;

    // Video config
    const vid = cfg.vid && typeof cfg.vid === 'object' ? cfg.vid : null;
    this.vid = vid
      ? {
          className: vid.className ?? '',
          cardFitClass: vid.cardFitClass ?? 'object-fit-cover',
          zoomFitClass: vid.zoomFitClass ?? 'object-fit-contain',
          fallbackIcon: vid.fallbackIcon ?? { iconClass: 'fa-solid fa-play' },
          attrs:
            vid.attrs && typeof vid.attrs === 'object'
              ? vid.attrs
              : { autoPlay: true, loop: true, muted: true, playsInline: true, preload: 'auto' },
        }
      : null;

    // Audio config
    const aud = cfg.aud && typeof cfg.aud === 'object' ? cfg.aud : null;
    this.aud = aud
      ? {
          className: aud.className ?? '',
          fallbackIcon: aud.fallbackIcon ?? { iconClass: 'fa-solid fa-volume-high' },
          attrs: aud.attrs && typeof aud.attrs === 'object' ? aud.attrs : { controls: true, preload: 'metadata' },
        }
      : null;

    // PDF config
    const pdf = cfg.pdf && typeof cfg.pdf === 'object' ? cfg.pdf : null;
    this.pdf = pdf
      ? {
          className: pdf.className ?? '',
          fallbackIcon: pdf.fallbackIcon ?? { iconClass: 'fa-regular fa-file-pdf' },
          attrs: pdf.attrs && typeof pdf.attrs === 'object' ? pdf.attrs : {},
        }
      : null;

    // GLB config
    const glb = cfg.glb && typeof cfg.glb === 'object' ? cfg.glb : null;
    this.glb = glb
      ? {
          alt: glb.alt ?? '3D model',
          className: glb.className ?? '',
          fallbackIcon: glb.fallbackIcon ?? { iconClass: 'fa-solid fa-cube' },
          attrs:
            glb.attrs && typeof glb.attrs === 'object'
              ? glb.attrs
              : {
                  crossorigin: 'anonymous',
                  'camera-controls': true,
                  'auto-rotate': true,
                  'shadow-intensity': '1',
                  'environment-image': 'neutral',
                },
        }
      : null;

    this.detailsClassName =
      typeof cfg.detailsClassName === 'string' && cfg.detailsClassName.trim()
        ? cfg.detailsClassName
        : 'd-flex flex-wrap gap-2 mt-2';

    // Details (TagObjects)
    const rawDetails = Array.isArray(cfg.details) ? cfg.details : [];
    this.details = rawDetails
      .map((t, i) => {
        const obj = t instanceof TagObject ? t : new TagObject(t || {});
        if (!String(obj.name || '').trim()) return null;
        if (!obj.id) obj.id = `tag-${i}`;
        return obj;
      })
      .filter((d): d is TagObject => d !== null);

    // Items (MediaItemObjects)
    const rawItems = Array.isArray(cfg.items) ? cfg.items : [];
    const items = rawItems
      .map((it, idx) => {
        const obj = it instanceof MediaItemObject ? it : new MediaItemObject(it || {}, idx);
        if (!obj.url) return null;
        return obj;
      })
      .filter((i): i is MediaItemObject => i !== null)
      .sort((a, b) => {
        const ap = a?.isPrimary ? 1 : 0;
        const bp = b?.isPrimary ? 1 : 0;
        if (bp !== ap) return bp - ap;
        return String(a?.id || '').localeCompare(String(b?.id || ''));
      });

    if (!items.length) {
      throw new Error('MediaObject requires at least 1 item with a non-empty `url`.');
    }

    this.items = items;
  }
}
