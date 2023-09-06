import { Component, Input } from '@angular/core';
import {  AlloyButtonDropDown } from '../button.model';

@Component({
  selector: 'alloy-button-dropdown',
  templateUrl: './button-dropdown.component.html',
  styleUrls: ['./button-dropdown.component.css']
})
export class ButtonDropdownComponent {
  _buttonDropDown: AlloyButtonDropDown;
  @Input() set buttonDropDown(buttonDropDown: AlloyButtonDropDown){
    this._buttonDropDown = buttonDropDown;
  }
  constructor() {
    this._buttonDropDown = new AlloyButtonDropDown();
  }
}
