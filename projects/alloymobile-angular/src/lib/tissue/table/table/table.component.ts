import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Table } from '../table.model';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'alloy-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  _table: Table;
  @Input() set table(table: Table){
    this._table = table;
  }

  constructor() {
    this._table = new Table();
  }

  capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

    // Preserve original property order
    originalOrder = (a: KeyValue<number,string>, b: KeyValue<number,string>): number => {
      return 0;
    }

}
