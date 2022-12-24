import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AlloyInputTextIcon } from '../input.model';

@Component({
  selector: 'alloy-input-icon-text',
  templateUrl: './input-icon-text.component.html',
  styleUrls: ['./input-icon-text.component.css']
})
export class InputIconTextComponent {
  _inputIconTexts: AlloyInputTextIcon[];
  @Input() set inputIconTexts(inputIconTexts: AlloyInputTextIcon[]) {
  	this._inputIconTexts = inputIconTexts;
    this.createForm();
  }
  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() { 
    this._inputIconTexts = [];
  }

  createForm() {
    this.inputForm = new FormGroup({});
    this.inputForm = this.createData(this._inputIconTexts);
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
