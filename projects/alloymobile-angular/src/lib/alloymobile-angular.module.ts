import { ModuleWithProviders, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IconComponent } from './cell/icon/icon/icon.component';
import { ButtonComponent } from './cell/button/button/button.component';
import { LinkComponent } from './cell/link/link/link.component';
import { InputFloatingTextsComponent } from './tissue/inputs/input-floating-texts/input-floating-texts.component';
import { InputIconTextsComponent } from './tissue/inputs/input-icon-texts/input-icon-texts.component';
import { ButtonIconComponent } from './cell/button/button-icon/button-icon.component';
import { LinkIconComponent } from './cell/link/link-icon/link-icon.component';
import { InputTextComponent } from './cell/input/input-text/input-text.component';

import { CardActionComponent } from './tissue/card/card-action/card-action.component';
import { CardIconActionComponent } from './tissue/card/card-icon-action/card-icon-action.component';
import { CardImageActionComponent } from './tissue/card/card-image-action/card-image-action.component';
import { CardComponent } from './tissue/card/card/card.component';
import { CardImageComponent } from './tissue/card/card-image/card-image.component';
import { CardIconComponent } from './tissue/card/card-icon/card-icon.component';
import { SidebarComponent } from './tissue/nav/sidebar/sidebar.component';
import { IconSidebarComponent } from './tissue/nav/icon-sidebar/icon-sidebar.component';
import { NavbarComponent } from './tissue/navbar/navbar/navbar.component';
import { InputTextsComponent } from './tissue/inputs/input-texts/input-texts.component';
import { LinkLogoComponent } from './cell/link/link-logo/link-logo.component';
import { IconLinkComponent } from './cell/icon/icon-link/icon-link.component';
import { IconButtonComponent } from './cell/icon/icon-button/icon-button.component';
import { ButtonSubmitComponent } from './cell/button/button-submit/button-submit.component';

import { TableComponent } from './tissue/table/table/table.component';
import { SearchbarComponent } from './tissue/searchbar/searchbar/searchbar.component';
import { PageComponent } from './tissue/page/page.component';
import { ClientbarComponent } from './tissue/clientbar/clientbar/clientbar.component';
import { TableActionComponent } from './tissue/table/table-action/table-action.component';
import { FooterComponent } from './tissue/footer/footer/footer.component';

import { FormComponent } from './organ/form/form/form.component';
import { ModalComponent } from './organ/modal/modal/modal.component';
import { ModalToastComponent } from './organ/modal/modal-toast/modal-toast.component';
import { ResetComponent } from './organ/reset/reset/reset.component';
import { CodeComponent } from './organ/code/code/code.component';
import { LoginComponent } from './organ/login/login/login.component';
import { RegisterComponent } from './organ/register/register/register.component';
import { ForgetComponent } from './organ/forget/forget/forget.component';
import { CrudTableComponent } from './organ/crud/crud-table/crud-table.component';
import { CrudCardComponent } from './organ/crud/crud-card/crud-card.component';
import { ProfileComponent } from './organ/profile/profile/profile.component';
import { TabFormComponent } from './tissue/nav/tab-form/tab-form.component';
import { LinkBarComponent } from './tissue/bar/link-bar/link-bar.component';
import { ButtonBarComponent } from './tissue/bar/button-bar/button-bar.component';
import { InputFloatingTextComponent } from './cell/input/input-floating-text/input-floating-text.component';
import { InputIconTextComponent } from './cell/input/input-icon-text/input-icon-text.component';
import { ButtonDropdownComponent } from './cell/button/button-dropdown/button-dropdown.component';
import { PayComponent } from './tissue/pay/pay/pay.component';
import { NgxStripeModule } from 'ngx-stripe';
import { CheckoutComponent } from './organ/checkout/checkout/checkout.component';
import { DonateComponent } from './organ/donate/donate/donate.component';
import { NavbarActionComponent } from './tissue/navbar/navbar-action/navbar-action.component';
import { ContactComponent } from './organ/contact/contact/contact.component';

var stripekey = "";
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
    PageComponent,
    InputTextsComponent,
    ClientbarComponent,
    ModalComponent,
    ModalToastComponent,
    CodeComponent,
    TableActionComponent,
    ResetComponent,
    LinkLogoComponent,
    IconButtonComponent,
    ButtonSubmitComponent,
    FormComponent,
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
    TabFormComponent,
    LinkBarComponent,
    ButtonBarComponent,
    InputFloatingTextComponent,
    InputIconTextComponent,
    ButtonDropdownComponent,
    PayComponent,
    CheckoutComponent,
    DonateComponent,
    NavbarActionComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    NgxStripeModule.forRoot(stripekey ? stripekey : "pk_test_3razFwq1sWDPvXkxGX5C8ORi00HyfFcIeL"),
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
    PageComponent,
    InputTextsComponent,
    ClientbarComponent,
    ModalComponent,
    ModalToastComponent,
    CodeComponent,
    TableActionComponent,
    ResetComponent,
    LinkLogoComponent,
    ButtonSubmitComponent,
    ButtonDropdownComponent,
    FormComponent,
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
    TabFormComponent,
    InputFloatingTextComponent,
    InputIconTextComponent,
    ButtonBarComponent,
    LinkBarComponent,
    ButtonDropdownComponent,
    PayComponent,
    CheckoutComponent,
    DonateComponent,
    NavbarActionComponent,
    ContactComponent
  ]
})
export class AlloymobileAngularModule {
  static forRoot(configuration): ModuleWithProviders<AlloymobileAngularModule> {
    stripekey = configuration.stripekey;
    return {
      ngModule: AlloymobileAngularModule
    };
  }
}
