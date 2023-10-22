import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyDonate } from '../donate.model';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'alloy-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent {
  _donate: AlloyDonate;
  @Input() set donate(donate: AlloyDonate){
    this._donate = donate;
  }
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();
  constructor() {
    this._donate = new AlloyDonate();
  }

  getText(text){
    text.error ? this._donate.pay.submit.disable = true : this._donate.pay.submit.disable = false;
    this._donate.data = text;
  }

  submitData(stripe){
    this._donate.pay.submit.disable = true 
    this._donate.pay.submit.show = true;
    this._donate.message = "";
    let data = {...this._donate.data}
    data["gateway"]= stripe;
    this.output.emit(data);
  }

  selectedAmount(amount){
    console.log(amount);
  }
}
