import { AlloyButtonIcon } from "../../cell/button/button.model";
import { AlloyInputTextIcon } from "../../cell/input/input.model";

export class AlloyModal{
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

export class AlloyModalButton extends AlloyModal{
    fields: AlloyInputTextIcon[];
    show: AlloyButtonIcon;
    constructor(res?: any){
        if(res){
            super(res);
            this.show = res.show ?  new AlloyButtonIcon(res.show) : new AlloyButtonIcon();
            this.fields = res.fields ? res.fields.map(f=>new AlloyInputTextIcon(f)) : [];
        }else{
            super();
            this.show = new AlloyButtonIcon();
            this.fields = [];
        }
    }
}

export class AlloyInputModal extends AlloyModal{
    row: any;
    constructor(res?: any){
        if(res){
            super(res);
            this.row = res.row;
        }else{
            super();
            this.row = {};
        }
    }
}