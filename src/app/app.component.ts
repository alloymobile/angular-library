import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AlloyLinkBar, AlloyNavBar} from 'alloymobile-angular';
import AppDB from './app.data.json';
import { AlloyEmail } from 'projects/alloymobile-angular/src/public-api';
import { Email } from './email.model';

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
  userData: AlloyEmail;
  emails: any;
  constructor(private router: Router){
    this.navBar =  new AlloyNavBar(AppDB.navBar);
    this.linkBar = new AlloyLinkBar(AppDB.linkBar);
    this.emails = AppDB.sample.content;
    this.userData.table.rows = this.emails.map((r)=>Email.showEmailModel(r));
  }

  submitData(data: any){
    console.log(data);
  }
}
