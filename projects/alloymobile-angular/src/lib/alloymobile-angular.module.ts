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
import { LoginComponent } from './organ/login/login/login.component';
import { RegisterComponent } from './organ/register/register/register.component';
import { ForgetComponent } from './organ/forget/forget/forget.component';
import { TableComponent } from './tissue/table/table/table.component';
import { ButtonIconComponent } from './cell/button/button-icon/button-icon.component';
import { LinkIconComponent } from './cell/link/link-icon/link-icon.component';
import { InputTextComponent } from './cell/input/input-text/input-text.component';
import { SearchbarComponent } from './tissue/searchbar/searchbar/searchbar.component';
import { InputIconTextLabelComponent } from './cell/input/input-icon-text-label/input-icon-text-label.component';
import { InputTextIconLabelComponent } from './cell/input/input-text-icon-label/input-text-icon-label.component';
import { GalleryButtonComponent } from './tissue/gallery/gallery-button/gallery-button.component';
import { TokenComponent } from './organ/token/token/token.component';
import { CrudComponent } from './organ/crud/crud/crud.component';
import { PageComponent } from './tissue/page/page.component';
import { InputFileComponent } from './cell/input/input-file/input-file.component';
import { InputTextsComponent } from './cell/input/input-texts/input-texts.component';
import { CrudFileComponent } from './organ/crud/crud-file/crud-file.component';
import { NavbarIconComponent } from './tissue/navbar/navbar-icon/navbar-icon.component';
import { ClientbarComponent } from './tissue/clientbar/clientbar/clientbar.component';
import { CardDashboardComponent } from './cell/card/card-dashboard/card-dashboard.component';
import { ModalComponent } from './organ/modal/modal/modal.component';
import { ModalToastComponent } from './organ/modal/modal-toast/modal-toast.component';
import { ModalFileComponent } from './organ/modal/modal-file/modal-file.component';


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
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    TableComponent,
    InputTextComponent,
    SearchbarComponent,
    InputIconTextLabelComponent,
    InputTextIconLabelComponent,
    GalleryButtonComponent,
    TokenComponent,
    CrudComponent,
    PageComponent,
    InputFileComponent,
    InputTextsComponent,
    CrudFileComponent,
    NavbarIconComponent,
    ClientbarComponent,
    CardDashboardComponent,
    ModalComponent,
    ModalToastComponent,
    ModalFileComponent
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
    LoginComponent,
    RegisterComponent,
    ForgetComponent,
    TableComponent,
    InputTextComponent,
    SearchbarComponent,
    InputIconTextLabelComponent,
    InputTextIconLabelComponent,
    GalleryButtonComponent,
    TokenComponent,
    CrudComponent,
    PageComponent,
    InputFileComponent,
    InputTextsComponent,
    CrudFileComponent,
    NavbarIconComponent,
    ClientbarComponent,
    CardDashboardComponent,
    ModalComponent,
    ModalToastComponent
  ]
})
export class AlloymobileAngularModule { }
