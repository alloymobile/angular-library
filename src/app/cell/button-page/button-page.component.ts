import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyModal, AlloyModalButton } from 'alloymobile-angular';
import ButtonDB from "./button.data.json"
@Component({
  selector: 'app-button-page',
  templateUrl: './button-page.component.html',
  styleUrls: ['./button-page.component.css']
})
export class ButtonPageComponent {
  modalButton: AlloyModalButton;
  buttons: AlloyButtonIcon[]
  button1: AlloyButtonIcon;
  modal: AlloyModal;
  constructor(){
    this.modalButton = new AlloyModalButton(ButtonDB.modalButton)
    this.buttons = ButtonDB.buttons.map(b=>new AlloyButtonIcon(b));
    this.button1 = new AlloyButtonIcon(ButtonDB.button1);
  }
  modalData(data){
    console.log(data);
  }

  showModal(modal){
    console.log(modal);
    this.modal = new AlloyModal(ButtonDB.modal);
    this.modal.open = true;
  }
}
