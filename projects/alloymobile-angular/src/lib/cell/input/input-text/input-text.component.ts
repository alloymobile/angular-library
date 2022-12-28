import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AlloyInputText } from '../input.model';

@Component({
  selector: 'alloy-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})
export class InputTextComponent {
  _inputText: AlloyInputText;
  @Input() set inputText(inputText: AlloyInputText) {
  	this._inputText = inputText;
    this.inputForm = this.createData(this._inputText);
  }

  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() { 
    this._inputText = new AlloyInputText();
    this.inputForm = new FormGroup({});
  }

  //Used to create the form group
  // only the name field used to create the form control
  createData(data: AlloyInputText) {
    this.inputForm = new FormGroup({});
    let group = {};
      Object.entries(data).forEach((column: any) => {
        if (column[0] === 'name') {
          group[column[1]] = new FormControl(data.text); 
        }
      });
    return new FormGroup(group);
  }
}
