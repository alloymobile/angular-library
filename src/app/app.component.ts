import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AlloyNavBarIcon} from 'alloymobile-angular';
import AppDB from './app.data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-library';
  navBar: AlloyNavBarIcon;
  selected = "cell";
  constructor(private router: Router){
    this.navBar =  new AlloyNavBarIcon(AppDB.navBar);
  }
  setActive(comp: string){
    switch(comp){
      case "cell":
        this.selected = "cell";
        this.router.navigate(['']);
        break;
      case "tissue":
        this.selected = "tissue";
        this.router.navigate(['tissue']);
        break;
      case "organ":
        this.selected = "organ";
        this.router.navigate(['organ']);
        break;      
    }
  }
}
