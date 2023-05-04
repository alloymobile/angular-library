import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyIcon, AlloyInputTextIcon, AlloyTabButton } from 'alloymobile-angular';
import IconButtonDB from './icon-button-page.data.json';
import IconDB from '../icon-page/icon-page.data.json'
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
  search: AlloyInputTextIcon;
  constructor(){
    this.iconButtons = IconDB.icons.map((icon)=> new AlloyButtonIcon({className:"btn btn-outline-success btn-sm p-1",name:icon.icon,icon:icon}));
    this.usageString = '<alloy-icon-button [iconButton]="iconButton" (output)="getSelected($event)"></alloy-icon-button>';
    this.exampleData = JSON.stringify(IconButtonDB.example,null,2);
    this.example = new AlloyButtonIcon(this.exampleData);
    this.usageBar = new AlloyTabButton(IconButtonDB.tabBar);
    this.tab = this.usageBar.tabs[0];
    this.search = new AlloyInputTextIcon(IconDB.search);
  }

  iconClick(button: AlloyButtonIcon){
    let ico = {id: button.icon.id, icon: AlloyIcon.getIconText(button.icon.icon), size: button.icon.size, spin: button.icon.spin, className: button.icon.className};
    let buttonData = {id: button.id , className: button.className, active: button.active, name: button.name,type:button.type, icon: ico}
    this.exampleData = JSON.stringify(buttonData,null,2);
    this.update();
  }

  update(){
    this.example = new AlloyButtonIcon(JSON.parse(this.exampleData));
  }

  getSelected(tab: AlloyButtonIcon){
    this.tab = tab;
  }

  getText(icon){
    let filterIcons = IconDB.icons.filter(i=> i.icon.toLowerCase().includes(icon.search.toLowerCase()));
    if(filterIcons != undefined){
      this.iconButtons = filterIcons.map((icon)=> new AlloyButtonIcon({className:"btn btn-outline-success btn-sm p-1",name:icon.icon,icon:icon}));
    }else{
      this.iconButtons = IconDB.icons.map((icon)=> new AlloyButtonIcon({className:"btn btn-outline-success btn-sm p-1",name:icon.icon,icon:icon}));
    }
  }
}
