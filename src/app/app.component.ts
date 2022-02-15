import { Component } from '@angular/core';
import { AppButton } from './shared/library/cell/button/button.model';
import { AppLink } from './shared/library/cell/link/link.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-library';
  _button: AppButton = new AppButton();
  _link: AppLink = new AppLink();
  _buttons: AppButton[] = [];
  constructor(){
    for(let i=0;i<5;i++){
      this._buttons.push(new AppButton());
    }
  }

  hello(event){
    console.log(event);
  }
}
