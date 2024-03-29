import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyCardImageAction } from '../card.model';
import { KeyValue } from '@angular/common';
@Component({
  selector: 'alloy-card-image-action',
  templateUrl: './card-image-action.component.html',
  styleUrls: ['./card-image-action.component.css']
})
export class CardImageActionComponent {
  _cardImageAction: AlloyCardImageAction;
  @Input() set cardImageAction(cardImageAction: AlloyCardImageAction){
    this._cardImageAction = cardImageAction;
  }

  @Output() output: EventEmitter<any>= new EventEmitter<any>();

  constructor(){
    this._cardImageAction = new AlloyCardImageAction();
  }

  getAction(action){
    let data = {row:{},action:{}};
    data.row = this._cardImageAction;
    data.action = action.name;
    this.output.emit(data);
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }
}
