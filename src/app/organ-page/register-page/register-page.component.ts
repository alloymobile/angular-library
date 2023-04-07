import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlloyLink, Register } from 'alloymobile-angular';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  client: Register;
  _link: any;
  constructor(private router:Router) { 
   this.client = new Register();
   this.client.privacyLink = new AlloyLink({id:"privacy",name:"privacy policy",link:"https://cpagarg.com/privacy/",className:"text-decoration-none fw-bold"}) ;
   this.client.termsLink = new AlloyLink({id:"terms",name:"terms and condition",link:"https://cpagarg.com/terms/",className:"text-decoration-none fw-bold"}) ;
    this._link = {id:"terms",name:"terms and condition",link:"https://cpagarg.com/terms/",className:"text-decoration-none fw-bold"};
  }

  ngOnInit(): void {
  }

  onRegister(client: Register){
    console.log(client);
  }

}
