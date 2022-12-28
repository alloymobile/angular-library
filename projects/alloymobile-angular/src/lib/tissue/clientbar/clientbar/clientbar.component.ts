import { Component, Input } from '@angular/core';
import { AlloyIcon } from '../../../cell/icon/icon.model';
import { AlloyLink } from '../../../cell/link/link.model';
import { AlloyClientBar } from '../clientbar.model';

@Component({
  selector: 'alloy-clientbar',
  templateUrl: './clientbar.component.html',
  styleUrls: ['./clientbar.component.css']
})
export class ClientbarComponent {
  _clientBar: AlloyClientBar;
  clientIcon: AlloyIcon;
  roles: AlloyLink[];
  logout: AlloyLink;
  @Input() set clientBar(clientBar: AlloyClientBar) {
  	this._clientBar = clientBar;
    this.roles = this.getRoles();
  }
  constructor(){
    this._clientBar = new AlloyClientBar();
    this.clientIcon = new AlloyIcon({id:1,icon:"faUser",size:"lg",spin:false,className:""})
    this.logout = new AlloyLink({id:1,name:"Logout",className:"dropdown-item",link:"/"});
    this.roles = [];
  }

  backOutput(back){

  }

  getRoles(){
    let roles = this._clientBar.client.roles.map(r=>new AlloyLink(r));
    roles.forEach(r=>{
      r.className = 'dropdown-item'
    });

    return roles;
  }

  selectRole(id: number){
    if(this._clientBar.client.roles && this._clientBar.client.roles.length > 0){
      this._clientBar.client.roles.map(r=>r.selected = false);
      this._clientBar.client.roles[id].selected = true;
    }
  }
}
