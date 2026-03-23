import { Routes } from '@angular/router';
import { SuperAdminLayoutComponent } from './super-admin-layout.component';

export const SUPER_ADMIN_ROUTES: Routes = [{
  path: '', component: SuperAdminLayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', loadComponent: () => import('./pages/super-admin-dashboard.component').then(m => m.SuperAdminDashboardComponent) },
    // Master data — product hierarchy management
    { path: 'uloc-settings', loadComponent: () => import('./pages/super-admin-uloc-settings.component').then(m => m.SuperAdminUlocSettingsComponent) },
    { path: 'iloc-settings', loadComponent: () => import('./pages/super-admin-iloc-settings.component').then(m => m.SuperAdminIlocSettingsComponent) },
    { path: 'cvp-codes', loadComponent: () => import('./pages/super-admin-cvp-codes.component').then(m => m.SuperAdminCvpCodesComponent) },
    // Rate entry — CVP×Tier (ULOC) and SubCategory×Tier (ILOC)
    { path: 'uloc-rates', loadComponent: () => import('./pages/super-admin-uloc-rates.component').then(m => m.SuperAdminUlocRatesComponent) },
    { path: 'iloc-rates', loadComponent: () => import('./pages/super-admin-iloc-rates.component').then(m => m.SuperAdminIlocRatesComponent) },
    { path: 'workflows', loadComponent: () => import('./pages/super-admin-workflows.component').then(m => m.SuperAdminWorkflowsComponent) },
  ]
}];
