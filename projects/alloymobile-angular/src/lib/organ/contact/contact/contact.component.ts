import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyContact } from '../contact.model';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'alloy-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  _contact: AlloyContact;
  @Input() set contact(contact: AlloyContact){
    this._contact = contact;
  };

  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() {
    this._contact = new AlloyContact();
  }
}
