import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FormObject, InputObject } from './td-form.model';
import { OutputObject } from '../../share';

interface FieldState {
  value: any;
  valid: boolean;
  touched: boolean;
  errors: string[];
}

@Component({
  selector: 'td-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './td-form.html',
  styleUrls: ['./td-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdForm implements OnChanges {
  @Input({ required: true }) form!: FormObject;
  @Output() output = new EventEmitter<OutputObject>();

  fieldStates: Record<string, FieldState> = {};
  formSubmitted = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form'] && this.form) {
      this.initializeFieldStates();
      this.formSubmitted = false;
    }
  }

  /**
   * Initialize field states from form fields
   */
  private initializeFieldStates(): void {
    this.fieldStates = {};
    this.form.fields.forEach(field => {
      this.fieldStates[field.name] = {
        value: field.value ?? '',
        valid: true,
        touched: false,
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

    if (field.isCheckbox()) {
      value = (target as HTMLInputElement).checked;
    }

    // Update state
    const errors = this.validateField(field, value);
    this.fieldStates[field.name] = {
      value,
      valid: errors.length === 0,
      touched: true,
      errors,
    };

    // Emit change event
    const out = new OutputObject({
      id: this.form.id,
      type: 'form',
      action: 'change',
      error: false,
      data: {
        name: field.name,
        value,
        errors,
      },
    });
    this.output.emit(out);

    this.cdr.markForCheck();
  }

  /**
   * Handle input blur (for validation feedback)
   */
  onInputBlur(field: InputObject): void {
    const state = this.fieldStates[field.name];
    if (state) {
      const errors = this.validateField(field, state.value);
      this.fieldStates[field.name] = {
        ...state,
        touched: true,
        errors,
        valid: errors.length === 0,
      };
      this.cdr.markForCheck();
    }
  }

  /**
   * Handle form submit
   */
  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.formSubmitted = true;

    // Validate all fields
    const values: Record<string, any> = {};
    const errorData: Record<string, { value: any; valid: boolean; error: boolean; errors: string[] }> = {};
    let hasError = false;

    this.form.fields.forEach(field => {
      const state = this.fieldStates[field.name];
      const value = state?.value ?? '';
      values[field.name] = value;

      const errors = this.validateField(field, value);
      const isValid = errors.length === 0;

      this.fieldStates[field.name] = {
        value,
        valid: isValid,
        touched: true,
        errors,
      };

      if (!isValid) {
        hasError = true;
        errorData[field.name] = {
          value,
          valid: false,
          error: true,
          errors,
        };
      }
    });

    if (hasError) {
      // Emit error output with detailed field errors
      const out = OutputObject.err({
        id: this.form.id,
        type: 'form',
        action: this.form.action || 'submit',
        data: errorData,
      }, 'Validation failed');
      this.output.emit(out);
    } else {
      // Emit success output with flat field values
      const out = OutputObject.ok({
        id: this.form.id,
        type: 'form',
        action: this.form.action || 'submit',
        data: values,
      });
      this.output.emit(out);
    }

    this.cdr.markForCheck();
  }

  /**
   * Validate a single field
   */
  private validateField(field: InputObject, value: any): string[] {
    const errors: string[] = [];
    const strValue = typeof value === 'string' ? value : String(value ?? '');

    // Required validation
    if (field.required) {
      if (field.isCheckbox()) {
        if (!value) {
          errors.push('This field is required.');
        }
      } else {
        const isEmpty = strValue.trim() === '';
        if (isEmpty) {
          errors.push('This field is required.');
        }
      }
    }

    // Skip other validations if empty and not required
    if (strValue.trim() === '' && !field.required) {
      return errors;
    }

    // Min length validation
    if (errors.length === 0 && field.minLength != null) {
      if (strValue.length < field.minLength) {
        errors.push(`Minimum length is ${field.minLength} characters.`);
      }
    }

    // Max length validation
    if (errors.length === 0 && field.maxLength != null) {
      if (strValue.length > field.maxLength) {
        errors.push(`Maximum length is ${field.maxLength} characters.`);
      }
    }

    // Pattern validation
    if (errors.length === 0 && field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(strValue)) {
        errors.push('Invalid format.');
      }
    }

    // Password strength validation
    if (errors.length === 0 && field.passwordStrength) {
      const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
      if (!strongRegex.test(strValue)) {
        errors.push('Password must be at least 8 characters with uppercase, lowercase, and a number.');
      }
    }

    // Match with validation
    if (errors.length === 0 && field.matchWith) {
      const otherValue = this.fieldStates[field.matchWith]?.value;
      if (otherValue !== value) {
        errors.push('Values do not match.');
      }
    }

    // Min/Max number validation
    if (errors.length === 0 && field.type === 'number') {
      const numValue = parseFloat(strValue);
      if (!isNaN(numValue)) {
        if (field.min != null && numValue < field.min) {
          errors.push(`Minimum value is ${field.min}.`);
        }
        if (field.max != null && numValue > field.max) {
          errors.push(`Maximum value is ${field.max}.`);
        }
      }
    }

    return errors;
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
   * Check if field has errors (and should show them)
   */
  hasFieldErrors(field: InputObject): boolean {
    const state = this.fieldStates[field.name];
    if (!state) return false;
    return (state.touched || this.formSubmitted) && state.errors.length > 0;
  }

  /**
   * Get submit button classes
   */
  getSubmitClasses(): string {
    return this.form.submit.getCombinedClasses();
  }

  /**
   * Check if submit button should be disabled
   */
  isSubmitDisabled(): boolean {
    return this.form.submit.disabled || this.form.submit.loading;
  }

  /**
   * Get submit button text
   */
  getSubmitText(): string {
    return this.form.submit.loading ? this.form.submit.loadingText : this.form.submit.name;
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
