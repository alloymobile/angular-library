import { Component } from '@angular/core';
import { AlloyInput, AlloyInputTextIcon } from 'alloymobile-angular';
import InputDB from './input-page.data.json';

@Component({
  selector: 'app-input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css']
})
export class InputPageComponent {
  inputs: AlloyInput[];
  example: AlloyInput;
  usageString: string;
  exampleData: string;
  outputString: string;
  constructor(){
    this.usageString = '<alloy-input [input]="input"></alloy-input>';
    this.inputs = InputDB.inputs.map((input)=>new AlloyInput(input));
    this.example = new AlloyInput();
    this.exampleData = JSON.stringify(this.example.toString(),null,2);
    this.outputString = "";
  }

  inputClick(input: AlloyInputTextIcon){
    this.example = input;
    this.exampleData = JSON.stringify(this.example.toString(),null,2);
    this.update();
  }

  update(){
    this.example = new AlloyInputTextIcon(JSON.parse(this.exampleData));
  }

  onInput(form){
    this.outputString = JSON.stringify(form);
  }
}

