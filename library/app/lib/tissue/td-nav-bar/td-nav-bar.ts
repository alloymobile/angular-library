import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarObject } from './td-nav-bar.model';
import { OutputObject } from '../../share';
import { TdLinkBar } from '../td-link-bar/td-link-bar';

@Component({
  selector: 'td-nav-bar',
  standalone: true,
  imports: [CommonModule, TdLinkBar],
  templateUrl: './td-nav-bar.html',
  styleUrls: ['./td-nav-bar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdNavBar {
  @Input({ required: true }) navBar!: NavBarObject;
  @Output() output = new EventEmitter<OutputObject>();

  /**
   * Handle logo click
   */
  onLogoClick(event: Event): void {
    const out = OutputObject.ok({
      id: this.navBar.id,
      type: 'navbar',
      action: 'logo-click',
      data: {
        logoId: this.navBar.logo.id,
        href: this.navBar.logo.href,
        name: this.navBar.logo.name,
      },
    });
    this.output.emit(out);
  }

  /**
   * Handle link bar output
   */
  onLinkBarOutput(innerOut: OutputObject): void {
    // Forward with navbar context
    const out = new OutputObject({
      id: this.navBar.id,
      type: 'navbar',
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
   * Get logo image URL
   */
  getLogoImageUrl(): string {
    return this.navBar.logo?.logo?.imageUrl ?? '';
  }

  /**
   * Get logo alt text
   */
  getLogoAlt(): string {
    return this.navBar.logo?.logo?.alt ?? this.navBar.logo?.name ?? 'Logo';
  }

  /**
   * Get logo width
   */
  getLogoWidth(): number | string | undefined {
    return this.navBar.logo?.logo?.width;
  }

  /**
   * Get logo height
   */
  getLogoHeight(): number | string | undefined {
    return this.navBar.logo?.logo?.height;
  }
}
