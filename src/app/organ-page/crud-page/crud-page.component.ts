import { Component } from '@angular/core';
import { AlloyCrudFileAction } from 'alloymobile-angular';
import { AlloyCrudTable } from 'projects/alloymobile-angular/src/public-api';
import { AlloyCrudFile } from 'projects/alloymobile-angular/src/public-api';
import CrudDB from "./crud-page.data.json";
import { AlloyCrudCard } from 'src/app/lib/organ/crud/crud.model';

@Component({
  selector: 'app-crud-page',
  templateUrl: './crud-page.component.html',
  styleUrls: ['./crud-page.component.css']
})
export class CrudPageComponent {
  crud: AlloyCrudTable;
  crudCard: AlloyCrudCard;
  constructor(){
    // this.crud = new AlloyCrudTable(CrudDB.modal);
    this.crudCard =  new AlloyCrudCard(CrudDB.details);
  }

  crudClicked(hello){
    console.log(hello);
  }
}
