import { AlloyButtonSubmit } from "../../cell/button/button.model";
import { AlloyInputTextIcon } from "../../cell/input/input.model";

export class Form{
    id: string;
    title: string;
    className: string;
    message: string;
    submit: AlloyButtonSubmit;
    action: string;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.title = res.title ? res.title : "";
            this.className = res.className ? res.className : "";
            this.message = res.message ? res.message : "";
            this.submit = res.submit ? new AlloyButtonSubmit(res.submit) : new AlloyButtonSubmit();
            this.action = res.action ? res.action : "";
        }else{
            this.id =  "";
            this.title = "";
            this.className = "";
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