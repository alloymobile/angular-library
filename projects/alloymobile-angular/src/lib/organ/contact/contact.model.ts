import { AlloyCard } from "../../tissue/card/card.model";
import { AlloyForm } from "../form/form.model";

export class AlloyContact{
    id: string;
    title: string;
    className: string;
    type: string;
    contactClass: string;
    contactForm: AlloyForm;
    addressClass: string;
    addressCard: AlloyCard;
    data: any;
    constructor(res?: any){
        if(res){
            this.id = res.id ? res.id : "contact";
            this.title = res.title ? res.title : "Contact Us";
            this.type = res.type ? res.type : "AlloyInputTextIcon";
            this.className = res.className ? res.className : "d-flex justify-content-center flex-column text-center h-100 mt-3";
            this.contactForm = res.contactForm ? new AlloyForm(res.contactForm) : new AlloyForm();
            this.addressCard = res.addressCard ? new AlloyCard(res.addressCard) : new AlloyCard();
            this.contactClass = res.contactClass ? res.contactClass : "col-12 col-md-6";
            this.addressClass = res.addressClass ? res.addressClass : "col-12 col-md-6";
        }else{
            this.id =  "contact";
            this.title = "Contact Us";
            this.type = "AlloyInputTextIcon";
            this.className = "d-flex justify-content-center flex-column text-center h-100 mt-3";
            this.contactForm = new AlloyForm();
            this.addressCard = new AlloyCard();
            this.contactClass = "col-12 col-md-6";
            this.addressClass = "col-12 col-md-6";
        }
    }
}