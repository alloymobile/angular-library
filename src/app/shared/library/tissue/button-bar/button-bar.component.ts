import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppButton } from '../../cell/button/button.model';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.css']
})
export class ButtonBarComponent implements OnInit {
  _buttons: AppButton[] = [];

  @Input() set buttons(buttons: AppButton[]){
    this._buttons = buttons;
  }

  @Output() output: EventEmitter<AppButton> = new EventEmitter<AppButton>()
  constructor() { }

  ngOnInit(): void {
  }

}
