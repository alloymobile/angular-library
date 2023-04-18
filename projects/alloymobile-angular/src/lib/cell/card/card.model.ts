import { AlloyIcon, AlloyIconButton } from "../icon/icon.model";


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

export class AlloyCard {
    id: string;
    className: string;
    link: string;
    fields: CardItem[];
    body: CardItem;
    header: CardItem;
    footer: CardItem;
    constructor(response?: any) {
      if (response) {
        this.id = response.id ? response.id : 'card';
        this.className = response.className ? response.className : 'card border m-2 shadow';
        this.link = response.link ? response.link : '';
        this.fields = response.fields ? response.fields.map(field=>new CardItem(field)) : [];
        this.body = response.body ? new CardItem(response.body) : new CardItem();
        this.header = response.header ? new CardItem(response.header) : new CardItem();
        this.footer = response.footer ? new CardItem(response.footer) : new CardItem();
      } else {
        this.id = 'card';
        this.className = 'card border m-2 shadow';
        this.link = '';
        this.fields = [];
        this.body = new CardItem();
        this.header = new CardItem();
        this.footer = new CardItem();
      }
    }
}

export class AlloyCardAction extends AlloyCard{
  actions: AlloyIconButton[];
  constructor(res?){
   if(res){
     super(res);
     this.actions = res.actions ? res.actions.map(i=> new AlloyIconButton(i)) : [];
   }else{
     super();
     this.actions = [];
   }
  }
}


export class AlloyCardIcon extends AlloyCard {
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

export class AlloyCardIconAction extends AlloyCardIcon{
  actions: AlloyIconButton[];
  constructor(res?){
   if(res){
     super(res);
     this.actions = res.actions ? res.actions.map(i=> new AlloyIconButton(i)) : [];
   }else{
     super();
     this.actions = [];
   }
  }
}

export class AlloyCardImage extends AlloyCard {
  image: AlloyLogo;
  imageClass: string;
  constructor(response?: any) {
    if (response) {
        super(response)  
        this.image = response.image ? new AlloyLogo(response.image) :  new AlloyLogo();
        this.imageClass = response.imageClass ? response.imageClass : "card-img-top rounded p-2";
    } else {
        super()  
        this.image = new AlloyLogo();
        this.imageClass = 'card-img-top rounded p-2';
    }
  }
}

export class AlloyCardImageAction extends AlloyCardImage{
  actions: AlloyIconButton[];
  constructor(res?){
   if(res){
     super(res);
     this.actions = res.actions ? res.actions.map(i=> new AlloyIconButton(i)) : [];
   }else{
     super();
     this.actions = [];
   }
  }
}

