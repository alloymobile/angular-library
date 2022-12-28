import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyInputTextIcon } from '../../../cell/input/input.model';
import { AlloyCrud } from '../crud.model';
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
    this.createRow = [...this._crud.modal.fields]
  }
  modalForm: any;
  formData: any;
  createRow: AlloyInputTextIcon[];
  addIcon: AlloyIcon;
  editIcon: AlloyIcon;
  deleteIcon: AlloyIcon;
  search: AlloyInputTextIcon;
  //specifies the crud modals
  modalType: string;
  selectedRow: any;
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor(private cdr:ChangeDetectorRef) {
    this._crud = new AlloyCrud();
    this.formData = {};
    this.search = new AlloyInputTextIcon({id:"1",name:"search",className:"input-group border border-dark rounded-pill",type:"search",placeholder:"john@example.com",readonly:false,label:"Search..",icon:{id:1,icon:"faSearch",size:"lg",spin:false,className:""}});
    this.modalType = "";
    this.addIcon = new AlloyIcon({id:1,icon:"faPlus",size:"lg",spin:false,className:""});
    this.editIcon = new AlloyIcon({id:1,icon:"faEdit",size:"lg",spin:false,className:""});
    this.deleteIcon = new AlloyIcon({id:2,icon:"faTrashAlt",size:"lg",spin:false,className:""});
    this.createRow = [];

  }

  onClicked(action:string , row?: any){
    this.formData = {};
    this.modalType = action;
    if(row){
      this.selectedRow = row;
      this._crud.modal.fields = this.getDataType(row).map(f => new AlloyInputTextIcon(f));
    }else{
      this._crud.modal.fields = this.createRow.map(c => new AlloyInputTextIcon(c));
    }
    this.modalForm = new window.bootstrap.Modal(
      document.getElementById(this._crud.modal.id)
    );
    this.modalForm.show();
  }

  getDataType(row){
    let fields = [];
    Object.entries(row).forEach(column=>{
      let metadata = this._crud.modal.fields.find(f=>f.name === column[0])
      if(metadata != undefined){
        metadata.text = column[1].toString();
        fields.push(metadata);
      }
    });
    return fields;
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
