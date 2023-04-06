import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlloyLink } from '../link.model';

@Component({
  selector: 'alloy-link-external',
  templateUrl: './link-external.component.html',
  styleUrls: ['./link-external.component.css']
})
export class LinkExternalComponent {
  _linkExternal: AlloyLink;
  @Input() set linkExternal(linkExternal: AlloyLink){
    this._linkExternal = linkExternal;
  }

  constructor(private router:Router) { 
    this._linkExternal = new AlloyLink();
  }

  //redirect on click
  routeLink(event: Event) {
    event.preventDefault();
    if (this._linkExternal.link.includes("http") || this._linkExternal.link.includes("https")) {
      window.location.href = this._linkExternal.link;
      return true;
    }
    return this.router.navigateByUrl(this._linkExternal.link);
  }
}
