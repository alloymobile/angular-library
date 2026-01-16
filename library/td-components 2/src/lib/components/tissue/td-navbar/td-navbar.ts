// src/lib/components/tissue/td-navbar/td-navbar.ts

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarObject } from './td-navbar.model';
import { TdLinkLogoComponent } from '../../cell/td-link-logo/td-link-logo';
import { TdLinkBarComponent } from '../td-link-bar/td-link-bar';

/**
 * TdNavBarComponent
 * 
 * Renders a responsive Bootstrap-like navbar with:
 *   - brand/logo on the left (TdLinkLogo)
 *   - a collapse toggler for mobile
 *   - a collapsible area on the right (TdLinkBar)
 */
@Component({
  selector: 'td-navbar',
  standalone: true,
  imports: [CommonModule, TdLinkLogoComponent, TdLinkBarComponent],
  templateUrl: './td-navbar.html',
  styleUrls: ['./td-navbar.css']
})
export class TdNavBarComponent implements OnInit, OnChanges {
  /**
   * Input: NavBarObject instance (required)
   */
  @Input() navBar!: NavBarObject;

  // Collapse ID for mobile toggle
  collapseId = '';

  ngOnInit(): void {
    this.validateInput();
    this.collapseId = this.navBar.getCollapseId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['navBar']) {
      this.validateInput();
      this.collapseId = this.navBar.getCollapseId();
    }
  }

  private validateInput(): void {
    if (!this.navBar || !(this.navBar instanceof NavBarObject)) {
      throw new Error('TdNavBarComponent requires `navBar` prop (NavBarObject instance).');
    }
  }
}
