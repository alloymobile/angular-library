import { Component } from '@angular/core';
import { AlloyButtonBar } from 'alloymobile-angular';
import ButtonBarDB from "./bar-page.data.json";
@Component({
  selector: 'app-bar-page',
  templateUrl: './bar-page.component.html',
  styleUrls: ['./bar-page.component.css']
})
export class BarPageComponent {
  buttonBar: AlloyButtonBar;
  buttonIconBar: AlloyButtonBar;
  iconBar: AlloyButtonBar;
  example: AlloyButtonBar;
  usageString: string;
  outputString: string;
  exampleData: string;
  constructor(){
    this.usageString = '<alloy-button-bar [buttonBar]="buttonBar"></alloy-button-bar>';
    this.example = new AlloyButtonBar();
    this.exampleData = JSON.stringify(this.example,null,2);
    this.buttonBar = new AlloyButtonBar(ButtonBarDB.buttonBar);
    this.buttonIconBar = new AlloyButtonBar(ButtonBarDB.buttonIconBar);
    this.iconBar = new AlloyButtonBar(ButtonBarDB.iconBar);
  }

  // buttonIconClick(buttonIcon: AlloyButtonIcon){
  //   this.exampleData = JSON.stringify(buttonIcon,null,2);
  //   this.update();
  // }

  update(){
    // this.example = new AlloyButtonIcon(JSON.parse(this.exampleData));
  }
}
