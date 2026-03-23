import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
export const ADMIN_ROUTES: Routes = [{
  path: '', component: AdminLayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', loadComponent: () => import('./pages/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
    { path: 'uloc', loadComponent: () => import('./pages/admin-uloc-rates.component').then(m => m.AdminUlocRatesComponent) },
    { path: 'iloc', loadComponent: () => import('./pages/admin-iloc-rates.component').then(m => m.AdminIlocRatesComponent) },
    { path: 'workflows', loadComponent: () => import('./pages/admin-workflows.component').then(m => m.AdminWorkflowsComponent) },
  ]
}];
