import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  LinkBarObject,
  LinkBarItem,
  LinkObject,
  LinkIconObject,
  LinkLogoObject
} from './td-link-bar.model';
import { OutputObject } from '../../share';

@Component({
  selector: 'td-link-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-link-bar.html',
  styleUrls: ['./td-link-bar.css']
})
export class TdLinkBar implements OnChanges {
  @Input({ required: true }) linkBar!: LinkBarObject;
  @Output() output = new EventEmitter<OutputObject>();

  selectedId: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkBar']) {
      // Reset selection when linkBar changes
      this.selectedId = '';
    }
  }

  /**
   * Handle link click
   */
  onLinkClick(link: LinkBarItem, event: Event): void {
    // Don't prevent default for actual navigation
    // event.preventDefault();

    // Update selection
    this.selectedId = link.id;

    // Emit output
    const out = OutputObject.ok({
      id: link.id,
      type: 'link',
      action: 'click',
      data: {
        id: link.id,
        name: link.name,
        href: link.href,
        link: {
          id: link.id,
          name: link.name,
          href: link.href,
        },
      },
    });

    this.output.emit(out);
  }

  /**
   * Check if a link is selected
   */
  isSelected(link: LinkBarItem): boolean {
    return link.id === this.selectedId;
  }

  /**
   * Get link CSS classes with active state
   */
  getLinkClasses(link: LinkBarItem): string {
    const baseClasses = link.className;
    const activeClass = this.isSelected(link) ? this.linkBar.selected : '';
    return [baseClasses, activeClass].filter(Boolean).join(' ');
  }

  /**
   * Type guard for LinkObject
   */
  isLinkObject(item: LinkBarItem): item is LinkObject {
    return item instanceof LinkObject && !(item instanceof LinkIconObject) && !(item instanceof LinkLogoObject);
  }

  /**
   * Type guard for LinkIconObject
   */
  isLinkIconObject(item: LinkBarItem): item is LinkIconObject {
    return item instanceof LinkIconObject;
  }

  /**
   * Type guard for LinkLogoObject
   */
  isLinkLogoObject(item: LinkBarItem): item is LinkLogoObject {
    return item instanceof LinkLogoObject;
  }

  /**
   * Track by function for links
   */
  trackByLink(index: number, item: LinkBarItem): string {
    return item.id;
  }
}
