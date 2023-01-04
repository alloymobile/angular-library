import { AlloyButtonIcon } from "../../cell/button/button.model";
import { AlloyIcon } from "../../cell/icon/icon.model";

export class Table{
    id: string;
    className: string;
    name: string;
    rows: any;
    icon: AlloyIcon;
    link: string;
    constructor(response?: any){
      if(response){
        this.id = response.id ? response.id : "";
        this.className = response.className ? response.className : "table";
        this.name = response.name ? response.name : "";
        this.rows = response.rows ? response.rows : [];
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

export class TableAction extends Table{
   actions: AlloyIcon[];
   constructor(res?){
    if(res){
      super(res);
      this.actions = res.actions ? res.actions.map(i=> new AlloyIcon(i)) : [];
    }else{
      super();
      this.actions = [];
    }
   }
}