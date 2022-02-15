import { AppIcon } from "../icon/icon.model";

export class AppLink{
  id: number;
  name: string;
  className: string;
  link: string;
  icon: AppIcon;
  constructor(res?: any){
    if(res){
      this.id = res.id ? res.id : 0;
      this.name = res.name ? res.name : "";
      this.className = res.className ? res.className : "";
      this.link = res.link ? res.link : "./";
      this.icon = res.icon ? new AppIcon(res.icon) : new AppIcon();
    }else{
      this.id = 0;
      this.name = "Funny";
      this.className =  "";
      this.link = "./";
      this.icon = new AppIcon();
    }
  }
}
