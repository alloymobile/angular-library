import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AlloyLinkBar, AlloyNavBar} from 'alloymobile-angular';
import AppDB from './app.data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-library';
  navBar: AlloyNavBar;
  selected = "cell";
  linkBar: AlloyLinkBar;
  constructor(private router: Router){
    this.navBar =  new AlloyNavBar(AppDB.navBar);
    this.linkBar = new AlloyLinkBar(AppDB.linkBar);
  }
}
