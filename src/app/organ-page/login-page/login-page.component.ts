import { Component } from '@angular/core';
import { Login} from 'alloymobile-angular';
import LoginDB from './login-page.data.json';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent{
  login: Login;

  constructor() {
      this.login = new Login(LoginDB);
    }

  onLogin(form){
    console.log(form);
  }
}
