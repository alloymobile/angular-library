import { Component } from '@angular/core';
import CellDB from './cell-page.data.json';
import { AlloyIconSideBar } from '../lib/tissue/nav/nav.model';
import { AlloyIcon } from '../lib/cell/icon/icon.model';
import { AlloyCardIconAction } from '../lib/cell/card/card.model';

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
