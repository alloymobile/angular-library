import { AlloyButtonSubmit } from "../../cell/button/button.model";
import {AlloyInputTextIcon } from "../../cell/input/input.model";

export class Form{
    id: string;
    title: string;
    className: string;
    message: string;
    submit: AlloyButtonSubmit;
    action: string;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "form";
            this.title = res.title ? res.title : "AlloyMobile";
            this.className = res.className ? res.className : "col m-2";
            this.message = res.message ? res.message : "";
            this.submit = res.submit ? new AlloyButtonSubmit(res.submit) : new AlloyButtonSubmit();
            this.action = res.action ? res.action : "";
        }else{
            this.id =  "form";
            this.title = "AlloyMobile";
            this.className = "col m-2";
            this.message = "";
            this.submit = new AlloyButtonSubmit();
            this.action = "";
        }
    }
}


export class AlloyForm extends Form{
    fields: AlloyInputTextIcon[];
    data: any;
    constructor(res?: any){
        if(res){
            super(res);
            this.fields = res.fields ? res.fields.map(f=>new AlloyInputTextIcon(f)) : [];
            this.data={};
        }else{
            super();
            this.fields = [];
            this.data = {}
        }
    }
}