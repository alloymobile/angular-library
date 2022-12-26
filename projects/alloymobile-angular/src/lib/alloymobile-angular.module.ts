import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconComponent } from './cell/icon/icon.component';
import { ButtonComponent } from './cell/button/button/button.component';
import { LinkComponent } from './cell/link/link/link.component';

import { SidebarComponent } from './tissue/sidebar/sidebar/sidebar.component';
import { IconSidebarComponent } from './tissue/sidebar/icon-sidebar/icon-sidebar.component';
import { NavbarComponent } from './tissue/navbar/navbar/navbar.component';
import { IconNavbarComponent } from './tissue/navbar/icon-navbar/icon-navbar.component';
import { LoginComponent } from './organ/login/login/login.component';
import { RegisterComponent } from './organ/register/register/register.component';
import { ForgetComponent } from './organ/forget/forget/forget.component';
import { TableComponent } from './tissue/table/table/table.component';
import { TableActionComponent } from './tissue/table/table-action/table-action.component';
import { ButtonIconComponent } from './cell/button/button-icon/button-icon.component';
import { LinkIconComponent } from './cell/link/link-icon/link-icon.component';
import { InputTextComponent } from './cell/input/input-text/input-text.component';
import { InputTextIconComponent } from './cell/input/input-text-icon/input-text-icon.component';
import { SearchbarComponent } from './tissue/searchbar/searchbar/searchbar.component';
import { ModalComponent } from './organ/modal/modal/modal.component';
import { InputIconTextComponent } from './cell/input/input-icon-text/input-icon-text.component';
import { InputIconTextLabelComponent } from './cell/input/input-icon-text-label/input-icon-text-label.component';
import { InputTextIconLabelComponent } from './cell/input/input-text-icon-label/input-text-icon-label.component';
import { GalleryButtonComponent } from './tissue/gallery/gallery-button/gallery-button.component';
import { TokenComponent } from './organ/token/token/token.component';
import { ModalButtonComponent } from './organ/modal/modal-button/modal-button.component';
import { CrudComponent } from './organ/crud/crud.component';


@NgModule({
  declarations: [
    IconComponent,
    ButtonComponent,
    ButtonIconComponent,
    LinkComponent,
    LinkIconComponent,
    SidebarComponent,
    IconSidebarComponent,
    NavbarComponent,
    IconNavbarComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    TableComponent,
    TableActionComponent,
    InputTextComponent,
    InputTextIconComponent,
    SearchbarComponent,
    ModalComponent,
    InputIconTextComponent,
    InputIconTextLabelComponent,
    InputTextIconLabelComponent,
    GalleryButtonComponent,
    TokenComponent,
    ModalButtonComponent,
    CrudComponent
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
    ButtonIconComponent,
    LinkComponent,
    LinkIconComponent,
    SidebarComponent,
    IconSidebarComponent,
    NavbarComponent,
    IconNavbarComponent,
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    TableComponent,
    TableActionComponent,
    InputTextComponent,
    InputTextIconComponent,
    SearchbarComponent,
    ModalComponent,
    InputIconTextComponent,
    InputIconTextLabelComponent,
    InputTextIconLabelComponent,
    GalleryButtonComponent,
    TokenComponent,
    ModalButtonComponent,
    CrudComponent
  ]
})
export class AlloymobileAngularModule { }
