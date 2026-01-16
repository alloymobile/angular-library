// src/lib/components/cell/td-media/td-media.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaObject, MediaItemObject, inferKindFromUrl, namePosition, isOverlayPos, overlayPosClass, pickIconClass, Z_MEDIA, Z_NAME, Z_CAROUSEL, Z_ZOOM } from './td-media.model';
import { TdLinkComponent } from '../td-link/td-link';
import { LinkObject } from '../td-link/td-link.model';

/**
 * TdMediaComponent
 * 
 * Renders a media gallery with support for images, videos, audio, PDFs, and 3D models (GLB).
 * Features: carousel, thumbnails, zoom modal, auto-play
 */
@Component({
  selector: 'td-media',
  standalone: true,
  imports: [CommonModule, TdLinkComponent],
  templateUrl: './td-media.html',
  styleUrls: ['./td-media.css']
})
export class TdMediaComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Input: MediaObject instance (required)
   */
  @Input() media!: MediaObject;

  /**
   * Output: Emits events
   */
  @Output() output = new EventEmitter<any>();

  // State
  activeMediaId = '';
  zoomOpen = false;
  hover = false;
  thumbPx = 72;

  // Auto-play timer
  private autoTimer: any = null;

  // Z-index constants for template
  readonly Z_MEDIA = Z_MEDIA;
  readonly Z_NAME = Z_NAME;
  readonly Z_CAROUSEL = Z_CAROUSEL;
  readonly Z_ZOOM = Z_ZOOM;

  ngOnInit(): void {
    this.validateInput();
    this.initState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['media']) {
      this.validateInput();
      this.initState();
    }
  }

  ngOnDestroy(): void {
    this.clearAutoTimer();
  }

  private validateInput(): void {
    if (!this.media || !(this.media instanceof MediaObject)) {
      throw new Error('TdMediaComponent requires `media` prop (MediaObject instance).');
    }
  }

  private initState(): void {
    const first = this.items[0] || null;
    this.activeMediaId = first ? String(first.id) : '';
    this.thumbPx = Number(this.media.thumbSize || 72);
    this.setupAutoPlay();
  }

  // ==================== Getters ====================

  get items(): MediaItemObject[] {
    return Array.isArray(this.media.items) ? this.media.items : [];
  }

  get active(): MediaItemObject | null {
    return this.items.find(m => String(m.id) === String(this.activeMediaId)) || this.items[0] || null;
  }

  get activeKind(): string {
    if (!this.active) return 'unknown';
    return this.active.kind();
  }

  get canThumbs(): boolean {
    return !!this.media.thumbSize && this.items.length > 1;
  }

  get canCarousel(): boolean {
    return !!this.media.carousel && this.items.length > 1;
  }

  get showZoom(): boolean {
    return !!this.media.zoom && this.items.length > 0;
  }

  get currentIndex(): number {
    return Math.max(0, this.items.findIndex(m => String(m.id) === String(this.activeMediaId)));
  }

  get cardFrameClass(): string {
    if (this.media.frameClassName && String(this.media.frameClassName).trim()) {
      return `bg-light rounded-4 overflow-hidden border position-relative w-100 d-flex align-items-center justify-content-center ${String(this.media.frameClassName).trim()}`;
    }
    return 'ratio ratio-1x1 bg-light rounded-4 overflow-hidden border position-relative w-100 d-flex align-items-center justify-content-center';
  }

  get cardFitClass(): string {
    return this.media.img?.cardFitClass || 'object-fit-cover';
  }

  get zoomFitClass(): string {
    const k = this.activeKind;
    if (k === 'video') return this.media.vid?.zoomFitClass || 'object-fit-contain';
    return this.media.img?.zoomFitClass || 'object-fit-contain';
  }

  get zoomBtnWrapperClass(): string {
    return this.media.zoom?.wrapperClassName || 'position-absolute top-0 end-0 m-2';
  }

  get zoomBtnClass(): string {
    return this.media.zoom?.buttonClassName || 'btn btn-light btn-sm rounded-circle shadow-sm';
  }

  get zoomIconClass(): string {
    return String(this.media.zoom?.icon?.iconClass || 'fa-solid fa-magnifying-glass-plus');
  }

  get hasDetails(): boolean {
    return Array.isArray(this.media.details) && this.media.details.length > 0;
  }

  get ndPos(): string {
    return namePosition(this.media?.nameDisplay?.position || '');
  }

  get showNameTop(): boolean {
    return !!this.media?.nameDisplay && this.ndPos === 'top';
  }

  get showNameBelow(): boolean {
    return !!this.media?.nameDisplay && this.ndPos === 'below';
  }

  get showNameOverlay(): boolean {
    return !!this.media?.nameDisplay && isOverlayPos(this.ndPos) && this.activeKind !== 'glb';
  }

  get overlayPositionClass(): string {
    return overlayPosClass(this.ndPos);
  }

  get nameWrapperClass(): string {
    return String(this.media?.nameDisplay?.wrapperClassName || '').trim();
  }

  get nameTextClass(): string {
    return String(this.media?.nameDisplay?.className || '').trim();
  }

  // ==================== Navigation ====================

  goNext(): void {
    if (this.items.length <= 1) return;
    const idx = this.currentIndex;
    const next = idx + 1 < this.items.length ? idx + 1 : 0;
    this.setActiveMediaId(String(this.items[next].id));
  }

  goPrev(): void {
    if (this.items.length <= 1) return;
    const idx = this.currentIndex;
    const prev = idx - 1 >= 0 ? idx - 1 : this.items.length - 1;
    this.setActiveMediaId(String(this.items[prev].id));
  }

  setActiveMediaId(id: string): void {
    this.activeMediaId = id;
    this.setupAutoPlay();
  }

  // ==================== Auto-play ====================

  private clearAutoTimer(): void {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  }

  private setupAutoPlay(): void {
    this.clearAutoTimer();

    const auto = this.media?.auto;
    if (!auto?.enabled) return;
    if (this.items.length <= 1) return;
    if (auto.pauseOnZoom && this.zoomOpen) return;
    if (auto.pauseOnHover && this.hover) return;

    const idx = this.currentIndex;
    const nextIdx = idx + 1 < this.items.length ? idx + 1 : auto.loop ? 0 : idx;
    if (nextIdx === idx) return;

    this.autoTimer = setTimeout(() => {
      this.setActiveMediaId(String(this.items[nextIdx].id));
    }, Number(auto.intervalMs || 5000));
  }

  // ==================== Zoom ====================

  openZoom(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.zoomOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeZoom(): void {
    this.zoomOpen = false;
    document.body.style.overflow = '';
    this.setupAutoPlay();
  }

  onZoomBackdropClick(): void {
    this.closeZoom();
  }

  onZoomContentClick(event: Event): void {
    event.stopPropagation();
  }

  // ==================== Hover ====================

  onMouseEnter(): void {
    this.hover = true;
    this.setupAutoPlay();
  }

  onMouseLeave(): void {
    this.hover = false;
    this.setupAutoPlay();
  }

  // ==================== Keyboard ====================

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.canCarousel) return;
    if (!this.media?.carousel?.keyboard) return;

    if (event.key === 'ArrowLeft') this.goPrev();
    if (event.key === 'ArrowRight') this.goNext();
  }

  // ==================== Thumbnail Helpers ====================

  getThumbIconClass(item: MediaItemObject): string {
    const kind = item.kind();
    if (kind === 'glb') return pickIconClass(this.media?.glb?.fallbackIcon, 'fa-solid fa-cube');
    if (kind === 'pdf') return pickIconClass(this.media?.pdf?.fallbackIcon, 'fa-regular fa-file-pdf');
    if (kind === 'audio') return pickIconClass(this.media?.aud?.fallbackIcon, 'fa-solid fa-volume-high');
    if (kind === 'video') return pickIconClass(this.media?.vid?.fallbackIcon, 'fa-solid fa-play');
    return pickIconClass(this.media?.img?.fallbackIcon, 'fa-regular fa-image');
  }

  getThumbAriaLabel(item: MediaItemObject): string {
    const kind = item.kind();
    if (kind === 'glb') return 'View 3D model';
    if (kind === 'pdf') return 'View PDF';
    if (kind === 'audio') return 'Play audio';
    if (kind === 'video') return 'View video';
    return 'View image';
  }

  isThumbActive(item: MediaItemObject): boolean {
    return String(item.id) === String(this.activeMediaId);
  }

  // ==================== Media Rendering Helpers ====================

  getActiveUrl(): string {
    return String(this.active?.url || '').trim();
  }

  getVideoAttrs(): Record<string, any> {
    return this.media?.vid?.attrs && typeof this.media.vid.attrs === 'object'
      ? this.media.vid.attrs
      : { autoplay: true, loop: true, muted: true, playsinline: true, preload: 'auto' };
  }

  getAudioAttrs(): Record<string, any> {
    return this.media?.aud?.attrs || { controls: true, preload: 'metadata' };
  }

  getGlbAttrs(): Record<string, any> {
    return this.media?.glb?.attrs || {
      crossorigin: 'anonymous',
      'camera-controls': true,
      'auto-rotate': true,
      'shadow-intensity': '1',
      'environment-image': 'neutral',
    };
  }

  onVideoLoaded(event: Event): void {
    const video = event.target as HTMLVideoElement;
    try {
      video.currentTime = 0;
      const pr = video.play();
      if (pr && typeof pr.catch === 'function') pr.catch(() => {});
    } catch {}
  }

  onVideoCanPlay(event: Event): void {
    const video = event.target as HTMLVideoElement;
    try {
      const pr = video.play();
      if (pr && typeof pr.catch === 'function') pr.catch(() => {});
    } catch {}
  }
}
