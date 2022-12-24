import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlloySearchBar } from '../searchbar.model';

@Component({
  selector: 'alloy-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent {
  _searchBar: AlloySearchBar;
  @Input() set searchBar(searchBar: AlloySearchBar) {
  	this._searchBar = searchBar;
  }

  @Output() output: EventEmitter<AlloySearchBar>= new EventEmitter<AlloySearchBar>();

  constructor() { 
    this._searchBar = new AlloySearchBar();
  }  

  updateSearch(search){
    
  }
}
