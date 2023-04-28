import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyFormText } from '../form.model';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'alloy-form-text',
  templateUrl: './form-text.component.html',
  styleUrls: ['./form-text.component.css']
})
export class FormTextComponent {

  _formText: AlloyFormText;
  @Input() set formText(_formText: AlloyFormText){
    this._formText = _formText;
  }
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();
  constructor() {
    this._formText = new AlloyFormText();
  }

  getText(text){
    this._formText.data = text;
  }

  submitData(action){
    this._formText.message = "";
    let data = {...this._formText.data}
    data["action"]= action;
    this.output.emit(data);
  }
}
