import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AlloyInputText } from '../input.model';

@Component({
  selector: 'alloy-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})
export class InputTextComponent {
  _inputTexts: AlloyInputText[];
  @Input() set inputTexts(inputTexts: AlloyInputText[]) {
  	this._inputTexts = inputTexts;
    this.createForm();
  }

  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() { 
    this._inputTexts = [];
  }

  createForm() {
    this.inputForm = new FormGroup({});
    this.inputForm = this.createData(this._inputTexts);
  }

  //Used to create the form group
  createData(data: AlloyInputText[]) {
    let group = {};
    data.forEach(d=>{
      Object.entries(d).forEach((column: any) => {
        if (column[0] === 'name') {
          group[column[1]] = new FormControl(); 
        }
      });
    })
    return new FormGroup(group);
  }
}
