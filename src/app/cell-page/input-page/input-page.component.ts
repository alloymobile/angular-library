import { Component } from '@angular/core';
import { AlloyButtonIcon,AlloyInput,AlloyInputText,AlloyInputTextIcon,AlloySearchBar } from 'alloymobile-angular';
import InputDB from './input-page.data.json';

@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css']
})
export class InputPageComponent {
  inputText: AlloyInputText;
  inputTextIcon: AlloyInputTextIcon;
  searchbar: AlloySearchBar;
  row: any;
  upload: any;
  fields: AlloyInput[];
  constructor(){
    this.inputText =  new AlloyInputText(InputDB.inputText) ;
    this.inputTextIcon = new AlloyInputTextIcon(InputDB.inputTextIcon) ;
    this.searchbar = new AlloySearchBar(InputDB.searchbar);
    this.row = {id:"34",name:"fgrt"};
    this.upload = new AlloyInputText(InputDB.inputFile)
    this.row = {
      id:{id:"id",name:"id",type:"text",placeholder:"Id",readOnly:false},
      name:{id:"name",name:"name",type:"text",placeholder:"name",readOnly:false}
    }
    this.fields = InputDB.fields.map(f=>new AlloyInput(f.type,f));
  }

  getText(text){
    console.log(text);
  }
}

