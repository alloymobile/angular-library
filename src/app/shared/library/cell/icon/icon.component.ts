import { Component, Input, OnInit } from '@angular/core';
import { AppIcon } from './icon.model';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent implements OnInit {
  _icon: AppIcon;
  @Input() set icon(icon: AppIcon) {
  	this._icon = icon;
  }

  constructor() { }

  ngOnInit(): void {
  }
}
