import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AlloyInputTextIcon } from '../input.model';

@Component({
  selector: 'alloy-input-text-icon-label',
  templateUrl: './input-text-icon-label.component.html',
  styleUrls: ['./input-text-icon-label.component.css']
})
export class InputTextIconLabelComponent {
  _inputTextIconLabels: AlloyInputTextIcon[];
  @Input() set inputTextIconLabels(inputTextIconLabels: AlloyInputTextIcon[]) {
  	this._inputTextIconLabels = inputTextIconLabels;
    this.createForm();
  }
  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() { 
    this._inputTextIconLabels = [];
  }

  createForm() {
    this.inputForm = new FormGroup({});
    this.inputForm = this.createData(this._inputTextIconLabels);
  }

  //Used to create the form group
  createData(data: AlloyInputTextIcon[]) {
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
