import { AlloyIcon } from "../../cell/icon/icon.model";

export class Table{
    id: string;
    className: string;
    name: string;
    rows: Row[];
    icon: AlloyIcon;
    link: string;
    constructor(response?: any){
      if(response){
        this.id = response.id ? response.id : "";
        this.className = response.className ? response.className : "table";
        this.name = response.name ? response.name : "";
        this.rows = response.rows ? response.rows.map((r) => new Row(r)) : [];
        this.icon = response.icon ? new AlloyIcon(response.icon) : new AlloyIcon();
        this.link = response.link ? response.link : "";
      }else{
        this.id = "";
        this.name = "";
        this.className = 'table';
        this.rows = [];
        this.icon = new AlloyIcon();
       this.link = "";
      }
    }
}

export class Row{
    id: string;
    name: string;
    constructor(response?: any){
      if(response){
        this.id = response.id ? response.id : "";
        this.name = response.name ? response.name : "";
      }else{
        this.id = "";
        this.name = "";
      }
    }
}

export enum Action{
  ADD,
  EDIT,
  DELETE
}

export class RowAction extends Row{
  action: Action;
  constructor(response?: any){
    if(response){
      super(response);
      this.action =  null;
    }else{
      super();
      this.action = null;
    }
  }
}