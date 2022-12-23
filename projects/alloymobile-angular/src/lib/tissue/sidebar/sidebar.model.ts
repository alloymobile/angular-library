import { AlloyLinkIcon, AlloyLink } from "../../cell/link/link.model";

export class SideBar {
    id: string;
    className: string;
    constructor(response?: any) {
      if (response) {
        this.id = response.id ? response.id : "";
        this.className = response.className ? response.className : '';
      } else {
        this.id = "";
        this.className = '';
      }
    }
}
  

export class AlloySideBar extends SideBar {
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


export class AlloyIconSideBar extends SideBar  {
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
