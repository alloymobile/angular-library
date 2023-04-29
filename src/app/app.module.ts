import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconPageComponent } from './cell-page/icon-page/icon-page.component';
import { LinkPageComponent } from './cell-page/link-page/link-page.component';
import { ButtonPageComponent } from './cell-page/button-page/button-page.component';
import { LoginPageComponent } from './organ-page/login-page/login-page.component';
import { RegisterPageComponent } from './organ-page/register-page/register-page.component';
import { ForgetPageComponent } from './organ-page/forget-page/forget-page.component';
import { TablePageComponent } from './tissue-page/table-page/table-page.component';
import { TableDetailPageComponent } from './table-detail-page/table-detail-page.component';
import { InputPageComponent } from './cell-page/input-page/input-page.component';
import { CrudPageComponent } from './organ-page/crud-page/crud-page.component';
import { ResetPageComponent } from './organ-page/reset-page/reset-page.component';
import { IconLinkPageComponent } from './cell-page/icon-link-page/icon-link-page.component';
import { IconButtonPageComponent } from './cell-page/icon-button-page/icon-button-page.component';
import { CellPageComponent } from './cell-page/cell-page.component';
import { TissuePageComponent } from './tissue-page/tissue-page.component';
import { OrganPageComponent } from './organ-page/organ-page.component';
import { ButtonIconPageComponent } from './cell-page/button-icon-page/button-icon-page.component';
import { ButtonDropdownPageComponent } from './cell-page/button-dropdown-page/button-dropdown-page.component';
import { ButtonSubmitPageComponent } from './cell-page/button-submit-page/button-submit-page.component';
import { LinkLogoPageComponent } from './cell-page/link-logo-page/link-logo-page.component';
import { LinkIconPageComponent } from './cell-page/link-icon-page/link-icon-page.component';
import { LinkDropdownPageComponent } from './cell-page/link-dropdown-page/link-dropdown-page.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CodePageComponent } from './organ-page/code-page/code-page.component';


import { IconComponent } from './lib/cell/icon/icon/icon.component'
import { IconLinkComponent } from './lib/cell/icon/icon-link/icon-link.component';
import { ButtonComponent } from './lib/cell/button/button/button.component';
import { ButtonIconComponent } from './lib/cell/button/button-icon/button-icon.component';
import { LinkComponent } from './lib/cell/link/link/link.component';
import { LinkIconComponent } from './lib/cell/link/link-icon/link-icon.component';
import { SidebarComponent } from './lib/tissue/nav/sidebar/sidebar.component';
import { IconSidebarComponent } from './lib/tissue/nav/icon-sidebar/icon-sidebar.component';
import { NavbarComponent } from './lib/tissue/navbar/navbar/navbar.component';
import { LoginComponent } from './lib/organ/login/login/login.component';
import { RegisterComponent } from './lib/organ/register/register/register.component';
import { ForgetComponent } from './lib/organ/forget/forget/forget.component';
import { TableComponent } from './lib/tissue/table/table/table.component';
import { InputTextComponent } from './lib/cell/input/input-text/input-text.component';
import { SearchbarComponent } from './lib/tissue/searchbar/searchbar/searchbar.component';
import { InputIconTextLabelComponent } from './lib/cell/input/input-icon-text-label/input-icon-text-label.component';
import { InputTextIconLabelComponent } from './lib/cell/input/input-text-icon-label/input-text-icon-label.component';
import { GalleryButtonComponent } from './lib/tissue/gallery/gallery-button/gallery-button.component';
import { PageComponent } from './lib/tissue/page/page.component';
import { InputFileComponent } from './lib/cell/input/input-file/input-file.component';
import { InputTextsComponent } from './lib/cell/input/input-texts/input-texts.component';
import { CrudFileComponent } from './lib/organ/crud/crud-file/crud-file.component';
import { NavbarIconComponent } from './lib/tissue/navbar/navbar-icon/navbar-icon.component';
import { ClientbarComponent } from './lib/tissue/clientbar/clientbar/clientbar.component';
import { ModalComponent } from './lib/organ/modal/modal/modal.component';
import { ModalToastComponent } from './lib/organ/modal/modal-toast/modal-toast.component';
import { ModalFileComponent } from './lib/organ/modal/modal-file/modal-file.component';
import { CodeComponent } from './lib/organ/code/code/code.component';
import { TableActionComponent } from './lib/tissue/table/table-action/table-action.component';
import { CrudFileActionComponent } from './lib/organ/crud/crud-file-action/crud-file-action.component';
import { ResetComponent } from './lib/organ/reset/reset/reset.component';
import { LinkLogoComponent } from './lib/cell/link/link-logo/link-logo.component';
import { IconButtonComponent } from './lib/cell/icon/icon-button/icon-button.component';
import { LinkDropdownComponent } from './lib/cell/link/link-dropdown/link-dropdown.component';
import { ButtonSubmitComponent } from './lib/cell/button/button-submit/button-submit.component';
import { ButtonDropdownComponent } from './lib/cell/button/button-dropdown/button-dropdown.component';
import { FormComponent } from './lib/organ/form/form/form.component';
import { NavbarLinkIconComponent } from './lib/tissue/navbar/navbar-link-icon/navbar-link-icon.component';
import { FooterComponent } from './lib/tissue/footer/footer/footer.component';
import { InputFloatingTextsComponent } from './lib/cell/input/input-floating-texts/input-floating-texts.component';
import { InputIconTextsComponent } from './lib/cell/input/input-icon-texts/input-icon-texts.component';
import { CardActionComponent } from './lib/cell/card/card-action/card-action.component';
import { CardIconActionComponent } from './lib/cell/card/card-icon-action/card-icon-action.component';
import { CardImageActionComponent } from './lib/cell/card/card-image-action/card-image-action.component';
import { CardComponent } from './lib/cell/card/card/card.component';
import { CardImageComponent } from './lib/cell/card/card-image/card-image.component';
import { CardIconComponent } from './lib/cell/card/card-icon/card-icon.component';
import { CrudTableComponent } from './lib/organ/crud/crud-table/crud-table.component';
import { CrudCardComponent } from './lib/organ/crud/crud-card/crud-card.component';
import { ProfileComponent } from './lib/organ/profile/profile/profile.component';
import { TabLinkComponent } from './lib/tissue/nav/tab-link/tab-link.component';
import { TabFormComponent } from './lib/tissue/nav/tab-form/tab-form.component';
import { TabButtonComponent } from './lib/tissue/nav/tab-button/tab-button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent,
    IconPageComponent,
    LinkPageComponent,
    ButtonPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ForgetPageComponent,
    TablePageComponent,
    TableDetailPageComponent,
    InputPageComponent,
    CrudPageComponent,
    ResetPageComponent,
    IconLinkPageComponent,
    IconButtonPageComponent,
    CellPageComponent,
    TissuePageComponent,
    OrganPageComponent,
    ButtonIconPageComponent,
    ButtonDropdownPageComponent,
    ButtonSubmitPageComponent,
    LinkLogoPageComponent,
    LinkIconPageComponent,
    LinkDropdownPageComponent,
    CodePageComponent,
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
    TabFormComponent,
    TabButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
