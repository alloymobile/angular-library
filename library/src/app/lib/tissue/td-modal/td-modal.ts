import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalObject, InputObject } from './td-modal.model';
import { OutputObject } from '../../share';

declare var bootstrap: any;

interface FieldState {
  value: any;
  valid: boolean;
  error: boolean;
  errors: string[];
}

@Component({
  selector: 'td-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './td-modal.html',
  styleUrls: ['./td-modal.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdModal implements OnChanges {
  @Input({ required: true }) modal!: ModalObject;
  @Output() output = new EventEmitter<OutputObject>();

  fieldStates: Record<string, FieldState> = {};
  private isBrowser: boolean;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal'] && this.modal) {
      this.initializeFieldStates();
    }
  }

  /**
   * Initialize field states from modal data
   */
  private initializeFieldStates(): void {
    this.fieldStates = {};
    this.modal.fields.forEach(field => {
      const value = this.modal.data[field.name] ?? field.value ?? '';
      this.fieldStates[field.name] = {
        value,
        valid: true,
        error: false,
        errors: [],
      };
    });
  }

  /**
   * Handle input value change
   */
  onInputChange(field: InputObject, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    let value: any = target.value;

    // Handle checkbox
    if (field.isCheckbox()) {
      value = (target as HTMLInputElement).checked;
    }

    // Update state
    this.fieldStates[field.name] = {
      ...this.fieldStates[field.name],
      value,
    };

    // Emit change event
    const out = new OutputObject({
      id: this.modal.id,
      type: 'modal',
      action: 'change',
      error: false,
      data: {
        name: field.name,
        value,
        errors: [],
      },
    });
    this.output.emit(out);

    this.cdr.markForCheck();
  }

  /**
   * Handle form submit
   */
  onSubmit(): void {
    // Collect all values
    const values: Record<string, any> = {};
    const errors: Record<string, string[]> = {};
    let hasError = false;

    this.modal.fields.forEach(field => {
      const state = this.fieldStates[field.name];
      values[field.name] = state?.value ?? '';

      // Validate
      const fieldErrors = this.validateField(field, state?.value ?? '');
      if (fieldErrors.length > 0) {
        hasError = true;
        errors[field.name] = fieldErrors;
        this.fieldStates[field.name] = {
          ...state,
          error: true,
          errors: fieldErrors,
        };
      }
    });

    if (hasError) {
      // Emit error output
      const out = OutputObject.err({
        id: this.modal.id,
        type: 'modal',
        action: 'submit',
        data: {
          ...values,
          errors,
        },
      }, 'Validation failed');
      this.output.emit(out);
    } else {
      // Emit success output
      const out = OutputObject.ok({
        id: this.modal.id,
        type: 'modal',
        action: 'submit',
        data: values,
      });
      this.output.emit(out);

      // Auto-dismiss modal
      this.dismissModal();
    }

    this.cdr.markForCheck();
  }

  /**
   * Validate a single field
   */
  private validateField(field: InputObject, value: any): string[] {
    const errors: string[] = [];

    // Required validation
    if (field.required) {
      if (field.isCheckbox()) {
        if (!value) {
          errors.push('This field is required.');
        }
      } else {
        const isEmpty = value === '' || value === null || value === undefined;
        if (isEmpty) {
          errors.push('This field is required.');
        }
      }
    }

    // Min length validation
    if (errors.length === 0 && field.minLength != null && typeof value === 'string') {
      if (value.length < field.minLength) {
        errors.push(`Minimum length is ${field.minLength}.`);
      }
    }

    // Max length validation
    if (errors.length === 0 && field.maxLength != null && typeof value === 'string') {
      if (value.length > field.maxLength) {
        errors.push(`Maximum length is ${field.maxLength}.`);
      }
    }

    // Pattern validation
    if (errors.length === 0 && field.pattern && typeof value === 'string') {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        errors.push('Invalid format.');
      }
    }

    // Password strength validation
    if (errors.length === 0 && field.passwordStrength && typeof value === 'string') {
      const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
      if (!strongRegex.test(value)) {
        errors.push('Password is too weak.');
      }
    }

    // Match with validation
    if (errors.length === 0 && field.matchWith) {
      const otherValue = this.fieldStates[field.matchWith]?.value;
      if (otherValue !== value) {
        errors.push('Values do not match.');
      }
    }

    return errors;
  }

  /**
   * Dismiss the modal
   */
  private dismissModal(): void {
    if (!this.isBrowser) return;

    const modalEl = document.getElementById(this.modal.id);
    if (!modalEl) return;

    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const instance = bootstrap.Modal.getOrCreateInstance(modalEl);
      if (instance) {
        instance.hide();
        return;
      }
    }

    const dismissBtn = modalEl.querySelector('[data-bs-dismiss="modal"]') as HTMLElement;
    if (dismissBtn) {
      dismissBtn.click();
    }
  }

  /**
   * Get field value
   */
  getFieldValue(field: InputObject): any {
    return this.fieldStates[field.name]?.value ?? '';
  }

  /**
   * Get field errors
   */
  getFieldErrors(field: InputObject): string[] {
    return this.fieldStates[field.name]?.errors ?? [];
  }

  /**
   * Check if field has errors
   */
  hasFieldErrors(field: InputObject): boolean {
    return this.getFieldErrors(field).length > 0;
  }

  /**
   * Get button classes
   */
  getButtonClasses(): string {
    return this.modal.submit.getCombinedClasses();
  }

  /**
   * Track by function for fields
   */
  trackByField(index: number, field: InputObject): string {
    return field.id;
  }

  /**
   * Track by function for options
   */
  trackByOption(index: number, option: { value: string; label: string }): string {
    return option.value;
  }
}
