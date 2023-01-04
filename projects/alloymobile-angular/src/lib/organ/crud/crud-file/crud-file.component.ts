import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlloyInputTextIcon } from '../../../cell/input/input.model';
import { AlloyCrudFile } from '../crud.model';
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
  search: AlloyInputTextIcon;
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() {
    this._crudFile = new AlloyCrudFile();
    this.search = new AlloyInputTextIcon({id:"1",name:"search",className:"input-group border border-dark rounded-pill",type:"search",placeholder:"john@example.com",readonly:false,label:"Search..",icon:{id:1,icon:"faSearch",size:"lg",spin:false,className:""}});
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

}
