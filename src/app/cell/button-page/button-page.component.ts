import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyModal } from 'alloymobile-angular';
import ButtonDB from "./button.data.json"
@Component({
  selector: 'app-button-page',
  templateUrl: './button-page.component.html',
  styleUrls: ['./button-page.component.css']
})
export class ButtonPageComponent {
  modal: AlloyModal;
  buttons: AlloyButtonIcon[]
  constructor(){
    this.modal = new AlloyModal(ButtonDB.modal)
    this.buttons = ButtonDB.buttons.map(b=>new AlloyButtonIcon(b));
  }
  modalData(data){
    console.log(data);
  }
}
