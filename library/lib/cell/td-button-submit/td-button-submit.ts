import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { TdButtonSubmitModel } from './td-button-submit.model';
import { TdIcon } from '../td-icon/td-icon';
import { TdIconModel } from '../td-icon/td-icon.model';
import { generateId } from '../../share/id-helper';
import { OutputObject } from '../../share/output-object';

@Component({
  selector: 'td-button-submit',
  standalone: true,
  imports: [TdIcon],
  templateUrl: './td-button-submit.html',
  styleUrl: './td-button-submit.css',
})
export class TdButtonSubmit implements OnInit, OnChanges {
  @Input({ required: true }) buttonSubmit!: TdButtonSubmitModel;
  @Output() output = new EventEmitter<OutputObject>();

  domId = '';
  cssClass = '';

  // KISS internal state: arms immediately on click
  private armed = false;

  // derived state
  isLoading = false;
  isDisabled = false;

  // icon shown only while loading
  loadingIcon!: TdIconModel;

  ngOnInit(): void {
    this.ensureButtonSubmit();
    this.applyButtonSubmit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buttonSubmit']) {
      this.ensureButtonSubmit();

      // parent can release by setting loading=false
      if (!this.buttonSubmit.loading) {
        this.armed = false;
      }

      this.applyButtonSubmit();
    }
  }

  onClick(): void {
    if (this.isDisabled) return;

    // arm immediately => instant UI feedback
    this.armed = true;
    this.applyButtonSubmit();

    this.output.emit(
      OutputObject.ok({
        id: this.domId,
        type: 'button-submit',
        action: 'click',
        data: { name: this.buttonSubmit.name },
      })
    );
  }

  private ensureButtonSubmit(): void {
    if (!this.buttonSubmit || !(this.buttonSubmit instanceof TdButtonSubmitModel)) {
      throw new Error('TdButtonSubmit requires `buttonSubmit` (TdButtonSubmitModel instance).');
    }
  }

  private applyButtonSubmit(): void {
    // id handling (also writes back to model for stability)
    const incomingId = this.buttonSubmit.id?.trim();

    if (incomingId) {
      this.domId = incomingId;
      this.buttonSubmit.id = incomingId;
    } else {
      const next = generateId('btn-submit');
      this.domId = next;
      this.buttonSubmit.id = next;
    }

    // loading/disabled
    this.isLoading = this.armed || !!this.buttonSubmit.loading;
    this.isDisabled = !!this.buttonSubmit.disabled || this.isLoading;

    // class handling (parent-driven active)
    this.cssClass = [
      this.buttonSubmit.className || 'btn btn-primary',
      this.buttonSubmit.isActive ? this.buttonSubmit.active : '',
    ]
      .filter(Boolean)
      .join(' ');

    // icon handling (only used while loading)
    this.loadingIcon = this.buildLoadingIcon();
  }

  private buildLoadingIcon(): TdIconModel {
    const base = this.buttonSubmit.icon;

    // default spinner
    if (!base) {
      return new TdIconModel({ iconClass: 'fa-solid fa-spinner fa-spin' });
    }

    const iconClass = base.iconClass || '';
    const hasSpin = /\bfa-spin\b/.test(iconClass) || /\bfa-pulse\b/.test(iconClass);
    const nextClass = hasSpin ? iconClass : `${iconClass} fa-spin`;

    return new TdIconModel({
      id: base.id,
      iconClass: nextClass,
      className: base.className,
    });
  }
}
