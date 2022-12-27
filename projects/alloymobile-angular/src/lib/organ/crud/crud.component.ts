import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlloyIcon } from '../../cell/icon/icon.model';
import { AlloyInputTextIcon } from '../../cell/input/input.model';
import { AlloyCrud } from './crud.model';
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
    this.createRow = {...this._crud.modal.row}
  }
  modalForm: any;
  formData: any;
  createRow: any;
  addIcon: AlloyIcon;
  editIcon: AlloyIcon;
  deleteIcon: AlloyIcon;
  search: AlloyInputTextIcon[];
  //specifies the crud modals
  modalType: string;
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() {
    this._crud = new AlloyCrud();
    this.formData = {};
    this.search = [];
    this.modalType = "";
    this.addIcon = new AlloyIcon({id:1,icon:"faPlus",size:"lg",spin:false,className:""});
    this.editIcon = new AlloyIcon({id:1,icon:"faEdit",size:"lg",spin:false,className:""});
    this.deleteIcon = new AlloyIcon({id:2,icon:"faTrashAlt",size:"lg",spin:false,className:""});
    this.search.push(new AlloyInputTextIcon({id:"1",name:"search",className:"input-group",typeName:"search",placeholder:"john@example.com",label:"Search..",icon:{id:1,icon:"faSearch",size:"lg",spin:false,className:""}}));

  }

  onClicked(action:string , row?: any){
    this.formData = {};
    this.modalType = action;
    if(row){
      this._crud.modal.row = row;
    }else{
      this._crud.modal.row = this.createRow;
    }
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

  submitData() {
    this.modalForm.hide();
    if(this.modalType === 'Add' ||this.modalType === 'Edit' ){
      if(Object.keys(this.formData).length > 0){
        let data = {...this.formData}
        data["action"]=this.modalType;
        this.output.emit(data);
      }
    }else if(this.modalType === 'Delete'){
      this.formData = this._crud.modal.row;
      let data = {...this.formData}
      data["action"]=this.modalType;
      this.output.emit(data);
    }
  }

  getText(text){
    this.formData = text;
  }

  getSearch(text){
    let data = {...text}
    data["action"]="Search";
    this.output.emit(data);
  }
}
