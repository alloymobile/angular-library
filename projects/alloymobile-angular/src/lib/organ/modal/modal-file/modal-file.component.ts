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
  files:any;
  @Output() output: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
    this._modalFile = new AlloyModalFile();
    this.files = [];
  }

  getText(data){
    this.files = data;
  }

  submitData(){
    this.output.emit(this.files);
  }
}