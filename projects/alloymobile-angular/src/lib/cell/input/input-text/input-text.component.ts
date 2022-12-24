import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    this.createForm();
  }

  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AlloyInputText> = new EventEmitter<AlloyInputText>();

  constructor() { 
    this._inputText = new AlloyInputText();
  }

  // convenience getter for easy access to form fields
  get formControl() {
    return this.inputForm.controls;
  }

  createForm() {
    this.inputForm = this.createData(this._inputText);
  }

  submitData() {
    console.log(this.formControl);
  }

  //Used to create the form group
  createData(data: AlloyInputText) {
      let group = {};
      Object.entries(data).forEach((column: any) => {
        if (column[0] === 'name') {
          group[column[1]] = new FormControl(column[1]); 
        }
      });
      return new FormGroup(group);
  }
}
