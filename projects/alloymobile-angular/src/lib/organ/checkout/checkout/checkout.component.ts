import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyCheckout } from '../checkout.model';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'alloy-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  _checkout: AlloyCheckout;
  @Input() set checkout(_checkout: AlloyCheckout){
    this._checkout = _checkout;
  }
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();
  constructor() {
    this._checkout = new AlloyCheckout();
  }

  getText(text){
    text.error ? this._checkout.pay.submit.disable = true : this._checkout.pay.submit.disable = false;
    this._checkout.data = text;
  }

  submitData(stripe){
    this._checkout.pay.submit.disable = true 
    this._checkout.pay.submit.show = true;
    this._checkout.message = "";
    let data = {...this._checkout.data}
    data["gateway"]= stripe;
    this.output.emit(data);
  }
}
