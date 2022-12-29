import { Component } from '@angular/core';
import { AlloyClientBar,AlloyNavBarIcon,AlloyIconSideBar } from 'alloymobile-angular';
import AppDB from './app.data.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-library';
  sideBar: AlloyIconSideBar;
  navBar: AlloyNavBarIcon;
  selected = "cell";
  clientBar: AlloyClientBar;
  constructor(){
    this.sideBar = new AlloyIconSideBar(AppDB.cellBar) 
    this.navBar =  new AlloyNavBarIcon(AppDB.navBar);
    this.clientBar = new AlloyClientBar(AppDB.clientBar);
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

  back(text){
    console.log(text);
  }
}
