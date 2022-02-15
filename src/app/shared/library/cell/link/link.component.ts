import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppLink } from './link.model';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {
  _link: AppLink;
  @Input() set link(link: AppLink){
    this._link = link;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
