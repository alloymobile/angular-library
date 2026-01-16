// src/lib/components/tissue/td-form/td-form.ts

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormObject, FieldState, validateField } from './td-form.model';
import { TdInputComponent } from '../../cell/td-input/td-input';
import { TdButtonSubmitComponent } from '../../cell/td-button-submit/td-button-submit';
import { OutputObject } from '../../../utils/id-helper';
import { InputObject } from '../../cell/td-input/td-input.model';

/**
 * TdFormComponent
 * 
 * Renders a form with multiple input fields and a submit button.
 * Handles validation, state management, and emits OutputObject on submit.
 */
@Component({
  selector: 'td-form',
  standalone: true,
  imports: [CommonModule, TdInputComponent, TdButtonSubmitComponent],
  templateUrl: './td-form.html',
  styleUrls: ['./td-form.css']
})
export class TdFormComponent implements OnInit, OnChanges {
  /**
   * Input: FormObject instance (required)
   */
  @Input() form!: FormObject;

  /**
   * Output: Emits when form is submitted or field changes
   */
  @Output() output = new EventEmitter<any>();

  @ViewChild('submitBtn') submitBtn!: TdButtonSubmitComponent;

  // Field state map
  fieldState: Record<string, FieldState> = {};

  ngOnInit(): void {
    this.validateInput();
    this.initFieldState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.validateInput();
      this.initFieldState();
    }
  }

  private validateInput(): void {
    if (!this.form || !(this.form instanceof FormObject)) {
      throw new Error('TdFormComponent requires `form` prop (FormObject instance).');
    }
  }

  /**
   * Initialize field state from form fields
   */
  private initFieldState(): void {
    const init: Record<string, FieldState> = {};

    // Gather initial values for matchWith validation
    const initialValues: Record<string, any> = {};
    this.form.fields.forEach(fld => {
      initialValues[fld.name] = fld.value;
    });

    // Initialize each field's state
    this.form.fields.forEach(fld => {
      const val = fld.value;
      const { valid, error, errors } = validateField(fld, val, initialValues);
      init[fld.name] = { value: val, valid, error, errors };
    });

    this.fieldState = init;
  }

  /**
   * Recompute validity for all fields
   */
  private recomputeAllValidity(): void {
    const valuesMap: Record<string, any> = {};
    Object.keys(this.fieldState).forEach(fname => {
      valuesMap[fname] = this.fieldState[fname].value;
    });

    const nextState: Record<string, FieldState> = {};
    this.form.fields.forEach(fld => {
      const currentVal = valuesMap[fld.name];
      const { valid, error, errors } = validateField(fld, currentVal, valuesMap);
      nextState[fld.name] = { value: currentVal, valid, error, errors };
    });

    this.fieldState = nextState;
  }

  /**
   * Handle field output from TdInput
   */
  onFieldOutput(out: any): void {
    const payload = out instanceof OutputObject ? out.data || {} : out || {};
    const { name, value } = payload;
    if (!name) return;

    // Update field state
    this.fieldState = {
      ...this.fieldState,
      [name]: {
        ...(this.fieldState[name] || { value: undefined, valid: true, error: false, errors: [] }),
        value
      }
    };

    // Recompute all field validity (for matchWith etc.)
    this.recomputeAllValidity();

    // Propagate the field change event upwards
    this.output.emit(out);
  }

  /**
   * Check if any field is invalid
   */
  get isAnyInvalid(): boolean {
    return Object.values(this.fieldState).some(f => f.error || !f.valid);
  }

  /**
   * Get computed disabled state for submit button
   */
  get isSubmitDisabled(): boolean {
    return this.isAnyInvalid || !!this.form.submit.loading;
  }

  /**
   * Handle submit button click
   */
  onSubmit(btnOut: any): void {
    // Check if any field is invalid
    let hasError = false;
    Object.values(this.fieldState).forEach(state => {
      if (state.error || !state.valid) {
        hasError = true;
      }
    });

    // Build final values
    const finalValues: Record<string, any> = {};
    Object.keys(this.fieldState).forEach(fname => {
      finalValues[fname] = this.fieldState[fname].value;
    });

    // Update form data
    this.form.data = finalValues;
    this.form.message = '';

    // Determine output data
    const dataForOutput = hasError ? { ...this.fieldState } : finalValues;

    const out = OutputObject.ok({
      id: this.form.id,
      type: 'form',
      action: 'submit',
      data: dataForOutput,
      error: hasError
    });

    if (hasError) {
      out.error = true;
    }

    this.output.emit(out);
  }

  /**
   * Track by function for ngFor
   */
  trackByFn(index: number, item: InputObject): string {
    return item?.id ?? index.toString();
  }
}
