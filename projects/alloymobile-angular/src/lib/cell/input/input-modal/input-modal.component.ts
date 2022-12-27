import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'alloy-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.css']
})
export class InputModalComponent {
  _row: any;
  @Input() set row(row) {
  	this._row = row;
    this.inputForm = this.createData();
  }
  //reactive form for data input
  inputForm: FormGroup;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor(){
    this.inputForm = new FormGroup({});
    this._row = {};
  }

  createData() {
    this.inputForm = new FormGroup({});
    let group = {};
    Object.entries(this._row).forEach((column: any) => {
      group[column[0]] = new FormControl(column[1]); 
    });
    return new FormGroup(group);
  }
}
