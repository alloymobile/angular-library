import { AlloyIcon } from "../icon/icon.model";


export class Card {
    id: string;
    className: string;
    name: string;
    nameClass: string;
    icon: AlloyIcon;
    iconClass: string;
    constructor(response?: any) {
      if (response) {
        this.id = response.id ? response.id : '';
        this.className = response.className ? response.className : 'card card-body bg-warning bg-opacity-15 p-4 h-100';
        this.name = response.name ? response.name : 'Compleared cources';
        this.nameClass = response.nameClass ? response.nameClass : 'icon-lg rounded-circle bg-warning text-white mb-0';
        this.icon = response.icon ? new AlloyIcon(response.icon) : new AlloyIcon();
        this.iconClass = response.iconClass ? response.iconClass : 'icon-lg rounded-circle bg-warning text-white mb-0';
      } else {
        this.id = '';
        this.className = 'card card-body bg-warning bg-opacity-15 p-4 h-100';
        this.name = 'Compleated course';
        this.iconClass = 'icon-lg rounded-circle bg-warning text-white mb-0';
        this.icon = new AlloyIcon();
      }
    }
}
  


export class AlloyCardDashboard extends Card {
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
