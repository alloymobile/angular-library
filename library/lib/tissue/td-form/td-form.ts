// td-form/td-form.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TdFormModel } from './td-form.model';
import { TdInput } from '../../cell/td-input/td-input';
import { TdInputModel } from '../../cell/td-input/td-input.model';
import { TdButtonSubmit } from '../../cell/td-button-submit/td-button-submit';
import { OutputObject } from '../../share/output-object';
import { generateId } from '../../share/id-helper';

@Component({
  selector: 'td-form',
  standalone: true,
  imports: [CommonModule, TdInput, TdButtonSubmit],
  templateUrl: './td-form.html',
  styleUrl: './td-form.css',
})
export class TdForm implements OnChanges {
  @Input({ required: true }) form!: TdFormModel;
  @Output() output = new EventEmitter<OutputObject>();

  private values: Record<string, unknown> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.ensureForm();
      this.applyForm();
    }
  }

  onInputOutput(out: OutputObject): void {
    const data: any = (out as any).data ?? {};
    const name: string = data?.name ?? '';
    if (name) {
      const value = data?.value;
      this.values[name] = value;

      const input = this.findInputByName(name);
      if (input) {
        (input as any).value = value;
      }
    }

    this.output.emit(out);
  }

  onSubmitOutput(out: OutputObject): void {
    if ((out as any)?.action === 'click') {
      this.emitSubmit();
    }
  }

  onNativeSubmit(event: Event): void {
    event.preventDefault();
    this.emitSubmit();
  }

  trackByInput(index: number, input: TdInputModel): string {
    return input.id ?? `${index}-${input.name}`;
  }

  private emitSubmit(): void {
    this.ensureForm();
    this.ensureFormId();

    const data: Record<string, unknown> = {};
    for (const input of this.form.inputs) {
      const name = input.name;
      const v = this.values[name];
      data[name] = typeof v === 'undefined' ? (input as any).value : v;
    }

    this.output.emit(
      new OutputObject({
        id: this.form.id as string,
        type: 'form',
        action: this.form.action || 'submit',
        error: false,
        errorMessage: [],
        data,
      })
    );
  }

  private ensureForm(): void {
    if (!this.form || !(this.form instanceof TdFormModel)) {
      throw new Error('TdForm requires `form` (TdFormModel instance).');
    }
  }

  private ensureFormId(): void {
    const incomingId = this.form.id?.trim();
    if (incomingId) {
      this.form.id = incomingId;
    } else {
      this.form.id = generateId('form');
    }
  }

  private applyForm(): void {
    this.ensureFormId();

    this.values = {};
    for (const input of this.form.inputs) {
      this.values[input.name] = (input as any).value;
    }
  }

  private findInputByName(name: string): TdInputModel | undefined {
    return this.form?.inputs?.find(x => x?.name === name);
  }
}
