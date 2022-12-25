import { AlloyButtonIcon } from "../../cell/button/button.model";
import { AlloyInputTextIcon } from "../../cell/input/input.model";

export class AlloyModal{
    id: string;
    title: string;
    fields: AlloyInputTextIcon[];
    open: boolean;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.title = res.title ? res.title : "";
            this.fields = res.fields ? res.fields.map(f=>new AlloyInputTextIcon(f)) : [];
            this.open = false;
        }else{
            this.id =  "";
            this.title = "";
            this.fields = [];
            this.open = false;
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