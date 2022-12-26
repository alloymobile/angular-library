import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyInputText,AlloyInputTextIcon,AlloySearchBar } from 'alloymobile-angular';
import InputDB from './input-page.data.json';
@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css']
})
export class InputPageComponent {
  inputTexts: AlloyInputText[];
  inputTextIcons: AlloyInputTextIcon[];
  searchbar: AlloySearchBar;
  inputModal: any;
  constructor(){
    this.inputTexts = InputDB.inputTexts.map((inputText)=> new AlloyInputText(inputText)) ;
    this.inputTextIcons = InputDB.inputTextIcons.map((inputTextIcon)=> new AlloyInputTextIcon(inputTextIcon)) ;
    this.searchbar = new AlloySearchBar(InputDB.searchbar);
    this.inputModal = {id:"34",name:"fgrt"};
  }

  getText(text){
    console.log(text);
  }
}

