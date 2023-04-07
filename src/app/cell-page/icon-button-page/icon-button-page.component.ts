import { Component } from '@angular/core';
import { AlloyIconButton } from 'alloymobile-angular';
import IconButtonDB from './icon-button-page.data.json';
@Component({
  selector: 'app-icon-button-page',
  templateUrl: './icon-button-page.component.html',
  styleUrls: ['./icon-button-page.component.css']
})
export class IconButtonPageComponent {
  iconButtons: AlloyIconButton[];
  usageString: string;
  example: AlloyIconButton;
  exampleData: string;
  constructor(){
    this.iconButtons = IconButtonDB.map((icon)=>new AlloyIconButton(icon));
    this.usageString = '<alloy-icon-button [iconButton]="iconButton"></alloy-icon-button>';
    this.exampleData = "";
    this.example = new AlloyIconButton(this.exampleData);
  }



  iconClick(icon: AlloyIconButton){
    let ico = IconButtonDB.find(i=>i.id === icon.id);
    this.exampleData = JSON.stringify(ico);
    this.update();
  }

  update(){
    this.example = new AlloyIconButton(JSON.parse(this.exampleData));
  }
}
