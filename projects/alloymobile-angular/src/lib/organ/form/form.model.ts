
import { AlloyButtonSubmit } from "../../cell/button/button.model";
import {AlloyInputType } from "../../cell/input/input.model";

export class Form{
    id: string;
    title: string;
    className: string;
    message: string;
    type: string;
    action: string;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "form";
            this.title = res.title ? res.title : "AlloyMobile";
            this.type = res.type ? res.type : "AlloyInputTextIcon";
            this.className = res.className ? res.className : "col m-2";
            this.message = res.message ? res.message : "";
            this.action = res.action ? res.action : "";
        }else{
            this.id =  "form";
            this.title = "AlloyMobile";
            this.type = "AlloyInputTextIcon";
            this.className = "col m-2";
            this.message = "";
            this.action = "";
        }
    }
}


export class AlloyForm extends Form{
    submit: AlloyButtonSubmit;
    fields: AlloyInputType[];
    data: any;
    constructor(res?: any){
        if(res){
            super(res);
            this.submit = res.submit ? new AlloyButtonSubmit(res.submit) : new AlloyButtonSubmit();
            this.fields = res.fields ? res.fields.map(f=>new AlloyInputType(f)) : [];
            this.data={};
        }else{
            super();
            this.submit = new AlloyButtonSubmit();
            this.fields = [];
            this.data = {}
        }
    }   
}