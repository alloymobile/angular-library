import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibModule } from '../lib/lib-module';
import { DemoRoutingModule } from './demo-routing-module';

import { DemoLayout } from './layout/demo-layout/demo-layout';

import { CellPage } from './pages/cell-page/cell-page';
import { IconPage } from './pages/cell-page/icon-page/icon-page';

import { TissuePage } from './pages/tissue-page/tissue-page';
import { OrganPage } from './pages/organ-page/organ-page';

@NgModule({
  declarations: [
    DemoLayout,

    CellPage,
    IconPage,

    TissuePage,
    OrganPage,
  ],
  imports: [
    CommonModule,
    LibModule,
    DemoRoutingModule,
  ],
})
export class DemoModule {}
