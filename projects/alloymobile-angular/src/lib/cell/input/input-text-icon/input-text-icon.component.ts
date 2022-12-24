import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyInputTextIcon } from '../input.model';

@Component({
  selector: 'alloy-input-text-icon',
  templateUrl: './input-text-icon.component.html',
  styleUrls: ['./input-text-icon.component.css']
})
export class InputTextIconComponent {
  _inputTextIcon: AlloyInputTextIcon;
  @Input() set inputTextIcon(inputTextIcon: AlloyInputTextIcon) {
  	this._inputTextIcon = inputTextIcon;
  }

  @Output() output: EventEmitter<AlloyInputTextIcon> = new EventEmitter<AlloyInputTextIcon>();

  constructor() { 
    this._inputTextIcon = new AlloyInputTextIcon();
  }

}
