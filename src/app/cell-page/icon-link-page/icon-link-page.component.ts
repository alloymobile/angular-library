import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyLinkIcon, AlloyTabButton } from 'alloymobile-angular';
import IconLinkDB from './icon-link-page.data.json';
@Component({
  selector: 'app-icon-link-page',
  templateUrl: './icon-link-page.component.html',
  styleUrls: ['./icon-link-page.component.css']
})
export class IconLinkPageComponent {
  iconLinks: AlloyLinkIcon[];
  usageString: string;
  example: AlloyLinkIcon;
  exampleData: string;
  usageBar: AlloyTabButton
  tab: AlloyButtonIcon;
  constructor(){
    this.iconLinks = IconLinkDB.icons.map((icon)=>new AlloyLinkIcon(icon));
    this.usageString = '<alloy-icon-link [iconLink]="iconLink"></alloy-icon-link>';
    this.exampleData = JSON.stringify(IconLinkDB.example,null,2);
    this.example = new AlloyLinkIcon(this.exampleData);
    this.usageBar = new AlloyTabButton(IconLinkDB.tabBar);
    this.tab = this.usageBar.tabs[0];
  }

  iconClick(icon: AlloyLinkIcon){
    let ico = IconLinkDB.icons.find(i=>i.id === icon.id);
    this.exampleData = JSON.stringify(ico,null,2);
    this.update();
  }

  update(){
    this.example = new AlloyLinkIcon(JSON.parse(this.exampleData));
  }

  getSelected(tab: AlloyButtonIcon){
    this.tab = tab;
  }
}
