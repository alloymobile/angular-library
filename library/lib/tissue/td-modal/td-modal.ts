import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { TdModalModel } from './td-modal.model';
import { TdInputModel } from '../../cell/td-input/td-input.model';
import { TdInput } from '../../cell/td-input/td-input';
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
  imports: [CommonModule, TdInput],
  templateUrl: './td-modal.html',
  styleUrls: ['./td-modal.css'],
})
export class TdModal implements OnChanges {
  @Input({ required: true }) modal!: TdModalModel;
  @Output() output = new EventEmitter<OutputObject>();

  fieldStates: Record<string, FieldState> = {};
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['modal'] && this.modal) {
      this.initializeFieldStates();
    }
  }

  private initializeFieldStates(): void {
    this.fieldStates = {};

    const fields = Array.isArray(this.modal.fields) ? this.modal.fields : [];
    const data = (this.modal.data && typeof this.modal.data === 'object') ? this.modal.data : {};

    fields.forEach((field) => {
      const value = (data as any)[field.name] ?? field.value ?? this.getEmptyValue(field);

      this.fieldStates[field.name] = {
        value,
        valid: true,
        error: false,
        errors: [],
      };
    });

    // keep modal.data in sync baseline
    this.modal.data = { ...data };
    fields.forEach((field) => {
      if (!(field.name in this.modal.data)) {
        this.modal.data[field.name] = this.fieldStates[field.name].value;
      }
    });
  }

  /**
   * Receive output from td-input and sync:
   * - fieldStates[field.name].value
   * - modal.data[field.name]
   * Then emit a modal-level change output.
   */
  onFieldOutput(field: TdInputModel, innerOut: OutputObject): void {
    const base =
      innerOut && typeof (innerOut as any).toJSON === 'function'
        ? (innerOut as any).toJSON()
        : innerOut || {};

    const data = base.data && typeof base.data === 'object' ? base.data : {};

    const name =
      typeof (data as any).name === 'string' && (data as any).name.trim()
        ? (data as any).name.trim()
        : field.name;

    const value = (data as any).value;

    if (!name) return;

    const prev = this.fieldStates[name] || {
      value: this.getEmptyValue(field),
      valid: true,
      error: false,
      errors: [],
    };

    this.fieldStates[name] = {
      ...prev,
      value,
      valid: true,
      error: false,
      errors: [],
    };

    this.modal.data = { ...(this.modal.data || {}), [name]: value };

    const out = new OutputObject({
      id: this.modal.id,
      type: 'modal',
      action: 'change',
      error: false,
      errorMessage: [],
      data: {
        name,
        value,
        source: 'td-input',
      },
    });

    this.output.emit(out);
  }

  onSubmit(): void {
    const values: Record<string, any> = {};
    const errors: Record<string, string[]> = {};
    let hasError = false;

    const fields = Array.isArray(this.modal.fields) ? this.modal.fields : [];

    fields.forEach((field) => {
      const state = this.fieldStates[field.name];
      const value = state?.value ?? this.modal.data?.[field.name] ?? this.getEmptyValue(field);

      values[field.name] = value;

      const fieldErrors = this.validateField(field, value);

      if (fieldErrors.length > 0) {
        hasError = true;
        errors[field.name] = fieldErrors;

        this.fieldStates[field.name] = {
          ...(state || { value }),
          valid: false,
          error: true,
          errors: fieldErrors,
        };
      } else {
        this.fieldStates[field.name] = {
          ...(state || { value }),
          valid: true,
          error: false,
          errors: [],
        };
      }
    });

    if (hasError) {
      const out = OutputObject.err(
        {
          id: this.modal.id,
          type: 'modal',
          action: 'submit',
          data: {
            ...values,
            errors,
          },
        },
        'Validation failed'
      );

      this.output.emit(out);
      return;
    }

    // success
    this.modal.data = { ...(this.modal.data || {}), ...values };

    const out = OutputObject.ok({
      id: this.modal.id,
      type: 'modal',
      action: 'submit',
      data: values,
    });

    this.output.emit(out);
    this.dismissModal();
  }

  private validateField(field: TdInputModel, value: any): string[] {
    const errors: string[] = [];

    // Required
    if (field.required) {
      if (field.type === 'checkbox' || field.type === 'switch') {
        if (!value) errors.push('This field is required.');
      } else if (field.type === 'multiselect') {
        if (!Array.isArray(value) || value.length === 0) errors.push('This field is required.');
      } else if (field.type === 'file') {
        if (field.multiple) {
          if (!Array.isArray(value) || value.length === 0) errors.push('This field is required.');
        } else {
          if (!value) errors.push('This field is required.');
        }
      } else {
        const isEmpty = value === '' || value === null || value === undefined;
        if (isEmpty) errors.push('This field is required.');
      }
    }

    // Length
    if (errors.length === 0 && typeof value === 'string') {
      if (typeof field.minLength === 'number' && value.length < field.minLength) {
        errors.push(`Minimum length is ${field.minLength}.`);
      }
      if (typeof field.maxLength === 'number' && value.length > field.maxLength) {
        errors.push(`Maximum length is ${field.maxLength}.`);
      }
    }

    // Pattern
    if (errors.length === 0 && field.pattern && typeof value === 'string') {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) errors.push('Invalid format.');
    }

    // Password strength
    if (errors.length === 0 && field.passwordStrength && typeof value === 'string') {
      const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
      if (!strongRegex.test(value)) errors.push('Password is too weak.');
    }

    // MatchWith
    if (errors.length === 0 && field.matchWith) {
      const other = this.fieldStates[field.matchWith]?.value ?? this.modal.data?.[field.matchWith];
      if (other !== value) errors.push('Values do not match.');
    }

    // Custom validators from model
    if (errors.length === 0 && Array.isArray(field.validators) && field.validators.length > 0) {
      for (const v of field.validators) {
        const msg = v(value);
        if (typeof msg === 'string' && msg.trim()) errors.push(msg);
      }
    }

    return errors;
  }

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
    if (dismissBtn) dismissBtn.click();
  }

  hasFieldErrors(field: TdInputModel): boolean {
    return (this.fieldStates[field.name]?.errors?.length ?? 0) > 0;
  }

  getFieldErrors(field: TdInputModel): string[] {
    return this.fieldStates[field.name]?.errors ?? [];
  }

  trackByField(index: number, field: TdInputModel): string {
    return field.id || field.name || String(index);
  }

  private getEmptyValue(field: TdInputModel): any {
    if (field.type === 'checkbox') return false;
    if (field.type === 'switch') return false;
    if (field.type === 'multiselect') return [];
    if (field.type === 'file') return field.multiple ? [] : null;
    return '';
  }
}
