import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TdIcon } from './cell/td-icon/td-icon';



@NgModule({
  declarations: [
    TdIcon,
  ],
  imports: [
    CommonModule
  ],
    exports: [
    TdIcon,
  ],
})
export class LibModule { }
