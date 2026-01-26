// td-link-icon.ts
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

import { TdLinkIconModel } from './td-link-icon.model';
import { TdIcon } from '../td-icon/td-icon';
import { generateId, OutputObject } from '../../share';

@Component({
  selector: 'td-link-icon',
  standalone: true,
  imports: [TdIcon],
  templateUrl: './td-link-icon.html',
  styleUrl: './td-link-icon.css',
})
export class TdLinkIcon implements OnInit, OnChanges {
  @Input({ required: true }) linkIcon!: TdLinkIconModel;
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
    this.ensureLinkIcon();
    this.applyLinkIcon();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkIcon']) {
      this.ensureLinkIcon();
      this.applyLinkIcon();
    }
  }

  private ensureLinkIcon(): void {
    if (!this.linkIcon || !(this.linkIcon instanceof TdLinkIconModel)) {
      throw new Error('TdLinkIcon requires `linkIcon` (TdLinkIconModel instance).');
    }
  }

  private applyLinkIcon(): void {
    const incomingId = this.linkIcon.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.linkIcon.id = incomingId;
    } else {
      const next = generateId('link-icon');
      this.domId = next;
      this.linkIcon.id = next;
    }

    this.safeRel = this.linkIcon.getSafeRel();

    this.computedClass = [this.linkIcon.className || 'nav-link', this.linkIcon.active || '']
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
      id: this.linkIcon.id ?? '',
      type: 'link-icon',
      action: 'click',
      data: {
        name: this.linkIcon.name ?? '',
        href: this.linkIcon.href,
        isInternal: this.linkIcon.isInternal(),
        isExternal: this.linkIcon.isExternal(),
      },
    });
    this.output.emit(out);

    // External links: let browser handle (open in new tab, etc.)
    if (this.linkIcon.isExternal()) {
      return; // Don't prevent default
    }

    // Anchor links: let browser handle
    if (this.linkIcon.isAnchor()) {
      return; // Don't prevent default
    }

    // Internal links: use Angular Router
    if (this.linkIcon.isInternal() && this.isBrowser) {
      event.preventDefault();
      this.router.navigateByUrl(this.linkIcon.href);
    }
  }
}