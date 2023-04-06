
export class Reset{
    password: string;
    reTypePassword: string;
    submitted: boolean;
    error: string;
    showSpinner: boolean;
  
    static createDTO(reset: Reset){
      return {
            password: reset.password
      };
  }
  
    constructor(response?: any){
      if(response){
        this.password = response.password ? response.password : "";
        this.reTypePassword = response.reTypePassword ? response.reTypePassword : "";
        this.submitted = response.submitted ? response.submitted : false;
        this.error = response.error ? response.error : "";
        this.showSpinner = response.showSpinner ? response.showSpinner : false;
      }else{
        this.password = "";
        this.reTypePassword = "";
        this.submitted = false;
        this.error = "";
        this.showSpinner = false;
      }
    }
}