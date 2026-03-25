// td-link-logo.ts
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

import { TdLinkLogoModel } from './td-link-logo.model';
import { generateId, OutputObject } from '../../share';

@Component({
  selector: 'td-link-logo',
  standalone: true,
  imports: [],
  templateUrl: './td-link-logo.html',
  styleUrl: './td-link-logo.css',
})
export class TdLinkLogo implements OnInit, OnChanges {
  @Input({ required: true }) linkLogo!: TdLinkLogoModel;
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
    this.ensureLinkLogo();
    this.applyLinkLogo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkLogo']) {
      this.ensureLinkLogo();
      this.applyLinkLogo();
    }
  }

  private ensureLinkLogo(): void {
    if (!this.linkLogo || !(this.linkLogo instanceof TdLinkLogoModel)) {
      throw new Error('TdLinkLogo requires `linkLogo` (TdLinkLogoModel instance).');
    }
  }

  private applyLinkLogo(): void {
    const incomingId = this.linkLogo.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.linkLogo.id = incomingId;
    } else {
      const next = generateId('link-logo');
      this.domId = next;
      this.linkLogo.id = next;
    }

    this.safeRel = this.linkLogo.getSafeRel();

    this.computedClass = [this.linkLogo.className || 'nav-link', this.linkLogo.active || '']
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
      id: this.linkLogo.id ?? '',
      type: 'link-logo',
      action: 'click',
      data: {
        name: this.linkLogo.name ?? '',
        href: this.linkLogo.href,
        isInternal: this.linkLogo.isInternal(),
        isExternal: this.linkLogo.isExternal(),
      },
    });
    this.output.emit(out);

    // External links: let browser handle (open in new tab, etc.)
    if (this.linkLogo.isExternal()) {
      return; // Don't prevent default
    }

    // Anchor links: let browser handle
    if (this.linkLogo.isAnchor()) {
      return; // Don't prevent default
    }

    // Internal links: use Angular Router
    if (this.linkLogo.isInternal() && this.isBrowser) {
      event.preventDefault();
      this.router.navigateByUrl(this.linkLogo.href);
    }
  }
}