import { Component } from '@angular/core';
import { Table } from 'alloymobile-angular';
import TableDB from './table-page.data.json'

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.css']
})
export class TablePageComponent {
  table: Table ;
  constructor(){
    this.table = new Table(TableDB);
  }

  selectedRow(row){
    console.log(row);
  }
}
