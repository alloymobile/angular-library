import { AlloyIcon} from "../icon/icon.model";

export class AlloyButton{
  id: string;
  name: string;
  type: string;
  className: string;
  active: string;
  constructor(res?: any){
    if(res){
      this.id = res.id ? res.id : "button";
      this.name = res.name ? res.name : "Submit";
      this.type = res.type ? res.type : 'button';
      this.className = res.className ? res.className : "w-100 btn btn-lg btn-info mt-1";
      this.active = res.active ? res.active : "";
    }else{
      this.id = "button";
      this.name = "Submit";
      this.type = 'button';
      this.className =  "w-100 btn btn-lg btn-info mt-1";
      this.active = "";
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

export class AlloyButtonSubmit extends AlloyButtonIcon{
  show: boolean;
  disable: boolean;
  constructor(res?: any){
    if(res){
      super(res);
      this.show = res.show ? res.show : false;
      this.disable = res.disable ? res.disable : false;
    }else{
      super();
      this.show = false;
      this.disable = false;
    }
  }
}
