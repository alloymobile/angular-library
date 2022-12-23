import { Component } from '@angular/core';
import { AlloyIconNavBar, AlloyIconSideBar } from 'alloymobile-angular';
import AppDB from './app.data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-library';
  sideBar: AlloyIconSideBar;
  navBar: AlloyIconNavBar;
  selected = "cell";
  constructor(){
    this.sideBar = new AlloyIconSideBar(AppDB.cellBar) 
    this.navBar =  new AlloyIconNavBar(AppDB.navBar);
  }
  setActive(comp: string){
    switch(comp){
      case "cell":
        this.selected = "cell";
        this.sideBar = new AlloyIconSideBar(AppDB.cellBar) 
        break;
      case "tissue":
        this.selected = "tissue";
        this.sideBar = new AlloyIconSideBar(AppDB.tissueBar) 
        break;
      case "organ":
        this.selected = "organ";
        this.sideBar = new AlloyIconSideBar(AppDB.organBar) 
        break;      
    }
  }
}
