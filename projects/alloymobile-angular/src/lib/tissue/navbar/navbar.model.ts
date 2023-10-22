import { AlloyLinkLogo } from "../../cell/link/link.model";
import { AlloyButtonBar, AlloyLinkBar } from "../bar/bar.model";

export class AlloyNavBar {
  id: string;
  className: string;
  logo: AlloyLinkLogo;
  linkBar: AlloyLinkBar;
  static idGenerator: number = 0;
  constructor(response?: any) {
    if (response) {
      this.id = response.id ? response.id : "navbar" + ++AlloyNavBar.idGenerator;;
      this.className = response.className ? response.className : 'navbar-light';
      this.logo =  response.logo ? new AlloyLinkLogo(response.logo) :  new AlloyLinkLogo();
      this.linkBar = response.linkBar ? new AlloyLinkBar(response.linkBar) : new AlloyLinkBar(); 
    } else {
      this.id = "navbar";
      this.className = 'navbar-light';
      this.logo = new AlloyLinkLogo();
      this.linkBar =  new AlloyLinkBar();
    }
  }
}

export class AlloyNavBarAction extends AlloyNavBar {
  buttonBar: AlloyButtonBar;
  static idGenerator: number = 0;
  constructor(response?: any) {
    if (response) {
      super(response)
      this.buttonBar = response.buttonBar ? new AlloyButtonBar(response.buttonBar) : new AlloyButtonBar(); 
    } else {
      super();
      this.buttonBar =  new AlloyButtonBar();
    }
  }
}


