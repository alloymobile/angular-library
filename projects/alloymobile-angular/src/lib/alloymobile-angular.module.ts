import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconComponent } from './cell/icon/icon/icon.component';
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
import { CodeComponent } from './organ/code/code/code.component';
import { TableActionComponent } from './tissue/table/table-action/table-action.component';
import { CrudFileActionComponent } from './organ/crud/crud-file-action/crud-file-action.component';
import { CardGalleryComponent } from './cell/card/card-gallery/card-gallery.component';
import { ResetComponent } from './organ/reset/reset/reset.component';
import { LinkLogoComponent } from './cell/link/link-logo/link-logo.component';
import { IconLinkComponent } from './cell/icon/icon-link/icon-link.component';
import { IconButtonComponent } from './cell/icon/icon-button/icon-button.component';
import { ButtonSubmitComponent } from './cell/button/button-submit/button-submit.component';
import { ButtonDropdownComponent } from './cell/button/button-dropdown/button-dropdown.component';
import { LinkDropdownComponent } from './cell/link/link-dropdown/link-dropdown.component';
import { FooterComponent } from './tissue/footer/footer/footer.component';
import { FormComponent } from './organ/form/form/form.component';
import { NavbarLinkIconComponent } from './tissue/navbar/navbar-link-icon/navbar-link-icon.component';

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
    ModalFileComponent,
    CodeComponent,
    TableActionComponent,
    CrudFileActionComponent,
    CardGalleryComponent,
    ResetComponent,
    LinkLogoComponent,
    IconButtonComponent,
    LinkDropdownComponent,
    ButtonSubmitComponent,
    ButtonDropdownComponent,
    FormComponent,
    NavbarLinkIconComponent,
    FooterComponent
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
    CodeComponent,
    TableActionComponent,
    CrudFileActionComponent,
    CardGalleryComponent,
    ResetComponent,
    LinkLogoComponent,
    LinkDropdownComponent,
    ButtonSubmitComponent,
    ButtonDropdownComponent,
    FormComponent,
    NavbarLinkIconComponent,
    FooterComponent
  ]
})
export class AlloymobileAngularModule { }
