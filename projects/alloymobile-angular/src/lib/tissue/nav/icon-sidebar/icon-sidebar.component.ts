import { Component, Input } from '@angular/core';
import { AlloyIconSideBar } from '../nav.model';


@Component({
  selector: 'alloy-icon-sidebar',
  templateUrl: './icon-sidebar.component.html',
  styleUrls: ['./icon-sidebar.component.css']
})
export class IconSidebarComponent {
  _iconSideBar: AlloyIconSideBar;
  @Input() set iconSideBar(iconSideBar: AlloyIconSideBar) {
  	this._iconSideBar = iconSideBar;
  }
  constructor() { 
    this._iconSideBar = new AlloyIconSideBar();
  }
}
