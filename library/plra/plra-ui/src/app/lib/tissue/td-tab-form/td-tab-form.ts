/**
 * TdTabForm - Multi-step wizard/form component
 *
 * A flexible form component that supports:
 * - Tabs layout: One step visible at a time with navigation
 * - Mixed layout: All sections on one page
 *
 * Emits OutputObject on navigation and form submission.
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TdTabFormModel, TdTabModel } from './td-tab-form.model';
import { TdInputModel } from '../../cell/td-input/td-input.model';
import { TdButtonIconModel } from '../../cell/td-button-icon/td-button-icon.model';
import { TdInput } from '../../cell/td-input/td-input';
import { TdIcon } from '../../cell/td-icon/td-icon';
import { TdButtonIcon } from '../../cell/td-button-icon/td-button-icon';
import { TdCard } from '../td-card/td-card';
import { OutputObject } from '../../share/output-object';

type TabValues = Record<string, Record<string, any>>;
type TabErrors = Record<string, Record<string, string[]>>;

@Component({
  selector: 'td-tab-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TdInput, TdIcon, TdButtonIcon, TdCard],
  templateUrl: './td-tab-form.html',
  styleUrls: ['./td-tab-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TdTabForm implements OnChanges {
  @Input({ required: true }) tabForm!: TdTabFormModel;
  @Output() output = new EventEmitter<OutputObject>();

  currentIndex = 0;
  values: TabValues = {};
  errors: TabErrors = {};

  // Default button models (used when not provided in config)
  defaultPreviousButton = new TdButtonIconModel({
    name: 'Previous',
    icon: { iconClass: 'fa-solid fa-arrow-left' },
    className: 'btn btn-outline-secondary',
  });

  defaultNextButton = new TdButtonIconModel({
    name: 'Next',
    icon: { iconClass: 'fa-solid fa-arrow-right' },
    className: 'btn btn-primary',
  });

  defaultFinishButton = new TdButtonIconModel({
    name: 'Finish',
    icon: { iconClass: 'fa-solid fa-paper-plane' },
    className: 'btn btn-primary',
  });

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabForm'] && this.tabForm) {
      this.currentIndex = this.tabForm.currentIndex;
      this.values = this.buildInitialValues();
      this.errors = {};
      this.cdr.markForCheck();
    }
  }

  /* -------------------------------------------------------
   * Getters
   * ----------------------------------------------------- */

  get tabs(): TdTabModel[] {
    return this.tabForm?.tabs || [];
  }

  get totalSteps(): number {
    return this.tabs.length;
  }

  get currentTab(): TdTabModel | null {
    return this.tabs[this.currentIndex] || null;
  }

  get currentTabKey(): string {
    return this.currentTab?.key || '';
  }

  get isMixed(): boolean {
    return this.tabForm?.layout === 'mixed';
  }

  get hasPrevious(): boolean {
    return !this.isMixed && this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return !this.isMixed && this.currentIndex < this.totalSteps - 1;
  }

  get isLast(): boolean {
    return this.isMixed || this.currentIndex === this.totalSteps - 1;
  }

  get previousButton(): TdButtonIconModel {
    return this.tabForm?.navButtons?.previous || this.defaultPreviousButton;
  }

  get nextButton(): TdButtonIconModel {
    return this.tabForm?.navButtons?.next || this.defaultNextButton;
  }

  get finishButton(): TdButtonIconModel {
    return this.tabForm?.navButtons?.finish || this.defaultFinishButton;
  }

  /* -------------------------------------------------------
   * Initialization
   * ----------------------------------------------------- */

  private buildInitialValues(): TabValues {
    const result: TabValues = {};

    this.tabForm.tabs.forEach((tab) => {
      const tabValues: Record<string, any> = {};

      tab.inputs.forEach((input) => {
        const name = input.name;
        if (!name) return;

        if (typeof input.value !== 'undefined') {
          tabValues[name] = input.value;
        } else if (input.type === 'checkbox' || input.type === 'switch') {
          tabValues[name] = false;
        } else {
          tabValues[name] = '';
        }
      });

      result[tab.key] = tabValues;
    });

    return result;
  }

  /* -------------------------------------------------------
   * Value & Error Helpers
   * ----------------------------------------------------- */

  getValue(tabKey: string, name: string, fallback: any, type: string): any {
    const tabVals = this.values[tabKey] || {};
    if (Object.prototype.hasOwnProperty.call(tabVals, name)) {
      return tabVals[name];
    }
    if (typeof fallback !== 'undefined') return fallback;
    return type === 'checkbox' || type === 'switch' ? false : '';
  }

  getFieldErrors(tabKey: string, fieldName: string): string[] {
    return this.errors[tabKey]?.[fieldName] || [];
  }

  hasFieldErrors(tabKey: string, fieldName: string): boolean {
    return this.getFieldErrors(tabKey, fieldName).length > 0;
  }

  /* -------------------------------------------------------
   * Validation
   * ----------------------------------------------------- */

  private validateTab(tab: TdTabModel, tabValues: Record<string, any>): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    tab.inputs.forEach((input) => {
      const name = input.name;
      if (!name) return;

      const messages: string[] = [];
      const value = typeof tabValues[name] !== 'undefined' ? tabValues[name] : input.value;

      // Required validation
      if (input.required) {
        if (input.type === 'checkbox' || input.type === 'switch') {
          if (!value) {
            messages.push('This field is required.');
          }
        } else {
          if (value === '' || value === null || typeof value === 'undefined') {
            messages.push('This field is required.');
          }
        }
      }

      // matchWith validation
      if (input.matchWith) {
        const otherName = input.matchWith;
        const otherVal = tabValues[otherName];
        if (value !== otherVal) {
          messages.push('Values do not match.');
        }
      }

      if (messages.length > 0) {
        errors[name] = messages;
      }
    });

    return errors;
  }

  /* -------------------------------------------------------
   * Field Output Handler
   * ----------------------------------------------------- */

  handleFieldOutput(tabKey: string, out: OutputObject): void {
    const payload = out && typeof (out as any).toJSON === 'function'
      ? (out as any).toJSON()
      : out;

    const name = payload?.data?.name;
    const nextVal = payload?.data?.value;
    const fieldErrors = payload?.data?.errors || [];

    if (!name) return;

    // Update values
    const tabVals = { ...(this.values[tabKey] || {}) };
    tabVals[name] = nextVal;
    this.values = { ...this.values, [tabKey]: tabVals };

    // Update errors
    const tabErrs = { ...(this.errors[tabKey] || {}) };
    if (fieldErrors.length > 0) {
      tabErrs[name] = fieldErrors;
    } else {
      delete tabErrs[name];
    }
    this.errors = { ...this.errors, [tabKey]: tabErrs };

    // Emit change event
    this.output.emit(out);
    this.cdr.markForCheck();
  }

  /* -------------------------------------------------------
   * Emit Helper
   * ----------------------------------------------------- */

  private emit(
    navAction: string,
    nextIndex: number,
    nextValues: TabValues,
    nextErrors: TabErrors,
    hadError: boolean
  ): void {
    const nextTab = this.tabs[nextIndex] || this.currentTab;
    const nextKey = nextTab?.key || this.currentTabKey;

    const baseData: any = {
      navAction,
      currentIndex: nextIndex,
      currentTabKey: nextKey,
      values: nextValues,
    };

    if (hadError && nextErrors && Object.keys(nextErrors).length > 0) {
      baseData.errors = nextErrors;
      baseData.message = 'Validation failed for current step.';
    }

    const out = hadError
      ? OutputObject.err(
          {
            id: this.tabForm.id,
            type: 'tab-form',
            action: navAction === 'finish' ? 'submit' : 'draft',
            data: baseData,
          },
          baseData.message || 'Validation failed'
        )
      : OutputObject.ok({
          id: this.tabForm.id,
          type: 'tab-form',
          action: navAction === 'finish' ? 'submit' : 'draft',
          data: baseData,
        });

    this.output.emit(out);
  }

  /* -------------------------------------------------------
   * Navigation Handlers
   * ----------------------------------------------------- */

  setCurrentIndex(idx: number): void {
    if (idx >= 0 && idx < this.totalSteps) {
      this.currentIndex = idx;
      this.cdr.markForCheck();
    }
  }

  handlePrevious(): void {
    if (this.isMixed) return;
    if (!this.currentTab || this.currentIndex <= 0) return;

    const nextIndex = this.currentIndex - 1;
    this.currentIndex = nextIndex;
    this.emit('previous', nextIndex, this.values, this.errors, false);
    this.cdr.markForCheck();
  }

  handleNext(): void {
    if (this.isMixed) return;
    if (!this.currentTab || this.currentIndex >= this.totalSteps - 1) return;

    if (this.currentTab.type === 'inputs') {
      const tabKey = this.currentTab.key;
      const tabVals = this.values[tabKey] || {};
      const tabErr = this.validateTab(this.currentTab, tabVals);

      if (Object.keys(tabErr).length > 0) {
        const mergedErr = { ...this.errors, [tabKey]: tabErr };
        this.errors = mergedErr;
        this.emit('next', this.currentIndex, this.values, mergedErr, true);
        this.cdr.markForCheck();
        return;
      }

      const nextIndex = this.currentIndex + 1;
      this.currentIndex = nextIndex;

      const nextErrors = { ...this.errors };
      delete nextErrors[tabKey];
      this.errors = nextErrors;
      this.emit('next', nextIndex, this.values, nextErrors, false);
      this.cdr.markForCheck();
      return;
    }

    // Non-input tabs (cards)
    const nextIndex = this.currentIndex + 1;
    this.currentIndex = nextIndex;
    this.emit('next', nextIndex, this.values, this.errors, false);
    this.cdr.markForCheck();
  }

  handleFinish(): void {
    if (!this.tabs.length) return;

    if (this.isMixed) {
      // Validate all tabs
      let nextErrors = { ...this.errors };
      let hadError = false;

      this.tabs.forEach((tab) => {
        if (tab.type !== 'inputs') return;

        const tabKey = tab.key;
        const tabVals = this.values[tabKey] || {};
        const tabErr = this.validateTab(tab, tabVals);

        if (Object.keys(tabErr).length > 0) {
          nextErrors = { ...nextErrors, [tabKey]: tabErr };
          hadError = true;
        } else if (nextErrors[tabKey]) {
          const clone = { ...nextErrors };
          delete clone[tabKey];
          nextErrors = clone;
        }
      });

      this.errors = nextErrors;
      this.emit('finish', this.currentIndex, this.values, nextErrors, hadError);
      this.cdr.markForCheck();
      return;
    }

    // Tabs layout - validate current tab only
    if (!this.currentTab) return;

    if (this.currentTab.type === 'inputs') {
      const tabKey = this.currentTab.key;
      const tabVals = this.values[tabKey] || {};
      const tabErr = this.validateTab(this.currentTab, tabVals);

      if (Object.keys(tabErr).length > 0) {
        const mergedErr = { ...this.errors, [tabKey]: tabErr };
        this.errors = mergedErr;
        this.emit('finish', this.currentIndex, this.values, mergedErr, true);
        this.cdr.markForCheck();
        return;
      }

      const nextErrors = { ...this.errors };
      delete nextErrors[tabKey];
      this.errors = nextErrors;
      this.emit('finish', this.currentIndex, this.values, nextErrors, false);
      this.cdr.markForCheck();
      return;
    }

    // Non-input tabs
    this.emit('finish', this.currentIndex, this.values, this.errors, false);
    this.cdr.markForCheck();
  }

  /* -------------------------------------------------------
   * Card Output Handler
   * ----------------------------------------------------- */

  handleCardOutput(out: OutputObject): void {
    this.output.emit(out);
  }

  /* -------------------------------------------------------
   * Input Model Factory (creates model with current value/errors)
   * ----------------------------------------------------- */

  createInputModel(tabKey: string, inputModel: TdInputModel): TdInputModel {
    const val = this.getValue(tabKey, inputModel.name, inputModel.value, inputModel.type);
    const tabErr = this.errors[tabKey] || {};
    const fieldErrors = tabErr[inputModel.name] || [];

    return new TdInputModel({
      ...inputModel,
      value: val,
    });
  }

  /* -------------------------------------------------------
   * Track By Functions
   * ----------------------------------------------------- */

  trackByTab(index: number, tab: TdTabModel): string {
    return tab.id;
  }

  trackByInput(index: number, input: TdInputModel): string {
    return input.id || input.name || String(index);
  }

  trackByCard(index: number, card: any): string {
    return card.id || String(index);
  }
}