import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AlloyInputTextIcon } from '../input.model';

@Component({
  selector: 'alloy-input-icon-text-label',
  templateUrl: './input-icon-text-label.component.html',
  styleUrls: ['./input-icon-text-label.component.css']
})
export class InputIconTextLabelComponent {
  _inputIconTextLabels: AlloyInputTextIcon[];
  @Input() set inputIconTextLabels(inputIconTextLabels: AlloyInputTextIcon[]) {
  	this._inputIconTextLabels = inputIconTextLabels;
    this.createForm();
  }
  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() { 
    this._inputIconTextLabels = [];
  }

  createForm() {
    this.inputForm = new FormGroup({});
    this.inputForm = this.createData(this._inputIconTextLabels);
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
