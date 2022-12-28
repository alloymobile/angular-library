import { Component, Input } from '@angular/core';
import { AlloyCardDashboard } from '../card.model';

@Component({
  selector: 'alloy-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrls: ['./card-dashboard.component.css']
})
export class CardDashboardComponent {
  _cardDashboard: AlloyCardDashboard;
  @Input() set cardDashboard(cardDashboard: AlloyCardDashboard){
    this._cardDashboard = cardDashboard;
  }

  constructor() { 
    this._cardDashboard = new AlloyCardDashboard();
  }

}
