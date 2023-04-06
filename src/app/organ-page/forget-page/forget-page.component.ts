import { Component } from '@angular/core';
import { Forget } from 'alloymobile-angular';

@Component({
  selector: 'app-forget-page',
  templateUrl: './forget-page.component.html',
  styleUrls: ['./forget-page.component.css']
})
export class ForgetPageComponent {
  client: Forget;
  constructor() { 
    this.client = new Forget();
  }


  onForget(client: Forget){
    console.log(client);
  }
}
