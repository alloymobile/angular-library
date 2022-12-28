import { AlloyButtonIcon } from "../../cell/button/button.model";
import { AlloyInputTextIcon } from "../../cell/input/input.model";

export class Modal{
    id: string;
    title: string;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.title = res.title ? res.title : "";
        }else{
            this.id =  "";
            this.title = "";
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
    constructor(res?: any){
        if(res){
            super(res);
            this.fields = res.fields ? res.fields.map(f=>new AlloyInputTextIcon(f)) : [];
        }else{
            super();
            this.fields = [];
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