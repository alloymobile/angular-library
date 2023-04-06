import { AlloyLink } from "../../cell/link/link.model";

export class Register{
    id: string; 
    name: string;
    email: string;
    password: string;
    reTypePassword: string;
    phone: string;
    clientType: string;
    submitted: boolean;
    error: string;
    showSpinner: boolean;
    privacyLink: AlloyLink;
    termsLink: AlloyLink;
  
    static createDTO(register: Register){
      return {
            id: register.id,
            name: register.name,
            email: register.email,
            password: register.password,
            phone: register.phone,
            clientType: register.clientType
      };
  }
  
    constructor(response?: any){
      if(response){
        this.id = response.id ?  response.id : "";
        this.name = response.name ?  response.name : "";
        this.email = response.email ? response.email : "";
        this.password = response.password ? response.password : "";
        this.reTypePassword = response.reTypePassword ? response.reTypePassword : "";
        this.phone = response.phone ?  response.phone : "";
        this.clientType = response.clientType ?  response.clientType : "";
        this.submitted = response.submitted ? response.submitted : false;
        this.error = response.error ? response.error : "";
        this.showSpinner = response.showSpinner ? response.showSpinner : false;
        this.privacyLink = response.privacyLink ? new AlloyLink(response.privacyLink) : new AlloyLink();
        this.termsLink = response.termsLink ? new AlloyLink(response.termsLink) : new AlloyLink();
      }else{
        this.id = "";
        this.name = "";
        this.email = "";
        this.password = "";
        this.reTypePassword = "";
        this.phone = "";
        this.clientType = "";
        this.submitted = false;
        this.error = "";
        this.showSpinner = false;
        this.privacyLink = new AlloyLink();
        this.termsLink = new AlloyLink();
      }
    }
  }
