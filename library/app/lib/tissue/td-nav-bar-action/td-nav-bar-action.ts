import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { NavBarActionObject } from './td-nav-bar-action.model';
import { OutputObject } from '../../share';
import { TdLinkBar } from '../td-link-bar/td-link-bar';
import { TdButtonBar } from '../td-button-bar/td-button-bar';

@Component({
  selector: 'td-nav-bar-action',
  standalone: true,
  imports: [CommonModule, TdLinkBar, TdButtonBar],
  templateUrl: './td-nav-bar-action.html',
  styleUrls: ['./td-nav-bar-action.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdNavBarAction implements OnInit, OnChanges {
  @Input({ required: true }) navBarAction!: NavBarActionObject;
  @Output() output = new EventEmitter<OutputObject>();

  isAuthenticated = false;
  private isBrowser: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.checkAuthState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['navBarAction']) {
      this.checkAuthState();
    }
  }

  /**
   * Check authentication state based on config
   */
  private checkAuthState(): void {
    if (!this.navBarAction) return;

    const { mode, storageKey, storageType } = this.navBarAction.auth;

    if (mode === 'guest') {
      this.isAuthenticated = false;
    } else if (mode === 'user') {
      this.isAuthenticated = true;
    } else {
      // Auto mode: check storage
      this.isAuthenticated = this.checkStorageForAuth(storageKey ?? 'auth_token', storageType);
    }

    this.cdr.markForCheck();
  }

  /**
   * Check storage for auth token
   */
  private checkStorageForAuth(key: string, storageType?: string): boolean {
    if (!this.isBrowser) return false;

    try {
      if (storageType === 'localStorage') {
        return !!localStorage.getItem(key);
      } else if (storageType === 'cookie') {
        return document.cookie.split(';').some(c => c.trim().startsWith(`${key}=`));
      } else {
        // Default: sessionStorage
        return !!sessionStorage.getItem(key);
      }
    } catch {
      return false;
    }
  }

  /**
   * Handle brand click
   */
  onBrandClick(event: Event): void {
    const out = OutputObject.ok({
      id: this.navBarAction.id,
      type: 'navbar-action',
      action: 'brand-click',
      data: {
        brandId: this.navBarAction.brand.id,
        href: this.navBarAction.brand.href,
        name: this.navBarAction.brand.name,
      },
    });
    this.output.emit(out);
  }

  /**
   * Handle back button click
   */
  onBackClick(): void {
    const out = OutputObject.ok({
      id: this.navBarAction.id,
      type: 'navbar-action',
      action: 'back-click',
      data: {
        backButtonId: this.navBarAction.backButton?.id,
      },
    });
    this.output.emit(out);
  }

  /**
   * Handle sidebar toggle click
   */
  onSidebarToggle(): void {
    const out = OutputObject.ok({
      id: this.navBarAction.id,
      type: 'navbar-action',
      action: 'sidebar-toggle',
      data: {
        sidebarId: this.navBarAction.sidebarId,
      },
    });
    this.output.emit(out);
  }

  /**
   * Handle link bar output
   */
  onLinkBarOutput(innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.navBarAction.id,
      type: 'navbar-action',
      action: innerOut.action || 'link-click',
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...innerOut.data,
        source: 'linkBar',
      },
    });
    this.output.emit(out);
  }

  /**
   * Handle guest actions output
   */
  onGuestActionsOutput(innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.navBarAction.id,
      type: 'navbar-action',
      action: innerOut.action || 'guest-action',
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...innerOut.data,
        source: 'guestActions',
        isAuthenticated: false,
      },
    });
    this.output.emit(out);
  }

  /**
   * Handle user actions output
   */
  onUserActionsOutput(innerOut: OutputObject): void {
    const out = new OutputObject({
      id: this.navBarAction.id,
      type: 'navbar-action',
      action: innerOut.action || 'user-action',
      error: innerOut.error,
      errorMessage: innerOut.errorMessage,
      data: {
        ...innerOut.data,
        source: 'userActions',
        isAuthenticated: true,
      },
    });
    this.output.emit(out);
  }

  /**
   * Get brand image URL
   */
  getBrandImageUrl(): string {
    return this.navBarAction.brand?.logo?.imageUrl ?? '';
  }

  /**
   * Get brand alt text
   */
  getBrandAlt(): string {
    return this.navBarAction.brand?.logo?.alt ?? this.navBarAction.brand?.name ?? 'Brand';
  }

  /**
   * Get brand width
   */
  getBrandWidth(): number | string | undefined {
    return this.navBarAction.brand?.logo?.width;
  }

  /**
   * Get brand height
   */
  getBrandHeight(): number | string | undefined {
    return this.navBarAction.brand?.logo?.height;
  }
}
