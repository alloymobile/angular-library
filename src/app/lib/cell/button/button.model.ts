import { AlloyIcon} from "../icon/icon.model";

export class Button{
  id: string;
  name: string;
  type: string;
  className: string;
  constructor(res?: any){
    if(res){
      this.id = res.id ? res.id : "button";
      this.name = res.name ? res.name : "Submit";
      this.type = res.type ? res.type : 'button';
      this.className = res.className ? res.className : "w-100 btn btn-lg btn-info mt-1";
    }else{
      this.id = "button";
      this.name = "Submit";
      this.type = 'button';
      this.className =  "w-100 btn btn-lg btn-info mt-1";
    }
  }
}


export class AlloyButton extends Button{
  active: string;
  constructor(res?: any){
    if(res){
      super(res);
      this.active = res.active ? res.active : "";
    }else{
      super();
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

export class AlloyButtonSubmit extends Button{
  icon: AlloyIcon;
  show: boolean;
  disable: boolean;
  constructor(res?: any){
    if(res){
      super(res);
      this.icon = res.icon ? new AlloyIcon(res.icon) : new AlloyIcon();
      this.show = res.show ? res.show : false;
      this.disable = res.disable ? res.disable : false;
    }else{
      super();
      this.icon = new AlloyIcon();
      this.show = false;
      this.disable = false;
    }
  }
}
