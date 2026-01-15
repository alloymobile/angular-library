import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlraRoutingModule } from './plra-routing-module';
import { PlraHome } from './pages/plra-home/plra-home';
import { PlraLayout } from './layout/plra-layout/plra-layout';
import { LibModule } from '../lib/lib-module';


@NgModule({
  declarations: [
    PlraHome,
    PlraLayout
  ],
  imports: [
    CommonModule,
    LibModule,
    PlraRoutingModule
  ]
})
export class PlraModule { }
