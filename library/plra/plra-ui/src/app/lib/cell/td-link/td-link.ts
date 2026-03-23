// td-link.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { TdLinkModel } from './td-link.model';
import { generateId, OutputObject } from '../../share';

@Component({
  selector: 'td-link',
  standalone: true,
  imports: [],
  templateUrl: './td-link.html',
  styleUrl: './td-link.css',
})
export class TdLink implements OnInit, OnChanges {
  @Input({ required: true }) link!: TdLinkModel;
  @Output() output = new EventEmitter<OutputObject>();

  domId = '';
  safeRel: string | undefined = undefined;
  computedClass = '';

  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.ensureLink();
    this.applyLink();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['link']) {
      this.ensureLink();
      this.applyLink();
    }
  }

  private ensureLink(): void {
    if (!this.link || !(this.link instanceof TdLinkModel)) {
      throw new Error('TdLink requires `link` (TdLinkModel instance).');
    }
  }

  private applyLink(): void {
    const incomingId = this.link.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.link.id = incomingId;
    } else {
      const next = generateId('link');
      this.domId = next;
      this.link.id = next;
    }

    this.safeRel = this.link.getSafeRel();

    this.computedClass = [this.link.className || 'nav-link', this.link.active || '']
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Handle click event
   * - Internal links: preventDefault + Router navigation
   * - External/Anchor links: let browser handle naturally
   */
  onClick(event: MouseEvent): void {
    // Emit output for parent components (e.g., TdLinkBar)
    const out = OutputObject.ok({
      id: this.link.id ?? '',
      type: 'link',
      action: 'click',
      data: {
        name: this.link.name,
        href: this.link.href,
        isInternal: this.link.isInternal(),
        isExternal: this.link.isExternal(),
      },
    });
    this.output.emit(out);

    // External links: let browser handle (open in new tab, etc.)
    if (this.link.isExternal()) {
      return; // Don't prevent default
    }

    // Anchor links: let browser handle
    if (this.link.isAnchor()) {
      return; // Don't prevent default
    }

    // Internal links: use Angular Router
    if (this.link.isInternal() && this.isBrowser) {
      event.preventDefault();
      this.router.navigateByUrl(this.link.href);
    }
  }
}