import { AlloyLink } from "../../cell/link/link.model";

export class Token{
    token: string;
    submitted: boolean;
    error: string;
    showSpinner: boolean;
  
    static createDTO(forget: Token){
      return {
        token: forget.token
      };
  }
  
    constructor(response?: any){
      if(response){
        this.token = response.token ? response.token : "";
        this.submitted = response.submitted ? response.submitted : false;
        this.error = response.error ? response.error : "";
        this.showSpinner = response.showSpinner ? response.showSpinner : false;
      }else{
        this.token = "";
        this.submitted = false;
        this.error = "";
        this.showSpinner = false;
      }
    }
  }
  