import { Component, Input } from '@angular/core';
import { AlloyCard } from '../card.model';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'alloy-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  _card: AlloyCard
  @Input() set card(_card: AlloyCard){
    this._card = _card;
  }
  constructor(){
    this._card = new AlloyCard();
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }
}
