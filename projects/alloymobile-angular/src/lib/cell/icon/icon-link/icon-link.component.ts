import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlloyIconLink } from '../icon.model';

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

  @Output() output: EventEmitter<AlloyIconLink>= new EventEmitter<AlloyIconLink>();

  constructor(private router:Router) { 
    this._iconLink = new AlloyIconLink();
  }
  //redirect on click
  redirectLink() {
    this.output.emit(this._iconLink);
    if (this._iconLink.link.includes("http") || this._iconLink.link.includes("https")) {
      window.location.href = this._iconLink.link;
      return true;
    }
    return this.router.navigateByUrl(this._iconLink.link);
  }
}
