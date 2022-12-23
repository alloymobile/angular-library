import { AlloyLink } from "../../cell/link/link.model";

export class Login{
    email: string;
    password: string;
    submitted: boolean;
    error: string;
    showSpinner: boolean;
    rememberMe: boolean;
    register: AlloyLink;
    forget: AlloyLink;
  
    static createDTO(login: Login){
      return {
          email: login.email,
          password: login.password
      };
  }
  
    constructor(response?: any){
      if(response){
        this.email = response.email ? response.email : "";
        this.password = response.password ? response.password : "";
        this.submitted = response.submitted ? response.submitted : false;
        this.error = response.error ? response.error : "";
        this.rememberMe = response.rememberMe ? response.rememberMe : false;
        this.showSpinner = response.showSpinner ? response.showSpinner : false;
        this.register = response.register ? new AlloyLink(response.register) : new AlloyLink();
        this.forget = response.forget ?  new AlloyLink(response.forget) : new AlloyLink();
      }else{
        this.email = "";
        this.password = "";
        this.submitted = false;
        this.error = "";
        this.rememberMe = false;
        this.showSpinner = false;
        this.register = new AlloyLink();
        this.forget = new AlloyLink();
      }
    }
  }
  