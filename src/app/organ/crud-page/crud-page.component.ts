import { Component } from '@angular/core';
import { AlloyCrud } from 'alloymobile-angular';
import CrudDB from "./crud-page.data.json";

@Component({
  selector: 'app-crud-page',
  templateUrl: './crud-page.component.html',
  styleUrls: ['./crud-page.component.css']
})
export class CrudPageComponent {
  crud: AlloyCrud;
  constructor(){
    this.crud = new AlloyCrud(CrudDB);
  }
}
