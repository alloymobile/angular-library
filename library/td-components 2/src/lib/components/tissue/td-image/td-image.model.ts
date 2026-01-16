// src/lib/components/tissue/td-image/td-image.model.ts

import { generateId } from '../../../utils/id-helper';
import { LinkObject } from '../../cell/td-link/td-link.model';

/**
 * ImageConfig - Configuration for TdImage component
 */
export interface ImageConfig {
  id?: string;
  src: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  caption?: string;
  captionClassName?: string;
  link?: any;
  fallbackSrc?: string;
}

export class ImageObject {
  id: string;
  src: string;
  alt: string;
  className: string;
  wrapperClassName: string;
  width?: number | string;
  height?: number | string;
  loading: 'lazy' | 'eager';
  objectFit: string;
  caption: string;
  captionClassName: string;
  link: LinkObject | null;
  fallbackSrc: string;

  constructor(img: ImageConfig) {
    if (!img.src) {
      throw new Error('ImageObject requires `src`.');
    }

    this.id = img.id ?? generateId('image');
    this.src = img.src;
    this.alt = img.alt ?? '';
    this.className = img.className ?? 'img-fluid';
    this.wrapperClassName = img.wrapperClassName ?? '';
    this.width = img.width;
    this.height = img.height;
    this.loading = img.loading ?? 'lazy';
    this.objectFit = img.objectFit ?? 'cover';
    this.caption = img.caption ?? '';
    this.captionClassName = img.captionClassName ?? 'text-muted small mt-2';
    this.fallbackSrc = img.fallbackSrc ?? '';

    // Hydrate link
    const rawLink = img.link || null;
    if (rawLink) {
      this.link = rawLink instanceof LinkObject ? rawLink : new LinkObject(rawLink);
    } else {
      this.link = null;
    }
  }

  hasCaption(): boolean {
    return !!this.caption;
  }

  hasLink(): boolean {
    return !!(this.link && this.link.href);
  }

  getStyle(): Record<string, any> {
    const style: Record<string, any> = {};
    if (this.width) style['width'] = typeof this.width === 'number' ? `${this.width}px` : this.width;
    if (this.height) style['height'] = typeof this.height === 'number' ? `${this.height}px` : this.height;
    if (this.objectFit) style['object-fit'] = this.objectFit;
    return style;
  }
}
