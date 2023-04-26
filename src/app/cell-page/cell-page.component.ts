import { Component } from '@angular/core';
import { AlloyIcon, AlloyIconSideBar, AlloyTabButton } from 'alloymobile-angular';
import CellDB from './cell-page.data.json';
import { AlloyCardIconAction } from 'projects/alloymobile-angular/src/public-api';
@Component({
  selector: 'app-cell-page',
  templateUrl: './cell-page.component.html',
  styleUrls: ['./cell-page.component.css']
})
export class CellPageComponent {
  sideBar: AlloyIconSideBar;
  toggleIcon: AlloyIcon;
  card: AlloyCardIconAction
  constructor(){
    this.sideBar = new AlloyIconSideBar(CellDB.sidebar); 
    this.toggleIcon = new AlloyIcon({id:1,icon:"faBars",size:"lg",spin:false,className:"btn btn-outline-dark border-0"});
    this.card = new AlloyCardIconAction(CellDB.sample);
  }
}
