import { Component } from '@angular/core';
import { Register } from 'alloymobile-angular';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  client: Register;
  constructor() { 
   this.client = new Register();
   this.client.email = "tapas@alloymobile.com";
  }

  ngOnInit(): void {
  }

  onRegister(client: Register){
    console.log(client);
  }
}
