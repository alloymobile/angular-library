import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyIcon, AlloyTabButton } from 'alloymobile-angular';
import IconDB from './icon-page.data.json'
@Component({
  selector: 'alloy-icon-page',
  templateUrl: './icon-page.component.html',
  styleUrls: ['./icon-page.component.css']
})
export class IconPageComponent {
  icons: AlloyIcon[];
  usageString: string;
  example: AlloyIcon;
  exampleData: string;
  usageBar: AlloyTabButton
  tab: AlloyButtonIcon;
  constructor(){
    this.usageString = '<alloy-icon [icon]="icon"></alloy-icon>';
    this.exampleData = JSON.stringify(IconDB.example,null,2);
    this.example = new AlloyIcon(IconDB.example);
    this.icons = IconDB.icons.map((icon)=>new AlloyIcon(icon))
    this.usageBar = new AlloyTabButton(IconDB.tabBar);
    this.tab = this.usageBar.tabs[0]
  }

  iconClick(icon: AlloyIcon){
    let ico = IconDB.icons.find(i=>i.id === icon.id);
    this.exampleData = JSON.stringify(ico,null,2);
    this.update();
  }

  update(){
    this.example = new AlloyIcon(JSON.parse(this.exampleData));
  }

  getSelected(tab: AlloyButtonIcon){
    this.tab = tab;
  }
}
