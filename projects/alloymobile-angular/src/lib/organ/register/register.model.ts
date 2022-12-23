import { AlloyLink } from "../../cell/link/link.model";

export class Register{
    name: string;
    email: string;
    password: string;
    reTypePassword: string;
    submitted: boolean;
    error: string;
    showSpinner: boolean;
    login: AlloyLink;
    forget: AlloyLink;
  
    static createDTO(register: Register){
      return {
            name: register.name,
            email: register.email,
            password: register.password
      };
  }
  
    constructor(response?: any){
      if(response){
        this.name = response.name ?  response.name : "";
        this.email = response.email ? response.email : "";
        this.password = response.password ? response.password : "";
        this.reTypePassword = response.reTypePassword ? response.reTypePassword : "";
        this.submitted = response.submitted ? response.submitted : false;
        this.error = response.error ? response.error : "";
        this.showSpinner = response.showSpinner ? response.showSpinner : false;
        this.login = response.login ?  new AlloyLink(response.login) : new AlloyLink();
        this.forget = response.forget ?  new AlloyLink(response.forget) : new AlloyLink();
      }else{
        this.name = "";
        this.email = "";
        this.password = "";
        this.reTypePassword = "";
        this.submitted = false;
        this.error = "";
        this.showSpinner = false;
        this.login = new AlloyLink();
        this.forget =  new AlloyLink();
      }
    }
  }
