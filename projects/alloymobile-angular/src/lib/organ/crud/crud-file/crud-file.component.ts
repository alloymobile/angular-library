import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyInputTextIcon } from '../../../cell/input/input.model';
import { AlloyCrudFile } from '../crud.model';
declare var window: any;
@Component({
  selector: 'alloy-crud-file',
  templateUrl: './crud-file.component.html',
  styleUrls: ['./crud-file.component.css']
})
export class CrudFileComponent  {
  _crudFile: AlloyCrudFile;
  @Input() set crudFile(crudFile: AlloyCrudFile){
    this._crudFile = crudFile;
  }
  modalForm: any;
  formData: any;
  uploadIcon: AlloyIcon;
  deleteIcon: AlloyIcon;
  search: AlloyInputTextIcon;
  //specifies the crudFile modals
  modalType: string;
  selectedRow: any;
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() {
    this._crudFile = new AlloyCrudFile();
    this.formData = {};
    this.search = new AlloyInputTextIcon({id:"1",name:"search",className:"input-group border border-dark rounded-pill",type:"search",placeholder:"john@example.com",readonly:false,label:"Search..",icon:{id:1,icon:"faSearch",size:"lg",spin:false,className:""}});
    this.modalType = "";
    this.uploadIcon = new AlloyIcon({id:1,icon:"faUpload",size:"lg",spin:false,className:""});
    this.deleteIcon = new AlloyIcon({id:2,icon:"faTrashAlt",size:"lg",spin:false,className:""});

  }

  onClicked(action:string,row?: any){
    this.formData = {};
    this.modalType = action;
    if(row){
      this.selectedRow = row;
    }
    if(action=="Add"){
      this.modalForm = new window.bootstrap.Modal(
        document.getElementById(this._crudFile.modal.id)
      );
      this.modalForm.show();
    }else if(action=="Delete"){
      this.modalForm = new window.bootstrap.Modal(
        document.getElementById("DeleteModal")
      );
      this.modalForm.show();
    }else if(action=="Select"){
      let data = {...row}
      data["action"]= action;
      this.output.emit(data);
    }
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
    if(this.modalType === 'Add' ){
        this.output.emit(this.formData);
    }else if(this.modalType === 'Delete'){
      this.formData = this.selectedRow;
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
