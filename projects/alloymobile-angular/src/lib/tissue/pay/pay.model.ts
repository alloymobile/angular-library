import { AlloyButtonSubmit } from "../../cell/button/button.model";
import { AlloyIcon } from "../../cell/icon/icon.model";

export class AlloyPay{
    id: string;
    name: string;
    className: string;
    brandIcon: AlloyIcon;
    cardIcon: AlloyIcon;
    expiryIcon: AlloyIcon;
    cvcIcon: AlloyIcon;
    submit: AlloyButtonSubmit;
    disclaimer: string;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "alloyPay";
            this.name = res.name ? res.name : "Payment";
            this.className = res.className ? res.className : "";
            this.brandIcon = res.brandIcon ? new AlloyIcon(res.brandIcon) : new AlloyIcon();
            this.cardIcon = res.cardIcon ? new AlloyIcon(res.cardIcon) : new AlloyIcon();
            this.expiryIcon = res.expiryIcon ? new AlloyIcon(res.expiryIcon) : new AlloyIcon();
            this.cvcIcon = res.cvcIcon ? new AlloyIcon(res.cvcIcon) : new AlloyIcon();
            this.submit = res.submit ? new AlloyButtonSubmit(res.submit) : new AlloyButtonSubmit();
            this.disclaimer = res.disclaimer ? res.disclaimer : " *AlloyMobile do not store your credit card information.";
        }else{
            this.id = "alloyPay";
            this.name = "Payment";
            this.className =  "";
            this.brandIcon = new AlloyIcon();
            this.cardIcon = new AlloyIcon();
            this.expiryIcon = new AlloyIcon();
            this.cvcIcon =  new AlloyIcon();
            this.submit = new AlloyButtonSubmit();
            this.disclaimer = "*AlloyMobile do not store your credit card information.";
        }
    }
}