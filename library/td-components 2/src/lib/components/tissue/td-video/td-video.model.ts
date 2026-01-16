// src/lib/components/tissue/td-video/td-video.model.ts

import { generateId } from '../../../utils/id-helper';

export interface VideoConfig {
  id?: string;
  src: string;
  poster?: string;
  className?: string;
  wrapperClassName?: string;
  width?: number | string;
  height?: number | string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  caption?: string;
  captionClassName?: string;
}

export class VideoObject {
  id: string;
  src: string;
  poster: string;
  className: string;
  wrapperClassName: string;
  width?: number | string;
  height?: number | string;
  controls: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  playsInline: boolean;
  preload: string;
  caption: string;
  captionClassName: string;

  constructor(vid: VideoConfig) {
    if (!vid.src) throw new Error('VideoObject requires `src`.');
    this.id = vid.id ?? generateId('video');
    this.src = vid.src;
    this.poster = vid.poster ?? '';
    this.className = vid.className ?? 'w-100';
    this.wrapperClassName = vid.wrapperClassName ?? '';
    this.width = vid.width;
    this.height = vid.height;
    this.controls = vid.controls ?? true;
    this.autoplay = vid.autoplay ?? false;
    this.loop = vid.loop ?? false;
    this.muted = vid.muted ?? false;
    this.playsInline = vid.playsInline ?? true;
    this.preload = vid.preload ?? 'metadata';
    this.caption = vid.caption ?? '';
    this.captionClassName = vid.captionClassName ?? 'text-muted small mt-2';
  }

  hasCaption(): boolean { return !!this.caption; }
  hasPoster(): boolean { return !!this.poster; }
}
