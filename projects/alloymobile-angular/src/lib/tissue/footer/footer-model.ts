import { AlloyIconLink } from "../../cell/icon/icon.model";
import { AlloyLink, AlloyLinkLogo } from "../../cell/link/link.model";

export class AlloyFooter{
    id: string;
    title: string;
    className: string;
    logo: AlloyLinkLogo;
    link: AlloyLink[];
    social: AlloyIconLink[];
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "";
            this.title = res.title ? res.title : "";
            this.className = res.className ? res.className : "";
            this.logo =  res.logo ? new AlloyLinkLogo(res.logo) :  new AlloyLinkLogo();
            this.link = res.link ? res.link.map((link: AlloyLink)=>new AlloyLink(link)) : []; 
            this.social = res.social ? res.social.map((social: AlloyIconLink)=>new AlloyIconLink(social)) : []; 
        }else{
            this.id =  "";
            this.title = "";
            this.className = "";
            this.logo = new AlloyLinkLogo();
            this.link = [];
        }
    }
}