import { Component } from '@angular/core';
import { Code } from 'alloymobile-angular';
@Component({
  selector: 'app-token-page',
  templateUrl: './token-page.component.html',
  styleUrls: ['./token-page.component.css']
})
export class TokenPageComponent {
  client: Code;
  constructor() { 
    this.client = new Code();
  }


  onForget(client: Code){
    console.log(client);
  }
}
