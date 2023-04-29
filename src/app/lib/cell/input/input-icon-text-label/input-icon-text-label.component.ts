import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AlloyInputTextIcon } from '../input.model';

@Component({
  selector: 'alloy-input-icon-text-label',
  templateUrl: './input-icon-text-label.component.html',
  styleUrls: ['./input-icon-text-label.component.css']
})
export class InputIconTextLabelComponent {
  _inputIconTextLabel: AlloyInputTextIcon;
  @Input() set inputIconTextLabel(inputIconTextLabel: AlloyInputTextIcon) {
  	this._inputIconTextLabel = inputIconTextLabel;
    this.inputForm = this.createData(this._inputIconTextLabel);
  }
  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() { 
    this._inputIconTextLabel = new AlloyInputTextIcon();
    this.inputForm = new FormGroup({});
  }

  //Used to create the form group
  createData(data: AlloyInputTextIcon) {
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
