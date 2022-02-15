import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppButton } from './button.model';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  _button: AppButton;
  @Input() set button(button: AppButton){
    this._button = button;
  }
  @Output() output: EventEmitter<AppButton>= new EventEmitter<AppButton>();
  constructor() { }

  ngOnInit(): void {
  }

}
