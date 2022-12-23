import { Component, Input } from '@angular/core';
import { AlloyNavBar } from '../navbar.model';

@Component({
  selector: 'alloy-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  _navBar: AlloyNavBar;
  @Input() set navBar(navBar: AlloyNavBar) {
  	this._navBar = navBar;
  }
  constructor(){
    this._navBar = new AlloyNavBar();
  }
}
