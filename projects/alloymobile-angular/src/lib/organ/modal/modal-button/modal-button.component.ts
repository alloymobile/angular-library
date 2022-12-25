import { Component, EventEmitter, Input, Output  } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlloyModalButton } from '../modal.model';
declare var window: any;
@Component({
  selector: 'alloy-modal-button',
  templateUrl: './modal-button.component.html',
  styleUrls: ['./modal-button.component.css']
})
export class ModalButtonComponent {
  _modalButton: AlloyModalButton;
  modalForm: any;
  formData: any;
  @Input() set modalButton(modalButton: AlloyModalButton){
    this._modalButton = modalButton;
  }

  @Output() output: EventEmitter<AbstractControl<any,any>>= new EventEmitter<AbstractControl<any,any>>();
  constructor() {
    this._modalButton = new AlloyModalButton();
    this.formData = {};
  }

  showModal(text){
    this.modalForm = new window.bootstrap.Modal(
      document.getElementById(this._modalButton.id)
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