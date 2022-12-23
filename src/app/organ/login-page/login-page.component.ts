import { Component } from '@angular/core';
import { Login } from 'alloymobile-angular';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  client: Login;
  constructor() {
    this.client = new Login();
   }

  onLogin(client: Login){
    console.log(client);
  }
}
