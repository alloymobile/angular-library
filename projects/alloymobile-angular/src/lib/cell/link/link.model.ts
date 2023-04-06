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

export class AlloyLinkIcon extends AlloyLink{
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

export class Logo{
  image: string;
  alt: string;
  width: string;
  height: string;
  constructor(res?: any){
    if(res){
      this.image = res.image ? res.image : "";
      this.alt = res.alt ? res.alt : "Alloymobile";
      this.width = res.width ? res.width : "auto";
      this.height = res.height ? res.height : "auto";
    }else{
      this.image = "";
      this.alt = "";
      this.width = "auto";
      this.height = "auto";
    }
  }
}

export class AlloyLinkLogo extends AlloyLink{
  logo: Logo;
  constructor(res?: any){
    if(res){
      super(res);
      this.logo = res.logo ? new Logo(res.logo) : new Logo();
    }else{
      super();
      this.name = "Alloymobile";
      this.logo = new Logo();
    }
  }
}