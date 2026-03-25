import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout';
export const ADMIN_ROUTES: Routes = [{
  path: '', component: AdminLayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', loadComponent: () => import('./pages/admin-dashboard').then(m => m.AdminDashboardComponent) },
    { path: 'uloc', loadComponent: () => import('./pages/admin-uloc-rates').then(m => m.AdminUlocRatesComponent) },
    { path: 'iloc', loadComponent: () => import('./pages/admin-iloc-rates').then(m => m.AdminIlocRatesComponent) },
  ]
}];
