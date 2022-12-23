import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputText } from '../input.model';

@Component({
  selector: 'alloy-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.css']
})
export class InputTextComponent {
  _inputText: InputText;
  @Input() set inputText(inputText: InputText) {
  	this._inputText = inputText;
  }

  @Output() output: EventEmitter<InputText> = new EventEmitter<InputText>();

  constructor() { 
    this._inputText = new InputText();
  }

}
