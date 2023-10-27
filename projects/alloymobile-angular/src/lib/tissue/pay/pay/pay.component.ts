import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import { AlloyPay } from '../pay.model';

@Component({
  selector: 'alloy-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent {
  _pay:AlloyPay;
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  @Input() set pay(_pay: AlloyPay){
    this._pay = _pay;
  }

  @Output() output: EventEmitter<StripeCardNumberComponent>= new EventEmitter<StripeCardNumberComponent>();

  constructor(){
    this._pay = new AlloyPay();
  }
}
