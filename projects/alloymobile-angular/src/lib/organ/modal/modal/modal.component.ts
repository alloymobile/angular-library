import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlloyModal } from '../modal.model';
declare var window: any;
@Component({
  selector: 'alloy-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent{
  _modal: AlloyModal;
  modalForm: any;
  formData: any;
  @Input() set modal(modal: AlloyModal){
    this._modal = modal;
  }

  @Output() output: EventEmitter<AbstractControl<any,any>>= new EventEmitter<AbstractControl<any,any>>();
  constructor() {
    this._modal = new AlloyModal();
    this.formData = {};
  }

  showModal(){
    this.modalForm = new window.bootstrap.Modal(
      document.getElementById(this._modal.id)
    );
    this.modalForm.show();
  }
 
  submitData() {
    // confirm or save something
    this.modalForm.hide();
    this.output.emit(this.formData);
  }

  getText(text){
    this.formData = text;
  }
}