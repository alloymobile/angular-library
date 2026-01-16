// src/lib/components/tissue/td-carousel/td-carousel.model.ts

import { generateId } from '../../../utils/id-helper';

export interface CarouselSlideConfig {
  id?: string;
  src: string;
  alt?: string;
  caption?: string;
  captionTitle?: string;
}

export class CarouselSlideObject {
  id: string;
  src: string;
  alt: string;
  caption: string;
  captionTitle: string;

  constructor(slide: CarouselSlideConfig, index: number = 0) {
    this.id = slide.id ?? `slide-${index}`;
    this.src = slide.src || '';
    this.alt = slide.alt ?? '';
    this.caption = slide.caption ?? '';
    this.captionTitle = slide.captionTitle ?? '';
  }

  hasCaption(): boolean {
    return !!(this.caption || this.captionTitle);
  }
}

export interface CarouselConfig {
  id?: string;
  className?: string;
  slides: CarouselSlideConfig[];
  controls?: boolean;
  indicators?: boolean;
  fade?: boolean;
  interval?: number | false;
  keyboard?: boolean;
  pause?: 'hover' | false;
  ride?: 'carousel' | boolean;
  wrap?: boolean;
}

export class CarouselObject {
  id: string;
  className: string;
  slides: CarouselSlideObject[];
  controls: boolean;
  indicators: boolean;
  fade: boolean;
  interval: number | false;
  keyboard: boolean;
  pause: 'hover' | false;
  ride: 'carousel' | boolean;
  wrap: boolean;

  constructor(cfg: CarouselConfig) {
    if (!cfg.slides || cfg.slides.length === 0) {
      throw new Error('CarouselObject requires at least one slide.');
    }

    this.id = cfg.id ?? generateId('carousel');
    this.className = cfg.className ?? 'carousel slide';
    this.controls = cfg.controls ?? true;
    this.indicators = cfg.indicators ?? true;
    this.fade = cfg.fade ?? false;
    this.interval = cfg.interval ?? 5000;
    this.keyboard = cfg.keyboard ?? true;
    this.pause = cfg.pause ?? 'hover';
    this.ride = cfg.ride ?? false;
    this.wrap = cfg.wrap ?? true;

    this.slides = cfg.slides.map((s, i) => 
      s instanceof CarouselSlideObject ? s : new CarouselSlideObject(s, i)
    );
  }

  getCarouselClass(): string {
    let cls = this.className;
    if (this.fade) cls += ' carousel-fade';
    return cls;
  }
}
