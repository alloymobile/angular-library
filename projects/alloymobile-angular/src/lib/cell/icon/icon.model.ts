import { IconDefinition, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { faApple, faFacebook, faGoogle, faInstagram, faLinkedin, faMicrosoft, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faAddressCard, faArrowLeftLong, faAt, faBars, faBlog, faBorderAll, faCamera, faChalkboardTeacher, faDashboard, faDollarSign, faDownload, faEdit, faEnvelope, faEnvelopeOpenText, faFilePdf, faFolder, faHome, faIcons, faKeyboard, faLink, faList, faLocation, faLock, faPhoneAlt, faPlus, faRightToBracket, faSearch, faSpinner, faTh, faToggleOff, faTrashAlt, faUpload, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';

export class AlloyIcon{
  id: string;
  icon: IconDefinition;
  size: SizeProp;
  spin: boolean;
  className: string;
  constructor(res?: any){
    if(res){
      this.id = res.id ? res.id : "icon1";
      this.icon = res.icon ? AlloyIcon.getIcon(res.icon) : AlloyIcon.getIcon("faMicrochip");
      this.size = res.size ? AlloyIcon.getSizeProp(res.size) : AlloyIcon.getSizeProp("lg");
      this.spin = res.spin ? res.spin : false;
      this.className = res.className ? res.className : 'text-primary';
    }else{
      this.id = "icon1";
      this.icon = AlloyIcon.getIcon("faMicrochip");
      this.size = AlloyIcon.getSizeProp("lg");
      this.spin = false;
      this.className = 'text-primary';
    }

  }

  static getIcon(icon: string): IconDefinition {
    switch (icon) {
      case "faDownload":
        return faDownload;
      case "faHome":
        return faHome;
      case "faDollarSign":
        return faDollarSign;
      case "faMapMarkerAlt":
        return faLocation;
      case "faLock":
        return faLock;
      case "faUser":
        return faUser;
      case "faPhoneAlt":
        return faPhoneAlt;
      case "faEnvelope":
        return faEnvelope;
      case "faEnvelopeOpenText":
        return faEnvelopeOpenText;
      case "faAt":
        return faAt;
      case "faTh":
        return faTh;
      case "faMicrosoft":
        return faMicrosoft;
      case "faApple":
        return faApple;
      case 'faGoogle':
        return faGoogle;
      case "faFacebook":
        return faFacebook;
      case "faTwitter":
        return faTwitter;
      case "faYoutube":
        return faYoutube;
      case "faLinkedin":
        return faLinkedin;
      case "faInstagram":
        return faInstagram;
      case "faEnvelope":
        return faEnvelope;
      case "faList":
        return faList;
      case "faAddressCard":
        return faAddressCard;
      case "faBorderAll":
        return faBorderAll;
      case "faSpinner":
        return faSpinner;
      case "faSearch":
        return faSearch;
      case "faPlus":
        return faPlus;
      case "faEdit":
        return faEdit;
      case "faTrashAlt":
        return faTrashAlt;
      case "faChalkboardTeacher":
        return faChalkboardTeacher;
      case "faRightToBracket":
        return faRightToBracket;  
      case "faCamera":
        return faCamera;    
      case "faBlog":
        return faBlog;   
      case "faIcons":
        return faIcons;  
      case "faLink":
        return faLink;    
      case "faToggleOff":
        return faToggleOff; 
      case "faKeyboard":
        return faKeyboard;  
      case "faUserPlus":
        return faUserPlus;  
      case "faFilePdf":
        return faFilePdf; 
      case "faFolder":
        return faFolder;  
      case "faUpload":
        return faUpload;   
      case "faDashboard":
        return faDashboard;   
      case "faArrowLeftLong":
        return faArrowLeftLong;       
      case "faBars":
        return faBars;  
      case "faUsers":
        return faUsers;  
      case "faGear":
        return faGear;   
      case "faGears":
        return faGears;      
      case "faMessage":
        return faMessage;      
      case "faMicrochip":
        return faMicrochip;  
      case "faKey":
        return faKey;     
      case "faSignature":
        return faSignature;                                    
      default:
        return faMicrochip;
    }
  }

  static getSizeProp(size: string): SizeProp{
    switch (size) {
      case "xs":
        return "xs";
      case "sm":
        return "sm";
      case "lg":
        return "lg";
      case "1x":
        return "1x";
      case "2x":
        return "2x";
      case "3x":
        return "3x";
      case "4x":
        return "4x";
      case "5x":
        return "5x";
      default:
        return "lg";
    }
  }
}

export class AlloyIconLink{
  id: string;
  className: string;
  link: string;
  icon: AlloyIcon;
  constructor(res?: any){
    if(res){
      this.id = res.id ? res.id : "iconLink1";
      this.className = res.className ? res.className : "bg-dark";
      this.link = res.link ? res.link : "https://alloymobile.com";
      this.icon = res.icon ? new AlloyIcon(res.icon) : new AlloyIcon();
    }else{
      this.id = "iconLink1";
      this.className =  "bg-dark";
      this.link = "https://alloymobile.com";
      this.icon = new AlloyIcon();
    }
  }
}
