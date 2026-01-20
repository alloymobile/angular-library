// td-form/td-form.model.ts
import { TdInputModel } from '../../cell/td-input/td-input.model';
import { TdButtonSubmitModel } from '../../cell/td-button-submit/td-button-submit.model';

export class TdFormModel {
  id?: string;
  title: string;
  className: string;
  message: string;
  messageClass: string;
  action: string;
  rowClass: string;

  inputs: TdInputModel[];
  submit: TdButtonSubmitModel;

  constructor(config: {
    id?: string;
    title?: string;
    className?: string;
    message?: string;
    messageClass?: string;
    action?: string;
    rowClass?: string;
    inputs?: (TdInputModel | any)[];
    submit?: TdButtonSubmitModel | any;
  }) {
    this.id = config.id;
    this.title = config.title ?? '';
    this.className = config.className ?? '';
    this.message = config.message ?? '';
    this.messageClass = config.messageClass ?? 'alert alert-info';
    this.action = config.action ?? 'submit';
    this.rowClass = config.rowClass ?? 'row g-3';

    const rawInputs = Array.isArray(config.inputs) ? config.inputs : [];
    this.inputs = rawInputs.map(x => (x instanceof TdInputModel ? x : new TdInputModel(x)));

    this.submit =
      config.submit instanceof TdButtonSubmitModel
        ? config.submit
        : new TdButtonSubmitModel(config.submit ?? { name: 'Submit' });
  }

  hasTitle(): boolean {
    return this.title.trim().length > 0;
  }

  hasMessage(): boolean {
    return this.message.trim().length > 0;
  }

  hasInputs(): boolean {
    return this.inputs.length > 0;
  }
}
