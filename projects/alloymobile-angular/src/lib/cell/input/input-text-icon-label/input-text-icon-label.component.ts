import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlloyInputTextIconLabel } from '../input.model';

@Component({
  selector: 'lib-input-text-icon-label',
  templateUrl: './input-text-icon-label.component.html',
  styleUrls: ['./input-text-icon-label.component.css']
})
export class InputTextIconLabelComponent {
  _inputTextIconLabel: AlloyInputTextIconLabel;
  @Input() set inputTextIconLabel(inputTextIconLabel: AlloyInputTextIconLabel) {
  	this._inputTextIconLabel = inputTextIconLabel;
  }

  //reactive form for data input
  dataForm: FormGroup;

  @Output() output: EventEmitter<AlloyInputTextIconLabel> = new EventEmitter<AlloyInputTextIconLabel>();

  constructor(private formBuilder: FormBuilder) { 
    this._inputTextIconLabel = new AlloyInputTextIconLabel();
  }

  createDataForm() {
    this.dataForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }
}
