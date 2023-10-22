import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyCardAction } from '../card.model';
import { KeyValue } from '@angular/common';
@Component({
  selector: 'alloy-card-action',
  templateUrl: './card-action.component.html',
  styleUrls: ['./card-action.component.css']
})
export class CardActionComponent {
  _cardAction: AlloyCardAction;
  @Input() set cardAction(cardAction: AlloyCardAction){
    this._cardAction = cardAction;
  }

  @Output() output: EventEmitter<any>= new EventEmitter<any>();

  constructor(){
    this._cardAction = new AlloyCardAction();
  }

  getAction(action){
    let data = {row:{},action:{}};
    data.row = this._cardAction;
    data.action = action.name;
    this.output.emit(data);
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }
}
