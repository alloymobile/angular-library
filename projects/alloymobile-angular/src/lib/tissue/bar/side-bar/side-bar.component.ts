import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloySideBar } from '../bar.model';
import { AlloyLink } from '../../../cell/link/link.model';

@Component({
  selector: 'alloy-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  _sideBar: AlloySideBar;
  @Input() set sideBar(sideBar: AlloySideBar){
    this._sideBar = sideBar;
  }
  @Output() output: EventEmitter<AlloyLink>= new EventEmitter<AlloyLink>();
  constructor() {
    this._sideBar = new AlloySideBar();
  }

  getSelected(tab: AlloyLink){
    this._sideBar.links.forEach(b => {
      if(b.id === tab.id){
        b.active = this._sideBar.selected;
      }else{
        b.active = '';
      }
    });
    this.output.emit(tab);
  }
}
