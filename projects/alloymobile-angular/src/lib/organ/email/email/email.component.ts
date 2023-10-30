import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloyEmail } from '../email.model';
import { AbstractControl } from '@angular/forms';
import { AlloyInputType } from '../../../cell/input/input.model';
declare var window: any;

@Component({
  selector: 'alloy-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent {

  _email: AlloyEmail;
  @Input() set email(email: AlloyEmail){
    this._email = email;
    this.createRow = [...this._email.modal.fields] as any;
  }
  modalForm: any;
  createRow: AlloyInputType[];
  selectedRow: any;
  @Output() output: EventEmitter<AbstractControl<any,any>> = new EventEmitter<AbstractControl<any,any>>();

  constructor() {
    this._email = new AlloyEmail();
    this.createRow = [];
  }

  onClicked(data: any){
    this._email.modal.action = data.action;
    this._email.modal.submit.name = data.action;
    if(data.action == "Send"){
      this._email.modal.fields = [...this.createRow.map(c => new AlloyInputType(c))];
    }else if(data.action == "Reply"){
      if(data.row){
        this.selectedRow = data.row;
        this._email.modal.fields = [...this.getReplyDataType(data.row).map(f => new AlloyInputType(f))];
      }
    }else if(data.action == "Delete"){
      if(data.row){
        this.selectedRow = data.row;
        this._email.modal.fields = [...this.getDataType(data.row).map(f => new AlloyInputType(f))];
        this._email.modal.fields.map((f: any) => f.readonly = true);
      }
    }
    this._email.modal.data = {};
    this.modalForm = new window.bootstrap.Modal(
      document.getElementById(this._email.modal.id)
    );
    this.modalForm.show();
  }

  getReplyDataType(row){
    let fields = [];
    Object.entries(row).forEach(column=>{
      let metadata = this._email.modal.fields.find((f: any)=>f.name === column[0]) as any;
      if(metadata != undefined){
        if(metadata.name == "message"){
          metadata.text = "";
        }else{
          metadata.text = column[1].toString();
        }
        fields.push(metadata);
      }
    });
    return fields;
  }

  getDataType(row){
    let fields = [];
    Object.entries(row).forEach(column=>{
      let metadata = this._email.modal.fields.find((f: any)=>f.name === column[0]) as any;
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

  //The input event will only trigger if there is a change
  //for delete the is no change so we have two step
  submitData(data) {
    this.modalForm.hide();
    if(data.action === 'Send'){
      this.output.emit(data);
    }else if(data.action === 'Reply'){
      if(Object.keys(data).length > 1){
        data["id"]=this.selectedRow.id;
        this.output.emit(data);
      }
    }else if(data.action === 'Delete'){
      let data = {...this.selectedRow}
      data["action"]='Delete';
      this.output.emit(data);
    }
  }

  getSearch(text){
    let data = {...text}
    data["action"]="Search";
    this.output.emit(data);
  }
}
