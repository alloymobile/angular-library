import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AlloymobileAngularModule } from 'alloymobile-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconPageComponent } from './cell/icon-page/icon-page.component';
import { LinkPageComponent } from './cell/link-page/link-page.component';
import { ButtonPageComponent } from './cell/button-page/button-page.component';
import { LoginPageComponent } from './organ/login-page/login-page.component';
import { RegisterPageComponent } from './organ/register-page/register-page.component';
import { ForgetPageComponent } from './organ/forget-page/forget-page.component';
import { TablePageComponent } from './tissue/table-page/table-page.component';
import { TableDetailPageComponent } from './table-detail-page/table-detail-page.component';
import { InputPageComponent } from './cell/input-page/input-page.component';
import { TokenPageComponent } from './organ/token-page/token-page.component';
import { CrudPageComponent } from './organ/crud-page/crud-page.component';
import { ResetPageComponent } from './organ/reset-page/reset-page.component';

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
    ResetPageComponent
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
