import { Component, Input } from '@angular/core';
import { AlloyCardImage } from '../card.model';
import { KeyValue } from '@angular/common';
@Component({
  selector: 'alloy-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.css']
})
export class CardImageComponent {
  _cardImage: AlloyCardImage
  @Input() set cardImage(_cardImage: AlloyCardImage){
    this._cardImage = _cardImage;
  }
  constructor(){
    this._cardImage = new AlloyCardImage();
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
    return 0;
  }
}
