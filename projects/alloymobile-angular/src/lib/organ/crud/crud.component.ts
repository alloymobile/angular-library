import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlloyIcon } from '../../cell/icon/icon.model';
import { AlloyInputTextIcon } from '../../cell/input/input.model';
import { Action, AlloyCrud } from './crud.model';
declare var window: any;
@Component({
  selector: 'alloy-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent {
  _crud: AlloyCrud;
  @Input() set crud(crud: AlloyCrud){
    this._crud = crud;
  }
  modalForm: any;
  formData: any;
  addIcon: AlloyIcon;
  editIcon: AlloyIcon;
  deleteIcon: AlloyIcon;
  search: AlloyInputTextIcon[];
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() {
    this._crud = new AlloyCrud();
    this.formData = {};
    this.search = [];
    this.addIcon = new AlloyIcon({id:1,icon:"faPlus",size:"lg",spin:false,className:""});
    this.editIcon = new AlloyIcon({id:1,icon:"faEdit",size:"lg",spin:false,className:""});
    this.deleteIcon = new AlloyIcon({id:2,icon:"faTrashAlt",size:"lg",spin:false,className:""});
    this.search.push(new AlloyInputTextIcon({id:"1",name:"search",className:"input-group mb-3",typeName:"search",placeholder:"john@example.com",label:"Search..",icon:{id:1,icon:"faSearch",size:"lg",spin:false,className:""}}));

  }

  onClicked(action:Action,row?: any){
    this.modalForm = new window.bootstrap.Modal(
      document.getElementById(this._crud.modal.id)
    );
    this.modalForm.show();
  }

  capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  toString(val): string {
    return JSON.stringify(val);
  }

  get action(): typeof Action {
    return Action;
  }

  submitData() {
    this.modalForm.hide();
    this.output.emit(this.formData);
  }

  getText(text){
    this.formData = text;
  }
}
