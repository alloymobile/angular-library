import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyInputText, AlloyInputTextIcon } from '../../../cell/input/input.model';
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
    this.createRow = [...this._crudFile.modalFile.files]
  }
  modalForm: any;
  createRow: AlloyInputText[];
  uploadIcon: AlloyIcon;
  deleteIcon: AlloyIcon;
  search: AlloyInputTextIcon;
  selectedRow: any;
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() {
    this._crudFile = new AlloyCrudFile();
    this.search = new AlloyInputTextIcon({id:"1",name:"search",className:"input-group border border-dark rounded-pill",type:"search",placeholder:"john@example.com",readonly:false,label:"Search..",icon:{id:1,icon:"faSearch",size:"lg",spin:false,className:""}});
    this.uploadIcon = new AlloyIcon({id:1,icon:"faUpload",size:"lg",spin:false,className:""});
    this.deleteIcon = new AlloyIcon({id:2,icon:"faTrashAlt",size:"lg",spin:false,className:""});
    this.createRow = [];
  }

  onAddClicked(action:string){
    this._crudFile.modalFile.files = this.createRow.map(c => new AlloyInputText(c));
    this._crudFile.modalFile.data = [];
    this._crudFile.modalFile.action = action;
    this.modalForm = new window.bootstrap.Modal(
      document.getElementById(this._crudFile.modalFile.id)
    );
    this.modalForm.show();
  }

  onDeleteClicked(action:string,row){
    this.selectedRow = row;
    this._crudFile.modalToast.action = action;
    this.modalForm = new window.bootstrap.Modal(
      document.getElementById(this._crudFile.modalToast.id)
    );
    this.modalForm.show();
  }

  onFileClicked(action:string,row){
    let data = {...row}
    data["action"]= action;
    this.output.emit(data);
  }

  onSearchClick(text){
    let data = {...text}
    data["action"]="Search";
    this.output.emit(data);
  }

  capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  submitData(files?: any) {
    this.modalForm.hide();
    if(files){
      if(this._crudFile.modalFile.action === 'Add' ){
        this.output.emit(files);
      }
    }else{
      if(this._crudFile.modalToast.action === 'Delete'){
        let data = {...this.selectedRow};
        data["action"]=this._crudFile.modalToast.action;
        this.output.emit(data);
      }
    }
  }
}
