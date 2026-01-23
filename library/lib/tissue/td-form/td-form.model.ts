// src/app/lib/tissue/td-form/td-form.model.ts
import { generateId } from '../../share/id-helper';

import { TdInputModel } from '../../cell/td-input/td-input.model';
import { TdButtonSubmitModel } from '../../cell/td-button-submit/td-button-submit.model';

export interface TdFormConfig {
  id?: string;

  title?: string;
  className?: string;
  message?: string;

  action?: string;
  type?: string;

  submit?: TdButtonSubmitModel | any;
  fields?: Array<TdInputModel | any>;

  data?: Record<string, any>;

  [key: string]: unknown;
}

export class TdFormModel {
  id: string;

  title: string;
  className: string;
  message: string;

  action: string;
  type: string;

  submit: TdButtonSubmitModel;
  fields: TdInputModel[];

  data: Record<string, any>;

  constructor(res: TdFormConfig = {}) {
    const {
      id,
      title = 'TdMobile',
      className = 'col m-2',
      message = '',
      action = '',
      type = 'TdInputTextIcon',
      submit,
      fields,
      data,
      ...rest
    } = res;

    this.id = id ?? generateId('form');

    this.title = title;
    this.className = className;
    this.message = message;

    this.action = action;
    this.type = type;

    this.submit =
      submit instanceof TdButtonSubmitModel
        ? submit
        : new TdButtonSubmitModel(
            submit || {
              name: 'Submit',
              icon: { iconClass: 'fa-solid fa-circle-notch fa-spin' },
              className: 'btn btn-primary w-100 mt-3',
              disabled: false,
              loading: false,
              ariaLabel: 'Submit',
              title: 'Submit',
            }
          );

    const rawFields = Array.isArray(fields) ? fields : [];
    this.fields = rawFields.map((fld) =>
      fld instanceof TdInputModel ? fld : new TdInputModel(fld)
    );

    this.data = data ?? {};

    Object.assign(this, rest);
  }
}
