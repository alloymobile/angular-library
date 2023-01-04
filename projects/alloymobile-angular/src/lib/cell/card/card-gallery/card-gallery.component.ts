import { Component,Input} from '@angular/core';
import { AlloyCardImage } from '../card.model';

@Component({
  selector: 'alloy-card-gallery',
  templateUrl: './card-gallery.component.html',
  styleUrls: ['./card-gallery.component.css']
})
export class CardGalleryComponent {
  _cardGallery: AlloyCardImage = new AlloyCardImage();
  @Input() set cardGallery(cardGallery: AlloyCardImage){
    this._cardGallery = cardGallery;
  }

  constructor() {
    this._cardGallery = new AlloyCardImage();
  }

}
