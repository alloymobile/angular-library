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
  ButtonBarObject,
  ButtonBarItem,
  ButtonObject,
  ButtonIconObject,
  ButtonDropDownObject,
  LinkObject
} from './td-button-bar.model';
import { OutputObject } from '../../share';

@Component({
  selector: 'td-button-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './td-button-bar.html',
  styleUrls: ['./td-button-bar.css']
})
export class TdButtonBar implements OnChanges {
  @Input({ required: true }) buttonBar!: ButtonBarObject;
  @Output() output = new EventEmitter<OutputObject>();

  selectedId: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buttonBar']) {
      // Reset selection when buttonBar changes
      this.selectedId = '';
    }
  }

  /**
   * Handle button click
   */
  onButtonClick(button: ButtonObject | ButtonIconObject, event: Event): void {
    event.preventDefault();

    // Update selection
    this.selectedId = button.id;

    // Emit output
    const out = OutputObject.ok({
      id: button.id,
      type: 'button',
      action: 'click',
      data: {
        id: button.id,
        name: button.name,
        event: 'click',
        button: {
          id: button.id,
          name: button.name,
          ariaLabel: button.ariaLabel,
          title: button.title,
        },
      },
    });

    this.output.emit(out);
  }

  /**
   * Handle dropdown item click
   */
  onDropdownItemClick(dropdown: ButtonDropDownObject, link: LinkObject, event: Event): void {
    event.preventDefault();

    const out = OutputObject.ok({
      id: dropdown.id,
      type: 'dropdown',
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
   * Check if a button is selected
   */
  isSelected(button: ButtonBarItem): boolean {
    return button.id === this.selectedId;
  }

  /**
   * Get button CSS classes with active state
   */
  getButtonClasses(button: ButtonObject | ButtonIconObject): string {
    const baseClasses = button.className;
    const activeClass = this.isSelected(button) ? this.buttonBar.selected : '';
    return [baseClasses, activeClass].filter(Boolean).join(' ');
  }

  /**
   * Type guard for ButtonObject
   */
  isButtonObject(item: ButtonBarItem): item is ButtonObject {
    return item instanceof ButtonObject;
  }

  /**
   * Type guard for ButtonIconObject
   */
  isButtonIconObject(item: ButtonBarItem): item is ButtonIconObject {
    return item instanceof ButtonIconObject;
  }

  /**
   * Type guard for ButtonDropDownObject
   */
  isButtonDropDownObject(item: ButtonBarItem): item is ButtonDropDownObject {
    return item instanceof ButtonDropDownObject;
  }

  /**
   * Track by function for buttons
   */
  trackByButton(index: number, item: ButtonBarItem): string {
    return item.id;
  }

  /**
   * Track by function for dropdown links
   */
  trackByLink(index: number, item: LinkObject): string {
    return item.id;
  }
}
