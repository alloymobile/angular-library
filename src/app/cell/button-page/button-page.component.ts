import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyModal, AlloyModalButton } from 'alloymobile-angular';
import ButtonDB from "./button.data.json"
@Component({
  selector: 'app-button-page',
  templateUrl: './button-page.component.html',
  styleUrls: ['./button-page.component.css']
})
export class ButtonPageComponent {
  buttons: AlloyButtonIcon[]
  button1: AlloyButtonIcon;
  modal: AlloyModal;
  constructor(){
    this.buttons = ButtonDB.buttons.map(b=>new AlloyButtonIcon(b));
    this.button1 = new AlloyButtonIcon(ButtonDB.button1);
  }
  modalData(data){
    console.log(data);
  }

  showModal(modal){
    console.log(modal);
    this.modal = new AlloyModal(ButtonDB.modal);
  }
}
