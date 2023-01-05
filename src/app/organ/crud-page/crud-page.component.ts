import { Component } from '@angular/core';
import { AlloyCrudFileAction } from 'alloymobile-angular';
import { AlloyCrud } from 'projects/alloymobile-angular/src/public-api';
import { AlloyCrudFile } from 'projects/alloymobile-angular/src/public-api';
import CrudDB from "./crud-page.data.json";

@Component({
  selector: 'app-crud-page',
  templateUrl: './crud-page.component.html',
  styleUrls: ['./crud-page.component.css']
})
export class CrudPageComponent {
  crud: AlloyCrud;
  constructor(){
    this.crud = new AlloyCrud(CrudDB.modal);
  }

  crudClicked(hello){
    console.log(hello);
  }
}
