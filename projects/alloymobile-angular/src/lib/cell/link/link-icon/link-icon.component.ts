import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlloyLinkIcon } from '../link.model';

@Component({
  selector: 'alloy-link-icon',
  templateUrl: './link-icon.component.html',
  styleUrls: ['./link-icon.component.css']
})
export class LinkIconComponent {
  _linkIcon: AlloyLinkIcon;
  @Input() set linkIcon(linkIcon: AlloyLinkIcon){
    this._linkIcon = linkIcon;
  }

  constructor(private router:Router) { 
    this._linkIcon = new AlloyLinkIcon();
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
