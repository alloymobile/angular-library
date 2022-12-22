import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlloyIconLink } from '../link.model';

@Component({
  selector: 'alloy-icon-link',
  templateUrl: './icon-link.component.html',
  styleUrls: ['./icon-link.component.css']
})
export class IconLinkComponent {
  _iconLink: AlloyIconLink;
  @Input() set iconLink(iconLink: AlloyIconLink){
    this._iconLink = iconLink;
  }

  constructor(private router:Router) { 
    this._iconLink = new AlloyIconLink();
  }
  //redirect on click
  routeLink(lnk: any) {
    if (lnk.includes("http") || lnk.includes("https")) {
      window.location.href = lnk;
      return true;
    }
    return this.router.navigateByUrl(lnk);
  }
}
