import { Component } from '@angular/core';
import { AlloyCrud } from 'alloymobile-angular';
import { AlloyCrudFile } from 'projects/alloymobile-angular/src/public-api';
import CrudDB from "./crud-page.data.json";

@Component({
  selector: 'app-crud-page',
  templateUrl: './crud-page.component.html',
  styleUrls: ['./crud-page.component.css']
})
export class CrudPageComponent {
  crud: AlloyCrudFile;
  constructor(){
    this.crud = new AlloyCrudFile(CrudDB.modalFile);
  }

  crudClicked(hello){
    console.log(hello);
  }
}
