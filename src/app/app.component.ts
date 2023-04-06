import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private router: Router){
    this.sideBar = new AlloyIconSideBar(AppDB.cellBar) 
    this.navBar =  new AlloyNavBarIcon(AppDB.navBar);
    this.clientBar = new AlloyClientBar(AppDB.clientBar);
  }
  setActive(comp: string){
    switch(comp){
      case "cell":
        this.selected = "cell";
        this.sideBar = new AlloyIconSideBar(AppDB.cellBar);
        this.router.navigate(['']);
        break;
      case "tissue":
        this.selected = "tissue";
        this.sideBar = new AlloyIconSideBar(AppDB.tissueBar);
        this.router.navigate(['tissue']);
        break;
      case "organ":
        this.selected = "organ";
        this.sideBar = new AlloyIconSideBar(AppDB.organBar);
        this.router.navigate(['organ']);
        break;      
    }
  }

  back(text){
    console.log(text);
  }
}
