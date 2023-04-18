import { Component } from '@angular/core';
import { AlloyCrudFileAction } from 'alloymobile-angular';
import { AlloyCrudTable } from 'projects/alloymobile-angular/src/public-api';
import { AlloyCrudFile } from 'projects/alloymobile-angular/src/public-api';
import CrudDB from "./crud-page.data.json";

@Component({
  selector: 'app-crud-page',
  templateUrl: './crud-page.component.html',
  styleUrls: ['./crud-page.component.css']
})
export class CrudPageComponent {
  crud: AlloyCrudTable;
  constructor(){
    this.crud = new AlloyCrudTable(CrudDB.modal);
  }

  crudClicked(hello){
    console.log(hello);
  }
}
