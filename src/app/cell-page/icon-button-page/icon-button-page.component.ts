import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyTabButton } from 'alloymobile-angular';
import IconButtonDB from './icon-button-page.data.json';
@Component({
  selector: 'app-icon-button-page',
  templateUrl: './icon-button-page.component.html',
  styleUrls: ['./icon-button-page.component.css']
})
export class IconButtonPageComponent {
  iconButtons: AlloyButtonIcon[];
  usageString: string;
  example: AlloyButtonIcon;
  exampleData: string;
  usageBar: AlloyTabButton
  tab: AlloyButtonIcon;
  constructor(){
    this.iconButtons = IconButtonDB.icons.map((icon)=>new AlloyButtonIcon(icon));
    this.usageString = '<alloy-icon-button [iconButton]="iconButton" (output)="getSelected($event)"></alloy-icon-button>';
    this.exampleData = JSON.stringify(IconButtonDB.example,null,2);
    this.example = new AlloyButtonIcon(this.exampleData);
    this.usageBar = new AlloyTabButton(IconButtonDB.tabBar);
    this.tab = this.usageBar.tabs[0];
  }

  iconClick(icon: AlloyButtonIcon){
    let ico = IconButtonDB.icons.find(i=>i.id === icon.id);
    this.exampleData = JSON.stringify(ico,null,2);
    this.update();
  }

  update(){
    this.example = new AlloyButtonIcon(JSON.parse(this.exampleData));
  }

  getSelected(tab: AlloyButtonIcon){
    this.tab = tab;
  }
}
