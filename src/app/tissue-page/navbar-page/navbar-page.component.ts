import { Component } from '@angular/core';
import { AlloyNavBar } from 'alloymobile-angular';
import NavDB from "./navbar-page.data.json"
@Component({
  selector: 'app-navbar-page',
  templateUrl: './navbar-page.component.html',
  styleUrls: ['./navbar-page.component.css']
})
export class NavbarPageComponent {
  navbar: AlloyNavBar
  constructor(){
    this.navbar = new AlloyNavBar(NavDB.navBar);
  }
}
