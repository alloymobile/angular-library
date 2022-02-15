import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconComponent } from './shared/library/cell/icon/icon.component';
import { ButtonComponent } from './shared/library/cell/button/button.component';
import { LinkComponent } from './shared/library/cell/link/link.component';
import { NavbarComponent } from './shared/library/organ/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    IconComponent,
    ButtonComponent,
    LinkComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
