import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyIconLink, AlloyTabButton } from 'alloymobile-angular';
import IconLinkDB from './icon-link-page.data.json';
@Component({
  selector: 'app-icon-link-page',
  templateUrl: './icon-link-page.component.html',
  styleUrls: ['./icon-link-page.component.css']
})
export class IconLinkPageComponent {
  iconLinks: AlloyIconLink[];
  usageString: string;
  example: AlloyIconLink;
  exampleData: string;
  usageBar: AlloyTabButton
  tab: AlloyButtonIcon;
  constructor(){
    this.iconLinks = IconLinkDB.icons.map((icon)=>new AlloyIconLink(icon));
    this.usageString = '<alloy-icon-link [iconLink]="iconLink"></alloy-icon-link>';
    this.exampleData = JSON.stringify(IconLinkDB.example,null,2);
    this.example = new AlloyIconLink(this.exampleData);
    this.usageBar = new AlloyTabButton(IconLinkDB.tabBar);
    this.tab = this.usageBar.tabs[0];
  }

  iconClick(icon: AlloyIconLink){
    let ico = IconLinkDB.icons.find(i=>i.id === icon.id);
    this.exampleData = JSON.stringify(ico,null,2);
    this.update();
  }

  update(){
    this.example = new AlloyIconLink(JSON.parse(this.exampleData));
  }

  getSelected(tab: AlloyButtonIcon){
    this.tab = tab;
  }
}
