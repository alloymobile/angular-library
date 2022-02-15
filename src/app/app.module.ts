import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconComponent } from './shared/library/cell/icon/icon.component';
import { ButtonComponent } from './shared/library/cell/button/button.component';
import { LinkComponent } from './shared/library/cell/link/link.component';
import { ButtonBarComponent } from './shared/library/tissue/button-bar/button-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    IconComponent,
    ButtonComponent,
    LinkComponent,
    ButtonBarComponent
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
