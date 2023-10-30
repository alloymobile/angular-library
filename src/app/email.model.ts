import { environment } from "src/environments/environment.prod";


export class Email{
  id: string;
  toMailAddress: string;
  subject: string;
  body: Body;
  constructor(res: any){
    if(res){
      this.id = res.id ? res.id : '';
      this.toMailAddress = environment.toEmailAddress;
      this.subject = res.subject ? res.subject : '';
      this.body = res.body ? new Body(res.body) : new Body();
    }else{
      this.id =  '';
      this.toMailAddress = environment.toEmailAddress;
      this.subject = '';
      this.body = new Body();
    }
  }

  static createEmailDTO(res){
    return {
      id:'',
      fromMailAddress: res.email,
      toMailAddress:  environment.toEmailAddress,
      subject: 'request',
      body: "Someone name: '"+res.name+"' with email address: '"+res.email +"' sent the below message. "+res.message
    }
  }

  static showEmailModel(res){
    return {
      id:res.id,
      email: res.body.fromMailAddress,
      name: res.body.name,
      message: this.shortBody(res.body.message)
    }
  }

  static shortBody(message: string){ 
    return message.length > 10 ? message.substring(0,10) + "..." : message;
  }
}

export class Body{
  name: string;
  fromMailAddress: string;
  message: string;
  constructor(res?: any){
    if(res){
      this.name = res.name ? res.name : '';
      this.fromMailAddress = res.fromMailAddress ? res.fromMailAddress : '';
      this.message = res.message ? res.message : '';
    }else{
      this.name = '';
      this.fromMailAddress = '';
      this.message = '';
    }
  }
}
