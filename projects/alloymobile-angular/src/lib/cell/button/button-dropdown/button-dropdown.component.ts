import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyButton, AlloyButtonDropDown } from '../button.model';

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
  @Output() output: EventEmitter<AlloyButton>= new EventEmitter<AlloyButton>();
  constructor() {
    this._buttonDropDown = new AlloyButtonDropDown();
  }
}
