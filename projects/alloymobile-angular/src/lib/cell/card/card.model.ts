import { AlloyIcon } from "../icon/icon.model";
import { AlloyLink } from "../link/link.model";


export class Card {
    id: string;
    className: string;
    name: AlloyLink;
    constructor(response?: any) {
      if (response) {
        this.id = response.id ? response.id : '';
        this.className = response.className ? response.className : 'card border m-2 shadow';
        this.name = response.name ? new AlloyLink(response.name) : new AlloyLink();
      } else {
        this.id = '';
        this.className = 'card border m-2 shadow';
        this.name = new AlloyLink();
      }
    }
}

export class AlloyCardImage extends Card {
  imageUrl: String;
  imageClass: string;
  constructor(response?: any) {
    if (response) {
        super(response)  
        this.imageUrl = response.imageUrl ? response.imageUrl : "";
        this.imageClass = response.imageClass ? response.imageClass : "card-img-top rounded p-2";
    } else {
        super()  
        this.imageUrl = "";
        this.imageClass = 'card-img-top rounded p-2';
    }
  }
}


export class AlloyCardIcon extends Card {
  icon: AlloyIcon;
  iconClass: string;
  constructor(response?: any) {
    if (response) {
        super(response)  
        this.icon = response.icon ? new AlloyIcon(response.icon) : new AlloyIcon();
        this.iconClass = response.iconClass ? response.iconClass : 'icon-lg rounded-circle bg-warning text-white mb-0';
    } else {
        super()  
        this.iconClass = 'icon-lg rounded-circle bg-warning text-white mb-0';
        this.icon = new AlloyIcon();
    }
  }
}



export class AlloyCardDashboard extends AlloyCardIcon {
  count: number;
  constructor(response?: any) {
    if (response) {
        super(response)  
        this.count = response.count ? response.count : 0;
    } else {
        super()  
        this.count = 0;
    }
  }
}


