import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'alloy-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.css']
})
export class InputDataComponent {
  _row: any;
  @Input() set row(row) {
  	this._row = row;
    this.inputForm = this.createData();
  }
  //reactive form for data input
  inputForm: FormGroup;
  postForm: FormData;
  hasFile: boolean;

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  @Output() file: EventEmitter<FormData> = new EventEmitter<FormData>();

  constructor(){
    this.inputForm = new FormGroup({});
    this._row = {};
    this.hasFile = false;
    this.postForm = new FormData();
  }


  //Used to create the form group
  createData(data?: any) {
    this.inputForm = new FormGroup({});
    let group = {};
    if (data) {
      Object.entries(data).forEach((column: any) => {
        if (this.isObject(column[1])) {
          group[column[0]] = new FormControl(column[1].id);
        } else {
          if (column[0] === 'file') {
            group[column[0]] = new FormControl(null);
            this.hasFile = true;
            this.postForm = new FormData();
          } else {
            group[column[0]] = new FormControl(column[1]);
          }
        }
      });
      return new FormGroup(group);
    } else {
      Object.entries(this._row).forEach((column: any) => {
        if (column[0] === 'file') {
          group[column[0]] = new FormControl(null);
          this.hasFile = true;
          this.postForm = new FormData();
        } else {
          group[column[0]] = new FormControl(column[1].value);
        }
      });
      return new FormGroup(group);
    }
  }

  //called to create form data when there is a file
  onFileChange(event) {
    let file = event.target.files[0];
    let fileName = event.target.files[0].name;
    this.postForm.append('file', file, fileName);
  }
  
  isObject(val): boolean {
    return val instanceof Object;
  }
}
