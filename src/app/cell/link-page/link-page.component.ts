import { Component } from '@angular/core';
import { AlloyLink } from 'alloymobile-angular';
import LinkDB from './link-page.data.json'

@Component({
  selector: 'app-link-page',
  templateUrl: './link-page.component.html',
  styleUrls: ['./link-page.component.css']
})
export class LinkPageComponent {
  links: AlloyLink[];
  usageString: string;
  example: AlloyLink;
  exampleData: string;
  constructor(){
    this.usageString = '<alloy-link [link]="link"></alloy-link>';
    this.exampleData = "";
    this.example = new AlloyLink(this.exampleData);
    this.links = LinkDB.map((link)=>new AlloyLink(link))
  }

  linkClick(link: AlloyLink){
    let ico = LinkDB.find(i=>i.id === link.id);
    this.exampleData = JSON.stringify(ico);
    this.update();
  }

  update(){
    this.example = new AlloyLink(JSON.parse(this.exampleData));
  }
}
