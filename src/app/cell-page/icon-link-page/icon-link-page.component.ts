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
  constructor(){
    this.iconLinks = IconLinkDB.map((icon)=>new AlloyIconLink(icon))
  }
}
