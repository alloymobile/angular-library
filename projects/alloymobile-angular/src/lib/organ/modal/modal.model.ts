import { AlloyButton, AlloyButtonIcon } from "../../cell/button/button.model";
import { AlloyInputTextIcon } from "../../cell/input/input.model";

export class Modal{
    id: string;
    title: string;
    className: string;
    submit: AlloyButton;
    action: string;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.title = res.title ? res.title : "";
            this.className = res.className ? res.className : "modal fade";
            this.submit = res.submit ? new AlloyButton(res.submit) : new AlloyButton();
            this.action = res.action ? res.action : "";
        }else{
            this.id =  "";
            this.title = "";
            this.className = "modal fade";
            this.submit = new AlloyButton();
            this.action = "";
        }
    }
}

export class AlloyModalToast extends Modal{
    message: string;
    constructor(res?: any){
        if(res){
            super(res);
            this.message = res.message ?  res.message :'';

        }else{
            super();
            this.message = '';
        }
    }
}


export class AlloyModalFile extends Modal{
    file: AlloyInputTextIcon;
    constructor(res?: any){
        if(res){
            super(res);
            this.file = res.file ?  new AlloyInputTextIcon(res.file) : new AlloyInputTextIcon();
        }else{
            super();
            this.file = new AlloyInputTextIcon();
        }
    }
}


export class AlloyModal extends Modal{
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

export class AlloyModalButton extends AlloyModal{
    show: AlloyButtonIcon;
    constructor(res?: any){
        if(res){
            super(res);
            this.show = res.show ?  new AlloyButtonIcon(res.show) : new AlloyButtonIcon();

        }else{
            super();
            this.show = new AlloyButtonIcon();
        }
    }
}