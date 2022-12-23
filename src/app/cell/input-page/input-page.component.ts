import { Component } from '@angular/core';
import { InputText } from 'alloymobile-angular';
import InputDB from './input-page.data.json';
@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css']
})
export class InputPageComponent {
  inputTexts: InputText[];
  constructor(){
    this.inputTexts = InputDB.map((inputText)=> new InputText(inputText)) ;
  }

  gettext(text){
    console.log(text);
  }
}

