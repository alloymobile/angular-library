export class Code{
    email: string;
    password: string;
    code: string;
    submitted: boolean;
    error: string;
    showSpinner: boolean;
  
    constructor(response?: any){
      if(response){
        this.email = response.email ? response.email : '';
        this.password = response.password ? response.password : '';
        this.code = response.code ? response.code : "";
        this.submitted = response.submitted ? response.submitted : false;
        this.error = response.error ? response.error : "";
        this.showSpinner = response.showSpinner ? response.showSpinner : false;
      }else{
        this.email = '';
        this.password = '';
        this.code = "";
        this.submitted = false;
        this.error = "";
        this.showSpinner = false;
      }
    }
  }
  