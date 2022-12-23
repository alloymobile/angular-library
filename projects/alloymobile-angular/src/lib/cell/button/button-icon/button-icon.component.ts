import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyButtonIcon } from '../button.model';

@Component({
  selector: 'alloy-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrls: ['./button-icon.component.css']
})
export class ButtonIconComponent {
  _buttonIcon: AlloyButtonIcon;
  @Input() set iconButton(iconButton: AlloyButtonIcon){
    this._buttonIcon = iconButton;
  }
  @Output() output: EventEmitter<AlloyButtonIcon>= new EventEmitter<AlloyButtonIcon>();
  constructor() {
    this._buttonIcon = new AlloyButtonIcon();
  }
}
