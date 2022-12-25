import { Component } from '@angular/core';
import { Token } from 'alloymobile-angular';
@Component({
  selector: 'app-token-page',
  templateUrl: './token-page.component.html',
  styleUrls: ['./token-page.component.css']
})
export class TokenPageComponent {
  client: Token;
  constructor() { 
    this.client = new Token();
  }


  onForget(client: Token){
    console.log(client);
  }
}
