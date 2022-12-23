import { Component } from '@angular/core';
import { AlloyIcon } from 'alloymobile-angular';
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
  constructor(){
    this.usageString = '<alloy-icon [icon]="icon"></alloy-icon>';
    this.exampleData = "";
    this.example = new AlloyIcon(this.exampleData);
    this.icons = IconDB.map((icon)=>new AlloyIcon(icon))
  }

  iconClick(icon: AlloyIcon){
    let ico = IconDB.find(i=>i.id === icon.id);
    this.exampleData = JSON.stringify(ico);
    this.update();
  }

  update(){
    this.example = new AlloyIcon(JSON.parse(this.exampleData));
  }
}
