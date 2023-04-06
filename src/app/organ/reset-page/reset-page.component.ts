import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-page',
  templateUrl: './reset-page.component.html',
  styleUrls: ['./reset-page.component.css']
})
export class ResetPageComponent {

  reset(reset){
    console.log(reset);
  }
}
