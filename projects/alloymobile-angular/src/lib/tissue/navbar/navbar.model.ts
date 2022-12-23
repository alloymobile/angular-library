import { AlloyLink,AlloyLinkIcon } from "../../cell/link/link.model";

export class NavBar {
    id: string;
    className: string;
    logo: AlloyLinkIcon;
    constructor(response?: any) {
      if (response) {
        this.id = response.id ? response.id : "";
        this.className = response.className ? response.className : '';
        this.logo =  response.logo ? new AlloyLinkIcon(response.logo) : new AlloyLinkIcon();
      } else {
        this.id = "";
        this.className = '';
        this.logo =  new AlloyLinkIcon();
      }
    }
}

export class AlloyNavBar extends NavBar {
  link: AlloyLink[];
  constructor(response?: any) {
    if (response) {
      super(response);
      this.link = response.link ? response.link.map((link: AlloyLink)=>new AlloyLink(link)) : []; 
    } else {
      super();
      this.link = [];
    }
  }
}

export class AlloyIconNavBar extends NavBar{
  linkIcon: AlloyLinkIcon[];
  constructor(response?: any) {
    if (response) {
      super(response);
      this.linkIcon = response.linkIcon ? response.linkIcon.map((linkIcon: AlloyLinkIcon)=>new AlloyLinkIcon(linkIcon)) : []; 
    } else {
      super();
      this.linkIcon = [];
    }
  }
}
