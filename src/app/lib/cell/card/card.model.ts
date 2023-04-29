import { AlloyIcon} from "../icon/icon.model";
import { AlloyButton, AlloyButtonIcon} from "../button/button.model";


export class CardItem {
  id: string;
  name: string;
  className: string;
  constructor(response?: any) {
    if (response) {
      this.id = response.id ? response.id : 'cardItem';
      this.className = response.className ? response.className : '';
      this.name = response.name ? response.name : 'Card Item';
    } else {
      this.id = 'cardItem';
      this.className = '';
      this.name = 'Card Item'
    }
  }
}

export class AlloyLogo{
  imageUrl: string;
  alt: string;
  width: string;
  height: string;
  constructor(res?: any){
    if(res){
      this.imageUrl = res.imageUrl ? res.imageUrl : "https://alloymobile.blob.core.windows.net/alloymobile/alloymobile.png";
      this.alt = res.alt ? res.alt : "Alloymobile";
      this.width = res.width ? res.width : "auto";
      this.height = res.height ? res.height : "auto";
    }else{
      this.imageUrl = "https://alloymobile.blob.core.windows.net/alloymobile/alloymobile.png";
      this.alt = "Alloymobile";
      this.width = "72";
      this.height = "auto";
    }
  }
}

export class Card{
  id: string;
  className: string;
  body: CardItem;
  fields: CardItem[];
  constructor(response?: any) {
    if (response) {
      this.id = response.id ? response.id : 'card';
      this.className = response.className ? response.className : 'card border m-2 shadow';
      this.body = response.body ? new CardItem(response.body) : new CardItem();
      this.fields = response.fields ? response.fields.map(field=>new CardItem(field)) : [];
    } else {
      this.id = 'card';
      this.className = 'card border m-2 shadow';
      this.body = new CardItem();
      this.fields = [];
    }
  }
}

export class AlloyCard extends Card{
    link: string;
    constructor(response?: any) {
      if (response) {
        super(response);
        this.link = response.link ? response.link : '';
      } else {
        super();
        this.link = '';
      }
    }
}

export class AlloyCardAction extends Card{
  footer: CardItem;
  actions: AlloyButton[];
  type: string
  constructor(res?){
   if(res){
     super(res);
     this.type = res.type ? res.type : "AlloyButton";
     this.footer = res.footer ? new CardItem(res.footer) : new CardItem();
     switch(this.type){
      case "AlloyButton":
        this.actions = res.actions ? res.actions.map(i=> new AlloyButton(i)) : [];
        break;
      case "AlloyButtonIcon":
      case "AlloyIconButton":
        this.actions = res.actions ? res.actions.map(i=> new AlloyButtonIcon(i)) : [];
        break;  
      default:
        this.actions = res.actions ? res.actions.map(i=> new AlloyButton(i)) : [];
        break;
     }
   }else{
     super();
     this.type = "AlloyButton";
     this.footer = new CardItem();
     this.actions = [];
   }
  }
}


export class AlloyCardIcon extends AlloyCard {
  icon: AlloyIcon;
  iconClass: string;
  textClass: string;
  constructor(response?: any) {
    if (response) {
        super(response)  
        this.icon = response.icon ? new AlloyIcon(response.icon) : new AlloyIcon();
        this.iconClass = response.iconClass ? response.iconClass : 'col-4 icon-lg rounded-circle bg-warning text-white mb-0';
        this.textClass = response.textClass ? response.textClass : 'col-8';
    } else {
        super()  
        this.iconClass = 'icon-lg rounded-circle bg-warning text-white mb-0';
        this.icon = new AlloyIcon();
        this.textClass = 'col-8';
    }
  }
}

export class AlloyCardIconAction extends AlloyCardAction{
  icon: AlloyIcon;
  iconClass: string;
  textClass: string;
  constructor(res?){
   if(res){
     super(res);
     this.icon = res.icon ? new AlloyIcon(res.icon) : new AlloyIcon();
     this.iconClass = res.iconClass ? res.iconClass : 'col-4 icon-lg rounded-circle bg-warning text-white mb-0';
     this.textClass = res.textClass ? res.textClass : 'col-8';
   }else{
     super();
     this.iconClass = 'icon-lg rounded-circle bg-warning text-white mb-0';
     this.icon = new AlloyIcon();
     this.textClass = 'col-8';
   }
  }
}

export class AlloyCardImage extends AlloyCard {
  image: AlloyLogo;
  imageClass: string;
  textClass: string;
  constructor(response?: any) {
    if (response) {
        super(response)  
        this.image = response.image ? new AlloyLogo(response.image) :  new AlloyLogo();
        this.imageClass = response.imageClass ? response.imageClass : "card-img-top rounded p-2";
        this.textClass = response.textClass ? response.textClass : 'col-8';
    } else {
        super()  
        this.image = new AlloyLogo();
        this.imageClass = 'card-img-top rounded p-2';
        this.textClass = 'col-8';
    }
  }
}

export class AlloyCardImageAction extends AlloyCardAction{
  image: AlloyLogo;
  imageClass: string;
  textClass: string;
  constructor(response?: any) {
    if (response) {
        super(response)  
        this.image = response.image ? new AlloyLogo(response.image) :  new AlloyLogo();
        this.imageClass = response.imageClass ? response.imageClass : "card-img-top rounded p-2";
        this.textClass = response.textClass ? response.textClass : 'col-8';
    } else {
        super()  
        this.image = new AlloyLogo();
        this.imageClass = 'card-img-top rounded p-2';
        this.textClass = 'col-8';
    }
  }
}
