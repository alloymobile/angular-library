import { AlloyLink,AlloyIconLink } from "../../cell/link/link.model";

export class NavBar {
    id: string;
    className: string;
    logo: AlloyIconLink;
    constructor(response?: any) {
      if (response) {
        this.id = response.id ? response.id : "";
        this.className = response.className ? response.className : '';
        this.logo =  response.logo ? new AlloyIconLink(response.logo) : new AlloyIconLink();
      } else {
        this.id = "";
        this.className = '';
        this.logo =  new AlloyIconLink();
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
  iconLink: AlloyIconLink[];
  constructor(response?: any) {
    if (response) {
      super(response);
      this.iconLink = response.iconLink ? response.iconLink.map((iconLink: AlloyIconLink)=>new AlloyIconLink(iconLink)) : []; 
    } else {
      super();
      this.iconLink = [];
    }
  }
}
