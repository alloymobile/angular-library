import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import {  Table } from '../table.model';
declare var window: any;
@Component({
  selector: 'alloy-table-action',
  templateUrl: './table-action.component.html',
  styleUrls: ['./table-action.component.css']
})
export class TableActionComponent {
  // _tableAction: Table;
  // modalForm: any;
  // formData: any;
  // @Input() set tableAction(tableAction: Table){
  //   this._tableAction = tableAction;
  // }
  // editIcon = new AlloyIcon({id:1,icon:"faEdit",size:"lg",spin:false,className:""});
  // deleteIcon = new AlloyIcon({id:2,icon:"faTrashAlt",size:"lg",spin:false,className:""});
  // @Output() output: EventEmitter<RowAction> = new EventEmitter<RowAction>();

  // constructor() {
  //   this._tableAction = new Table();
  //   this.formData = {};
  // }

  // ngOnInit(): void {
  // }

  // onClicked(row,action:Action){
  //   let data = new RowAction(row);
  //   data.action = action;
  //   this.modalForm = new window.bootstrap.Modal(
  //     document.getElementById(this._tableAction.modal.id)
  //   );
  //   this.modalForm.show();
  // }

  // capitalize(s) {
  //   if (typeof s !== 'string') return '';
  //   return s.charAt(0).toUpperCase() + s.slice(1);
  // }

  // toString(val): string {
  //   return JSON.stringify(val);
  // }

  // get action(): typeof Action {
  //   return Action;
  // }

  // submitData() {
  //   // confirm or save something
  //   this.modalForm.hide();
  //   this.output.emit(this.formData);
  // }

  // getText(text){
  //   this.formData = text;
  // }
}
