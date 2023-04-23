import { AlloyButtonIcon } from "../../cell/button/button.model";
import { AlloyLinkIcon, AlloyLink } from "../../cell/link/link.model";

export class Nav{
    id: string;
    className: string;
    selected: string;
    constructor(response?: any){
      if(response){
        this.id = response.id ? response.id : "alloyNav";
        this.className = response.className ? response.className : "nav nav-pills nav-fill";
        this.selected = response.selected ? response.selected : "";
      }else{
        this.id = "alloyNav";
        this.className = 'nav nav-pills nav-fill';
        this.selected = "";
      }
    }
}

export class AlloyTabButton extends Nav {
    tabs: AlloyButtonIcon[];
    constructor(response?: any){
      if(response){
        super(response);
        this.tabs = response.tabs ? response.tabs.map(n => new AlloyButtonIcon(n)) : [];
        if(this.tabs.length > 0){
            this.tabs[0].active = this.selected;
        }
      }else{
        super();
        this.tabs = [];
      }
    }
}
  
export class AlloyTabLink extends Nav {
    tabs: AlloyLinkIcon[];
    constructor(response?: any){
      if(response){
        super(response)
        this.tabs = response.tabs ? response.tabs.map(n => new AlloyLinkIcon(n)) : [];
        if(this.tabs.length > 0){
          this.tabs[0].active = this.selected;
        }
      }else{
        super();
        this.tabs = [];
      }
    }
}
  
export class AlloySideBar extends Nav {
    close: string;
    link: AlloyLink[];
  constructor(response?: any) {
    if (response) {
      super(response);
      this.close = response.close ? response.close : '';
      this.link = response.link ? response.link.map((link: AlloyLink)=>new AlloyLink(link)) : []; 
    } else {
      super();
      this.close = '';
      this.link = [];
    }
  }
}


export class AlloyIconSideBar extends Nav  {
    close: string;
    linkIcon: AlloyLinkIcon[];
  constructor(response?: any) {
    if (response) {
      super(response);
      this.close = response.close ? response.close : '';
      this.linkIcon = response.linkIcon ? response.linkIcon.map((linkIcon: AlloyLinkIcon)=>new AlloyLinkIcon(linkIcon)) : []; 
    } else {
      super();
      this.close = '';
      this.linkIcon = [];
    }
  }
}

