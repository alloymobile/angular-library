import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlraLayout } from './layout/plra-layout/plra-layout';
import { PlraHome } from './pages/plra-home/plra-home';

const routes: Routes = [
  {
    path: '',
    component: PlraLayout,
    children: [
      { path: '', component: PlraHome }, 
      { path: '**', redirectTo: '' },    
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlraRoutingModule {}
