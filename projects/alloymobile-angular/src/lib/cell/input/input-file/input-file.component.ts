import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'alloy-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css']
})
export class InputFileComponent {
  _row: any;
  @Input() set row(row) {
  	this._row = row;
    this.inputForm = this.createData();
  }
  //reactive form for data input
  inputForm: FormGroup;
  postForm: FormData;
  hasFile: boolean;

  @Output() output: EventEmitter<FormData> = new EventEmitter<FormData>();

  constructor(){
    this.inputForm = new FormGroup({});
    this._row = {};
    this.postForm = new FormData();
    this.hasFile = false;
  }

  createData() {
    this.inputForm = new FormGroup({});
    let group = {};
    Object.entries(this._row).forEach((column: any) => {
      group[column[0]] = new FormControl(null); 
      this.hasFile = true;
      this.postForm = new FormData();
    });
    return new FormGroup(group);
  }
  
  //called to create form data when there is a file
  onFileChange(event) {
    let file = event.target.files[0];
    let fileName = event.target.files[0].name;
    this.postForm.append('file', file, fileName);
    this.output.emit(this.postForm);
  }
}
