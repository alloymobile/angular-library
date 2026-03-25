import { Routes } from '@angular/router';
import { SuperAdminLayoutComponent } from './super-admin-layout';
export const SUPER_ADMIN_ROUTES: Routes = [{
  path: '', component: SuperAdminLayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', loadComponent: () => import('./pages/super-admin-dashboard').then(m => m.SuperAdminDashboardComponent) },
    { path: 'uloc-settings', loadComponent: () => import('./pages/super-admin-uloc-settings').then(m => m.SuperAdminUlocSettingsComponent) },
    { path: 'iloc-settings', loadComponent: () => import('./pages/super-admin-iloc-settings').then(m => m.SuperAdminIlocSettingsComponent) },
    { path: 'cvp-codes', loadComponent: () => import('./pages/super-admin-cvp-codes').then(m => m.SuperAdminCvpCodesComponent) },
    { path: 'uloc-rates', loadComponent: () => import('./pages/super-admin-uloc-rates').then(m => m.SuperAdminUlocRatesComponent) },
    { path: 'iloc-rates', loadComponent: () => import('./pages/super-admin-iloc-rates').then(m => m.SuperAdminIlocRatesComponent) },
    { path: 'workflows', loadComponent: () => import('./pages/super-admin-workflows').then(m => m.SuperAdminWorkflowsComponent) },
  ]
}];
