import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlloyLink } from '../link.model';

@Component({
  selector: 'alloy-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent {
  _link: AlloyLink;
  @Input() set link(link: AlloyLink){
    this._link = link;
  }

  constructor(private router:Router) { 
    this._link = new AlloyLink();
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
