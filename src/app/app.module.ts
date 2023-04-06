import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AlloymobileAngularModule } from 'alloymobile-angular';

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
import { TokenPageComponent } from './organ-page/token-page/token-page.component';
import { CrudPageComponent } from './organ-page/crud-page/crud-page.component';
import { ResetPageComponent } from './organ-page/reset-page/reset-page.component';
import { IconLinkPageComponent } from './cell-page/icon-link-page/icon-link-page.component';
import { IconButtonPageComponent } from './cell-page/icon-button-page/icon-button-page.component';
import { CellPageComponent } from './cell-page/cell-page.component';
import { TissuePageComponent } from './tissue-page/tissue-page.component';
import { OrganPageComponent } from './organ-page/organ-page.component';

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
    TokenPageComponent,
    CrudPageComponent,
    ResetPageComponent,
    IconLinkPageComponent,
    IconButtonPageComponent,
    CellPageComponent,
    TissuePageComponent,
    OrganPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AlloymobileAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
