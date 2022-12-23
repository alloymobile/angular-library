import { AlloyIcon} from "../icon/icon.model";

export class AlloyButton{
  id: string;
  name: string;
  className: string;
  constructor(res?: any){
    if(res){
      this.id = res.id ? res.id : "";
      this.name = res.name ? res.name : "";
      this.className = res.className ? res.className : "btn btn-primary m-1";
    }else{
      this.id = "";
      this.name = "";
      this.className =  "btn btn-primary m-1";
    }
  }
}

export class AlloyButtonIcon extends AlloyButton{
  icon: AlloyIcon;
  constructor(res?: any){
    if(res){
      super(res);
      this.icon = res.icon ? new AlloyIcon(res.icon) : new AlloyIcon();
    }else{
      super();
     this.icon = new AlloyIcon();
    }
  }
}