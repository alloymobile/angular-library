import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconComponent } from './cell/icon/icon.component';
import { ButtonComponent } from './cell/button/button/button.component';
import { LinkComponent } from './cell/link/link/link.component';
import { TextComponent } from './cell/input/text/text.component';
import { IconLinkComponent } from './cell/link/icon-link/icon-link.component';
import { IconButtonComponent } from './cell/button/icon-button/icon-button.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    IconComponent,
    ButtonComponent,
    LinkComponent,
    TextComponent,
    IconLinkComponent,
    IconButtonComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
  ],
  exports: [
  ]
})
export class AlloymobileAngularModule { }
