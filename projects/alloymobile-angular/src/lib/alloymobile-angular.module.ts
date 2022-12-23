import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconComponent } from './cell/icon/icon.component';
import { ButtonComponent } from './cell/button/button/button.component';
import { IconButtonComponent } from './cell/button/icon-button/icon-button.component';
import { LinkComponent } from './cell/link/link/link.component';
import { IconLinkComponent } from './cell/link/icon-link/icon-link.component';
import { TextComponent } from './cell/input/text/text.component';

import { SidebarComponent } from './tissue/sidebar/sidebar/sidebar.component';
import { IconSidebarComponent } from './tissue/sidebar/icon-sidebar/icon-sidebar.component';
import { NavbarComponent } from './tissue/navbar/navbar/navbar.component';
import { IconNavbarComponent } from './tissue/navbar/icon-navbar/icon-navbar.component';
import { LoginComponent } from './organ/login/login/login.component';
import { RegisterComponent } from './organ/register/register/register.component';
import { ForgetComponent } from './organ/forget/forget/forget.component';
import { TableComponent } from './tissue/table/table/table.component';


@NgModule({
  declarations: [
    IconComponent,
    ButtonComponent,
    LinkComponent,
    TextComponent,
    IconLinkComponent,
    IconButtonComponent,
    SidebarComponent,
    IconSidebarComponent,
    NavbarComponent,
    IconNavbarComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
  ],
  exports: [
    IconComponent,
    ButtonComponent,
    LinkComponent,
    IconLinkComponent,
    IconButtonComponent,
    SidebarComponent,
    IconSidebarComponent,
    NavbarComponent,
    IconNavbarComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    TableComponent
  ]
})
export class AlloymobileAngularModule { }
