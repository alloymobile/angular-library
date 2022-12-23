import { AlloyIcon } from "../icon/icon.model";


export class AlloyLink{
  id: string;
  name: string;
  className: string;
  link: string;
  constructor(res?: any){
    if(res){
      this.id = res.id ? res.id : "";
      this.name = res.name ? res.name : "";
      this.className = res.className ? res.className : "";
      this.link = res.link ? res.link : "./";
    }else{
      this.id = "";;
      this.name = "Funny";
      this.className =  "";
      this.link = "./";
    }
  }
}

export class AlloyIconLink extends AlloyLink{
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
