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
  row: any;
  upload: any;
  constructor(){
    this.inputTexts = InputDB.inputTexts.map((inputText)=> new AlloyInputText(inputText)) ;
    this.inputTextIcons = InputDB.inputTextIcons.map((inputTextIcon)=> new AlloyInputTextIcon(inputTextIcon)) ;
    this.searchbar = new AlloySearchBar(InputDB.searchbar);
    this.row = {id:"34",name:"fgrt"};
    this.upload = { upload:""};
    this.row = {
      id:{id:"id",name:"id",type:"text",placeholder:"Id",readOnly:false},
      name:{id:"name",name:"name",type:"text",placeholder:"name",readOnly:false}
    }
  }

  getText(text){
    console.log(text);
  }
}

