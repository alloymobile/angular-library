import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconComponent } from './cell/icon/icon/icon.component';
import { ButtonComponent } from './cell/button/button/button.component';
import { LinkComponent } from './cell/link/link/link.component';
import { InputFloatingTextsComponent } from './cell/input/input-floating-texts/input-floating-texts.component';
import { InputIconTextsComponent } from './cell/input/input-icon-texts/input-icon-texts.component';
import { CardActionComponent } from './cell/card/card-action/card-action.component';
import { CardIconActionComponent } from './cell/card/card-icon-action/card-icon-action.component';
import { CardImageActionComponent } from './cell/card/card-image-action/card-image-action.component';
import { CardComponent } from './cell/card/card/card.component';
import { CardImageComponent } from './cell/card/card-image/card-image.component';
import { CardIconComponent } from './cell/card/card-icon/card-icon.component';
import { ButtonIconComponent } from './cell/button/button-icon/button-icon.component';
import { LinkIconComponent } from './cell/link/link-icon/link-icon.component';
import { InputTextComponent } from './cell/input/input-text/input-text.component';

import { SidebarComponent } from './tissue/nav/sidebar/sidebar.component';
import { IconSidebarComponent } from './tissue/nav/icon-sidebar/icon-sidebar.component';
import { NavbarComponent } from './tissue/navbar/navbar/navbar.component';
import { InputIconTextLabelComponent } from './cell/input/input-icon-text-label/input-icon-text-label.component';
import { InputTextIconLabelComponent } from './cell/input/input-text-icon-label/input-text-icon-label.component';
import { InputFileComponent } from './cell/input/input-file/input-file.component';
import { InputTextsComponent } from './cell/input/input-texts/input-texts.component';
import { LinkLogoComponent } from './cell/link/link-logo/link-logo.component';
import { IconLinkComponent } from './cell/icon/icon-link/icon-link.component';
import { IconButtonComponent } from './cell/icon/icon-button/icon-button.component';
import { ButtonSubmitComponent } from './cell/button/button-submit/button-submit.component';
import { ButtonDropdownComponent } from './cell/button/button-dropdown/button-dropdown.component';
import { LinkDropdownComponent } from './cell/link/link-dropdown/link-dropdown.component';

import { TableComponent } from './tissue/table/table/table.component';
import { SearchbarComponent } from './tissue/searchbar/searchbar/searchbar.component';
import { GalleryButtonComponent } from './tissue/gallery/gallery-button/gallery-button.component';
import { PageComponent } from './tissue/page/page.component';
import { NavbarIconComponent } from './tissue/navbar/navbar-icon/navbar-icon.component';
import { ClientbarComponent } from './tissue/clientbar/clientbar/clientbar.component';
import { TableActionComponent } from './tissue/table/table-action/table-action.component';
import { FooterComponent } from './tissue/footer/footer/footer.component';
import { NavbarLinkIconComponent } from './tissue/navbar/navbar-link-icon/navbar-link-icon.component';

import { FormComponent } from './organ/form/form/form.component';
import { CrudFileComponent } from './organ/crud/crud-file/crud-file.component';
import { CrudFileActionComponent } from './organ/crud/crud-file-action/crud-file-action.component';
import { ModalComponent } from './organ/modal/modal/modal.component';
import { ModalToastComponent } from './organ/modal/modal-toast/modal-toast.component';
import { ModalFileComponent } from './organ/modal/modal-file/modal-file.component';
import { ResetComponent } from './organ/reset/reset/reset.component';
import { CodeComponent } from './organ/code/code/code.component';
import { LoginComponent } from './organ/login/login/login.component';
import { RegisterComponent } from './organ/register/register/register.component';
import { ForgetComponent } from './organ/forget/forget/forget.component';
import { CrudTableComponent } from './organ/crud/crud-table/crud-table.component';
import { CrudCardComponent } from './organ/crud/crud-card/crud-card.component';
import { ProfileComponent } from './organ/profile/profile/profile.component';
import { TabLinkComponent } from './tissue/nav/tab-link/tab-link.component';
import { TabFormComponent } from './tissue/nav/tab-form/tab-form.component';


@NgModule({
  declarations: [
    IconComponent,
    IconLinkComponent,
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
    PageComponent,
    InputFileComponent,
    InputTextsComponent,
    CrudFileComponent,
    NavbarIconComponent,
    ClientbarComponent,
    ModalComponent,
    ModalToastComponent,
    ModalFileComponent,
    CodeComponent,
    TableActionComponent,
    CrudFileActionComponent,
    ResetComponent,
    LinkLogoComponent,
    IconButtonComponent,
    LinkDropdownComponent,
    ButtonSubmitComponent,
    ButtonDropdownComponent,
    FormComponent,
    NavbarLinkIconComponent,
    FooterComponent,
    InputFloatingTextsComponent,
    InputIconTextsComponent,
    CardActionComponent,
    CardIconActionComponent,
    CardImageActionComponent,
    CardComponent,
    CardImageComponent,
    CardIconComponent,
    CrudTableComponent,
    CrudCardComponent,
    ProfileComponent,
    TabLinkComponent,
    TabFormComponent
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
    IconLinkComponent,
    IconButtonComponent,
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
    PageComponent,
    InputFileComponent,
    InputTextsComponent,
    CrudFileComponent,
    NavbarIconComponent,
    ClientbarComponent,
    ModalComponent,
    ModalToastComponent,
    CodeComponent,
    TableActionComponent,
    CrudFileActionComponent,
    ResetComponent,
    LinkLogoComponent,
    LinkDropdownComponent,
    ButtonSubmitComponent,
    ButtonDropdownComponent,
    FormComponent,
    NavbarLinkIconComponent,
    FooterComponent,
    InputFloatingTextsComponent,
    InputIconTextsComponent,
    CardActionComponent,
    CardIconActionComponent,
    CardImageActionComponent,
    CardComponent,
    CardImageComponent,
    CardIconComponent,
    CrudTableComponent,
    CrudCardComponent,
    ProfileComponent,
    TabLinkComponent,
    TabFormComponent
  ]
})
export class AlloymobileAngularModule { }
