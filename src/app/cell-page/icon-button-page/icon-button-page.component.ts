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
  constructor(){
    this.iconButtons = IconButtonDB.map((icon)=>new AlloyIconButton(icon))
  }
}
