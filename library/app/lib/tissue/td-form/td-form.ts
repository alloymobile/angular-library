// src/app/lib/tissue/td-form/td-form.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdFormModel } from './td-form.model';
import { TdInput } from '../../cell/td-input/td-input';
import { TdInputModel } from '../../cell/td-input/td-input.model';

import { TdButtonSubmit } from '../../cell/td-button-submit/td-button-submit';
import { TdButtonSubmitModel } from '../../cell/td-button-submit/td-button-submit.model';

import { OutputObject } from '../../share/output-object';

type FileUploaderFn = (fieldName: string, file: File, context?: any) => Promise<string>;

type FieldState = {
  value: any;
  valid: boolean;
  error: boolean;
  errors: string[];
};

@Component({
  selector: 'td-form',
  standalone: true,
  imports: [CommonModule, TdInput, TdButtonSubmit],
  templateUrl: './td-form.html',
  styleUrls: ['./td-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TdForm implements OnChanges {
  @Input({ required: true }) form!: TdFormModel | string | any;
  @Output() output = new EventEmitter<OutputObject>();
  @Input() fileUploader?: FileUploaderFn;

  model: TdFormModel = new TdFormModel({ title: '', fields: [] });

  // per-field state by name
  fieldState: Record<string, FieldState> = {};

  // ---------- lifecycle ----------

  ngOnChanges(changes: SimpleChanges): void {
    if ('form' in changes) {
      this.model = this.normalizeForm(this.form);
      this.initFieldState();
      this.syncSubmitDisabled(); // initial state
    }
  }

  private normalizeForm(raw: any): TdFormModel {
    if (raw instanceof TdFormModel) return raw;

    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return new TdFormModel(parsed);
      } catch {
        return new TdFormModel({
          title: 'Invalid form JSON',
          message: 'Could not parse form JSON.',
          fields: [],
          submit: { name: 'Submit', disabled: true, loading: false },
        });
      }
    }

    return new TdFormModel(raw || {});
  }

  // ---------- init state ----------

  private initFieldState(): void {
    const init: Record<string, FieldState> = {};

    const initialValues: Record<string, any> = {};
    this.model.fields.forEach((fld) => {
      initialValues[fld.name] = fld.value;
    });

    this.model.fields.forEach((fld) => {
      const v = fld.value;
      const { valid, error, errors } = this.validateField(fld, v, initialValues);
      init[fld.name] = { value: v, valid, error, errors };
    });

    this.fieldState = init;

    // snapshot like React
    this.model.data = this.flatValues();
  }

  // ---------- validation (matches React validateField) ----------

  private validateField(fieldDef: TdInputModel, value: any, allValues: Record<string, any>) {
    let isValid = true;
    const errs: string[] = [];

    // required
    if (fieldDef.required) {
      if (fieldDef.type === 'checkbox' || fieldDef.type === 'multiselect') {
        const arrVal = Array.isArray(value) ? value : [];
        if (arrVal.length === 0) {
          isValid = false;
          errs.push('This field is required.');
        }
      } else if (fieldDef.type === 'switch') {
        // switch: required means it must be true
        if (value !== true) {
          isValid = false;
          errs.push('This field is required.');
        }
      } else {
        const empty = value === '' || value === false || value === undefined || value === null;
        if (empty) {
          isValid = false;
          errs.push('This field is required.');
        }
      }
    }

    // minLength
    if (
      isValid &&
      typeof (fieldDef as any).minLength === 'number' &&
      typeof value === 'string' &&
      value.length < (fieldDef as any).minLength
    ) {
      isValid = false;
      errs.push(`Minimum length is ${(fieldDef as any).minLength}`);
    }

    // maxLength
    if (
      isValid &&
      typeof (fieldDef as any).maxLength === 'number' &&
      typeof value === 'string' &&
      value.length > (fieldDef as any).maxLength
    ) {
      isValid = false;
      errs.push(`Maximum length is ${(fieldDef as any).maxLength}`);
    }

    // pattern
    if (isValid && (fieldDef as any).pattern && typeof value === 'string') {
      try {
        const re = new RegExp((fieldDef as any).pattern);
        if (!re.test(value)) {
          isValid = false;
          errs.push('Invalid format.');
        }
      } catch {
        isValid = false;
        errs.push('Invalid validation pattern configuration.');
      }
    }

    // passwordStrength
    if (isValid && (fieldDef as any).passwordStrength && typeof value === 'string') {
      const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;
      if (!strongRegex.test(value)) {
        isValid = false;
        errs.push('Password is too weak.');
      }
    }

    // matchWith
    if (isValid && (fieldDef as any).matchWith) {
      const otherName = (fieldDef as any).matchWith;
      const otherVal = allValues[otherName];
      if (otherVal !== value) {
        isValid = false;
        errs.push('Values do not match.');
      }
    }

    return { valid: isValid, error: !isValid, errors: errs };
  }

  private recomputeAllValidity(draft: Record<string, FieldState>): Record<string, FieldState> {
    const valuesMap: Record<string, any> = {};
    Object.keys(draft).forEach((k) => (valuesMap[k] = draft[k].value));

    const next: Record<string, FieldState> = {};
    this.model.fields.forEach((fld) => {
      const currentVal = valuesMap[fld.name];
      const { valid, error, errors } = this.validateField(fld, currentVal, valuesMap);
      next[fld.name] = { value: currentVal, valid, error, errors };
    });

    return next;
  }

  // ---------- derived ----------

  get isAnyInvalid(): boolean {
    return Object.values(this.fieldState).some((f) => f.error || !f.valid);
  }

  private flatValues(): Record<string, any> {
    const out: Record<string, any> = {};
    Object.keys(this.fieldState).forEach((k) => (out[k] = this.fieldState[k].value));
    return out;
  }

  // ---------- critical fix: OnPush-safe submit updates ----------

  private syncSubmitDisabled(): void {
    const submitAny: any = this.model.submit as any;
    const nextDisabled = this.isAnyInvalid || !!submitAny.loading;

    // Replace reference so TdButtonSubmit (OnPush) updates correctly
    if (submitAny.disabled !== nextDisabled) {
      this.model.submit = new TdButtonSubmitModel({
        ...(submitAny || {}),
        disabled: nextDisabled,
      });
    }
  }

  // ---------- child outputs (change/blur passthrough + state update) ----------

  onFieldOutput(out: OutputObject): void {
    // Always propagate child output (change/blur) upward
    this.output.emit(out);

    const payload: any = (out as any)?.data || {};
    const name = payload?.name;
    const value = payload?.value;

    if (!name) return;

    // update local state -> recompute all validity -> sync submit disabled
    const prev = this.fieldState || {};
    const draft: Record<string, FieldState> = {
      ...prev,
      [name]: {
        ...(prev[name] || { value: undefined, valid: true, error: false, errors: [] }),
        value,
      },
    };

    this.fieldState = this.recomputeAllValidity(draft);

    // keep snapshot like React
    this.model.data = this.flatValues();
    this.model.message = '';

    this.syncSubmitDisabled();
  }

  // ---------- submit handling ----------

  onSubmitOutput(btnOut: OutputObject): void {
    // We don't need to emit button output separately;
    // TdForm emits a single submit OutputObject like React.
    const any: any = btnOut as any;
    const action = any?.action;

    // accept common actions so it works with your existing TdButtonSubmit implementation
    if (action && action !== 'click' && action !== 'submit') return;

    this.handleSubmit();
  }

  private handleSubmit(): void {
    const hasError = this.isAnyInvalid;

    const finalValues = this.flatValues();
    this.model.data = finalValues;
    this.model.message = '';

    const dataForOutput = hasError ? { ...this.fieldState } : finalValues;

    const out = new OutputObject({
      id: this.model.id,
      type: 'form',
      action: 'submit',
      error: hasError,
      errorMessage: [], // keep empty; details are inside data when error=true
      data: dataForOutput,
    });

    this.output.emit(out);
  }

  // trackBy
  trackByField(_: number, f: TdInputModel): string {
    return f.id;
  }
}
