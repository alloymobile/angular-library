import { Component, Input } from '@angular/core';
import { AlloyIconNavBar } from '../navbar.model';

@Component({
  selector: 'alloy-icon-navbar',
  templateUrl: './icon-navbar.component.html',
  styleUrls: ['./icon-navbar.component.css']
})
export class IconNavbarComponent {
  _iconNavBar: AlloyIconNavBar;
  @Input() set iconNavBar(iconNavBar: AlloyIconNavBar) {
  	this._iconNavBar = iconNavBar;
  }
  constructor(){
    this._iconNavBar = new AlloyIconNavBar();
  }
}
