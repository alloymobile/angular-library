
import { AlloyButtonIcon, AlloyButtonSubmit } from "../../cell/button/button.model";
import { CardItem } from "../../cell/card/card.model";
import {AlloyInputTextIcon } from "../../cell/input/input.model";

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
            this.title = "AlloyInputTextIcon";
            this.className = "col m-2";
            this.message = "";
            this.action = "";
        }
    }
}


export class AlloyForm extends Form{
    submit: AlloyButtonSubmit;
    fields: AlloyInputTextIcon[];
    data: any;
    constructor(res?: any){
        if(res){
            super(res);
            this.submit = res.submit ? new AlloyButtonSubmit(res.submit) : new AlloyButtonSubmit();
            this.fields = res.fields ? res.fields.map(f=>new AlloyInputTextIcon(f)) : [];
            this.data={};
        }else{
            super();
            this.submit = new AlloyButtonSubmit();
            this.fields = [];
            this.data = {}
        }
    }   
}

export class AlloyFormText extends Form{
    actionClass: string;
    texts: CardItem[]
    fields: AlloyInputTextIcon[];
    actions: AlloyButtonIcon[];
    data: any;
    constructor(res?: any){
        if(res){
            super(res);
            this.actionClass = res.actionClass ? res.actionClass : "row";
            this.texts = res.texts ? res.texts.map(f=>new CardItem(f)) : [];
            this.fields = res.fields ? res.fields.map(f=>new AlloyInputTextIcon(f)) : [];
            this.actions = res.actions ? res.actions.map(f=>new AlloyInputTextIcon(f)) : [];
            this.data={};
        }else{
            super();
            this.actionClass = "row";
            this.texts = [];
            this.fields = [];
            this.actions = [];
            this.data = {}
        }
    }   
}