import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyIconButton } from '../button.model';

@Component({
  selector: 'alloy-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css']
})
export class IconButtonComponent {
  _iconButton: AlloyIconButton;
  @Input() set iconButton(iconButton: AlloyIconButton){
    this._iconButton = iconButton;
  }
  @Output() output: EventEmitter<AlloyIconButton>= new EventEmitter<AlloyIconButton>();
  constructor() {
    this._iconButton = new AlloyIconButton();
  }
}
