import { AlloyButtonIcon } from "../../cell/button/button.model";
import { AlloyInputTextIcon } from "../../cell/input/input.model";

export class AlloyModal{
    id: string;
    title: string;
    action: Action;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.title = res.title ? res.title : "";
            this.action = res.action ? AlloyModal.getWorkAction(res.action) : Action.ADD;
        }else{
            this.id =  "";
            this.title = "";
        }
    }

    static getWorkAction(action: string){
        switch (action){
          case "add":
            return Action.ADD;
          case "edit":
            return Action.EDIT;
          case "delete":
            return Action.DELETE;
          default:
            return Action.ADD;
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

export enum Action{
    ADD,
    EDIT,
    DELETE
}