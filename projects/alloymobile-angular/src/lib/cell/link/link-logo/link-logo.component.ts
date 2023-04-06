import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlloyLinkLogo } from '../link.model';

@Component({
  selector: 'alloy-link-logo',
  templateUrl: './link-logo.component.html',
  styleUrls: ['./link-logo.component.css']
})
export class LinkLogoComponent {
  _linkLogo: AlloyLinkLogo;
  @Input() set linkLogo(linkLogo: AlloyLinkLogo){
    this._linkLogo = linkLogo;
  }

  constructor(private router:Router) { 
    this._linkLogo = new AlloyLinkLogo();
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
