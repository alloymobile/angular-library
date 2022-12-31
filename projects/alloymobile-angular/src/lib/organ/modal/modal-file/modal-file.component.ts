import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlloyInputText } from '../../../cell/input/input.model';
import { AlloyModalFile } from '../modal.model';

@Component({
  selector: 'alloy-modal-file',
  templateUrl: './modal-file.component.html',
  styleUrls: ['./modal-file.component.css']
})
export class ModalFileComponent {
  _modalFile: AlloyModalFile;
  @Input() set modalFile(modalFile: AlloyModalFile){
    this._modalFile = modalFile;
  }
  @Output() output: EventEmitter<FormData> = new EventEmitter<FormData>();
  constructor() {
    this._modalFile = new AlloyModalFile();
  }

  getText(text){
    this._modalFile.data.push(text);
  }

  submitData(action){
    this.output.emit(this._modalFile.data );
  }

  addFile(file){
    this._modalFile.files.push(new AlloyInputText({id:"2",name:"name",className:"form-floating mb-3",type:"file",label:"Upload file",placeholder:"Upload file"}))
  }
}