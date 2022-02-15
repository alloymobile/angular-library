import { AppIcon } from "../icon/icon.model";

export class AppButton{
  id: number;
  name: string;
  className: string;
  icon: AppIcon;
  constructor(res?: any){
    if(res){
      this.id = res.id ? res.id : 0;
      this.name = res.name ? res.name : "";
      this.className = res.className ? res.className : "btn btn-primary m-1";
      this.icon = res.icon ? new AppIcon(res.icon) : new AppIcon();
    }else{
      this.id = 0;
      this.name = "";
      this.className =  "btn btn-primary m-1";
      this.icon = new AppIcon();
    }
  }
}
