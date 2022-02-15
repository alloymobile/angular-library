import { AppLink } from "../../cell/link/link.model";

export class AppNavbar{
  id: number;
  brand: AppLink;
  pageLink: AppLink[];
  iconLink: AppLink[];
  constructor(res?: any){
    if(res){
      this.id = res.id ? res.id : 0;
      this.brand = res.brand ? new AppLink(res.brand) : new AppLink();
      this.pageLink = res.pageLink ?  res.pageLink.map(p => new AppLink(p)) : [];
      this.iconLink = res.iconLink ?  res.iconLink.map(i => new AppLink(i)) : [];
    }else{
      this.id = 0;
      this.brand = new AppLink();
      this.pageLink = [];
      this.iconLink = [];
    }
  }
}
