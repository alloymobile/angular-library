import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AlloyInputText } from '../input.model';

@Component({
  selector: 'alloy-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.css']
})
export class InputFileComponent {
  _inputFile: AlloyInputText;
  @Input() set inputFile(inputFile: AlloyInputText) {
  	this._inputFile = inputFile;
  }
  @Output() output: EventEmitter<FormData> = new EventEmitter<FormData>();

  constructor(){
    this._inputFile = new AlloyInputText();
  }
  
  //called to create form data when there is a file
  onFileChange(event) {
    let fileData = new FormData();
    let file = event.target.files[0];
    let fileName = event.target.files[0].name;
    fileData.append('file', file, fileName);
    this.output.emit(fileData);
  }
}
