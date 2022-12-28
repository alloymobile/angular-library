import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AlloyInputTextIcon } from '../input.model';

@Component({
  selector: 'alloy-input-texts',
  templateUrl: './input-texts.component.html',
  styleUrls: ['./input-texts.component.css']
})
export class InputTextsComponent {
  _inputTexts: AlloyInputTextIcon[];
  @Input() set inputTexts(inputTexts: AlloyInputTextIcon[]) {
  	this._inputTexts = inputTexts;
    this.inputForm = this.createData(this._inputTexts);
  }
  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() { 
    this._inputTexts = [];
    this.inputForm = new FormGroup({});
  }

  //Used to create the form group
  createData(columns: AlloyInputTextIcon[]) {
    this.inputForm = new FormGroup({});
    let group = {};
    columns.forEach(record=>{
      Object.entries(record).forEach((column: any) => {
        if (column[0] === 'name') {
          group[column[1]] = new FormControl(record.text); 
        }
      });
    })
    return new FormGroup(group);
  }
}
