import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DemoLayout } from './layout/demo-layout/demo-layout';

import { CellPage } from './pages/cell-page/cell-page';
import { IconPage } from './pages/cell-page/icon-page/icon-page';

import { TissuePage } from './pages/tissue-page/tissue-page';
import { OrganPage } from './pages/organ-page/organ-page';

const routes: Routes = [
  {
    path: '',
    component: DemoLayout,
    children: [
      { path: '', redirectTo: 'cell', pathMatch: 'full' },
      {
        path: 'cell',
        component: CellPage,
        children: [
          { path: '', component: IconPage },

          // future:
          // { path: 'button', component: ButtonPage },
          // { path: 'link', component: LinkPage },
        ],
      },

      { path: 'tissue', component: TissuePage },
      { path: 'organ', component: OrganPage },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule {}
