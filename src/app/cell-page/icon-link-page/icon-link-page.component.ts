import { Component } from '@angular/core';
import { AlloyIconLink } from 'alloymobile-angular';
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
  constructor(){
    this.iconLinks = IconLinkDB.map((icon)=>new AlloyIconLink(icon));
    this.usageString = '<alloy-icon-link [iconLink]="iconLink"></alloy-icon-link>';
    this.exampleData = "";
    this.example = new AlloyIconLink(this.exampleData);
  }

  iconClick(icon: AlloyIconLink){
    let ico = IconLinkDB.find(i=>i.id === icon.id);
    this.exampleData = JSON.stringify(ico);
    this.update();
  }

  update(){
    this.example = new AlloyIconLink(JSON.parse(this.exampleData));
  }
}
