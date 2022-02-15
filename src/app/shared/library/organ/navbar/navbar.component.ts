import { Component, OnInit } from '@angular/core';
import { AppNavbar } from './navbar.model';
import navbardb from './navbar.json'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbar: AppNavbar
  constructor() {
    this.navbar = new AppNavbar(navbardb);
   }

  ngOnInit(): void {
  }

}
