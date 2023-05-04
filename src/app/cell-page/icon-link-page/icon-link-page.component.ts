import { Component } from '@angular/core';
import { AlloyButtonIcon, AlloyIcon, AlloyInputTextIcon, AlloyLinkIcon, AlloyTabButton } from 'alloymobile-angular';
import IconLinkDB from './icon-link-page.data.json';
import IconDB from '../icon-page/icon-page.data.json'
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
  search: AlloyInputTextIcon;
  constructor(){
    this.iconLinks = IconDB.icons.map((icon)=> new AlloyLinkIcon({className:"btn btn-outline-success btn-sm p-1",link:"https://alloymobile.com",icon:icon}));
    this.usageString = '<alloy-icon-link [iconLink]="iconLink"></alloy-icon-link>';
    this.exampleData = JSON.stringify(IconLinkDB.example,null,2);
    this.example = new AlloyLinkIcon(this.exampleData);
    this.usageBar = new AlloyTabButton(IconLinkDB.tabBar);
    this.tab = this.usageBar.tabs[0];
    this.search = new AlloyInputTextIcon(IconDB.search);
  }

  iconClick(link: AlloyLinkIcon){
    let ico = {id: link.icon.id, icon: AlloyIcon.getIconText(link.icon.icon), size: link.icon.size, spin: link.icon.spin, className: link.icon.className};
    let linkData = {id: link.id , className: link.className, active: link.active, link: link.link, name: link.name, icon: ico}
    this.exampleData = JSON.stringify(linkData,null,2);
    this.update();
  }

  update(){
    this.example = new AlloyLinkIcon(JSON.parse(this.exampleData));
  }

  getSelected(tab: AlloyButtonIcon){
    this.tab = tab;
  }

  getText(icon){
    let filterIcons = IconDB.icons.filter(i=> i.icon.toLowerCase().includes(icon.search.toLowerCase()));
    if(filterIcons != undefined){
      this.iconLinks = filterIcons.map((icon)=> new AlloyLinkIcon({className:"btn btn-outline-success btn-sm p-1",link:"https://alloymobile.com",icon:icon}));
    }else{
      this.iconLinks = IconDB.icons.map((icon)=> new AlloyLinkIcon({className:"btn btn-outline-success btn-sm p-1",link:"https://alloymobile.com",icon:icon}));
    }
  }
}
