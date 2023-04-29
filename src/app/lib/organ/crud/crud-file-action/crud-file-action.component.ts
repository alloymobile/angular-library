import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { AlloyIcon } from '../../../lib/cell/icon/icon.model';
import { AlloyInputText, AlloyInputTextIcon } from '../../../lib/cell/input/input.model';
import { AlloyCrudFileAction } from '../crud.model';
declare var window: any;

@Component({
  selector: 'alloy-crud-file-action',
  templateUrl: './crud-file-action.component.html',
  styleUrls: ['./crud-file-action.component.css']
})
export class CrudFileActionComponent  {
  _crudFileAction: AlloyCrudFileAction;
  @Input() set crudFileAction(crudFileAction: AlloyCrudFileAction){
    this._crudFileAction = crudFileAction;
    this.createRow = {...this._crudFileAction.modalFile.file}
  }
  modalForm: any;
  createRow: AlloyInputText;
  downloadIcon: AlloyIcon;
  uploadIcon: AlloyIcon;
  deleteIcon: AlloyIcon;
  search: AlloyInputTextIcon;
  selectedRow: any;
  selectedRows: any;
  checked: boolean
  @Output() output: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    this._crudFileAction = new AlloyCrudFileAction();
    this.search = new AlloyInputTextIcon({id:"1",name:"search",className:"input-group border border-dark rounded-pill",type:"search",placeholder:"john@example.com",readonly:false,label:"Search..",icon:{id:1,icon:"faSearch",size:"lg",spin:false,className:""}});
    this.downloadIcon = new AlloyIcon({id:1,icon:"faDownload",size:"lg",spin:false,className:""});
    this.uploadIcon = new AlloyIcon({id:1,icon:"faUpload",size:"lg",spin:false,className:""});
    this.deleteIcon = new AlloyIcon({id:2,icon:"faTrashAlt",size:"lg",spin:false,className:""});
    this.createRow = new AlloyInputText();
    this.selectedRows = [];
    this.checked = false;
  }

  onClicked(action:string){
    if(action === "Add"){
      this._crudFileAction.modalFile.file = this.createRow;
      this._crudFileAction.modalFile.action = action;
      this.modalForm = new window.bootstrap.Modal(
        document.getElementById(this._crudFileAction.modalFile.id)
      );
      this.modalForm.show();
    }else if(action === "Download"){
      let data = {rows:[],action:""};
      data["rows"] = [...this.selectedRows] 
      data["action"]= action;
      this.output.emit(data);
    }
  }

  onDeleteClicked(action:string,row){
    this.selectedRow = row;
    this._crudFileAction.modalToast.action = action;
    this.modalForm = new window.bootstrap.Modal(
      document.getElementById(this._crudFileAction.modalToast.id)
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

  onSelectedRow(e){
    if(this.selectedRows.length === 0){
      this.selectedRows.push(e);
    }else{
       const index = this.selectedRows.findIndex(x => x.id === e.id);
       if(index == -1){
        this.selectedRows.push(e);
       }else{
        this.selectedRows.splice(index,1);
       }
    }
    if(this.selectedRows.length === this._crudFileAction.table.rows.length){
      this.checked = true;
    }else{
      this.checked = false;
    }
  }

  onSelectAll(){
    this.checked = !this.checked;
    if(this.checked){
      this._crudFileAction.table.rows.forEach(r=>r.checked = true);
      this.selectedRows = [...this._crudFileAction.table.rows];
    }else{
      this._crudFileAction.table.rows.forEach(r=>r.checked = false);
      this.selectedRows = [];
    }
  }

  capitalize(s) {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  submitData(files?: any) {
    this.modalForm.hide();
    if(files){
      if(this._crudFileAction.modalFile.action === 'Add' ){
        let data = {rows:[],action:""};
        data.rows = [...files];
        data["action"]=this._crudFileAction.modalFile.action;
        this.output.emit(data);
      }
    }else{
      if(this._crudFileAction.modalToast.action === 'Delete'){
        let data = {...this.selectedRow};
        data["action"]=this._crudFileAction.modalToast.action;
        this.output.emit(data);
      }
    }
  }
}
