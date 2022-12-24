import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AlloyInputTextIcon } from '../input.model';

@Component({
  selector: 'alloy-input-text-icon',
  templateUrl: './input-text-icon.component.html',
  styleUrls: ['./input-text-icon.component.css']
})
export class InputTextIconComponent {
  _inputTextIcons: AlloyInputTextIcon[];
  @Input() set inputTextIcons(inputTextIcons: AlloyInputTextIcon[]) {
  	this._inputTextIcons = inputTextIcons;
    this.createForm();
  }
  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() { 
    this._inputTextIcons = [];
  }

  createForm() {
    this.inputForm = new FormGroup({});
    this.inputForm = this.createData(this._inputTextIcons);
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
