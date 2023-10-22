import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyNavBarAction } from '../navbar.model';
import { AlloyButton } from '../../../cell/button/button.model';

@Component({
  selector: 'alloy-navbar-action',
  templateUrl: './navbar-action.component.html',
  styleUrls: ['./navbar-action.component.css']
})
export class NavbarActionComponent {
  _navBarAction: AlloyNavBarAction;
  @Input() set navBarAction(navBarAction: AlloyNavBarAction) {
  	this._navBarAction = navBarAction;
  }
  @Output() output: EventEmitter<AlloyButton>= new EventEmitter<AlloyButton>();

  constructor(){
    this._navBarAction = new AlloyNavBarAction();
  }
  
}
