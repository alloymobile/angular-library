import { Routes } from '@angular/router';
import { ViewerLayoutComponent } from './viewer-layout';
export const VIEWER_ROUTES: Routes = [{
  path: '', component: ViewerLayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', loadComponent: () => import('./pages/viewer-dashboard').then(m => m.ViewerDashboardComponent) },
    { path: 'uloc', loadComponent: () => import('./pages/viewer-uloc').then(m => m.ViewerUlocComponent) },
    { path: 'iloc', loadComponent: () => import('./pages/viewer-iloc').then(m => m.ViewerIlocComponent) },
  ]
}];
