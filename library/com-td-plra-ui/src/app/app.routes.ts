import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'demo',
    loadChildren: () => import('./demo/demo-module').then((m) => m.DemoModule),
  },
  {
    path: '',
    loadChildren: () => import('./plra/plra-module').then((m) => m.PlraModule),
  },
];
