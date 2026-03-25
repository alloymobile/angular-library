import { Routes } from '@angular/router';
import { roleGuard } from './shared/guards/role.guard';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'view-rates' },
  {
    path: 'view-rates',
    canActivate: [roleGuard('PLRA_VIEWER', 'PLRA_REVIEWER', 'PLRA_ADMIN', 'PLRA_SUPER_ADMIN')],
    loadChildren: () => import('./layouts/viewer-layout/viewer.routes').then(m => m.VIEWER_ROUTES),
  },
  {
    path: 'review-rates',
    canActivate: [roleGuard('PLRA_REVIEWER', 'PLRA_ADMIN', 'PLRA_SUPER_ADMIN')],
    loadChildren: () => import('./layouts/reviewer-layout/reviewer.routes').then(m => m.REVIEWER_ROUTES),
  },
  {
    path: 'enter-rates',
    canActivate: [roleGuard('PLRA_ADMIN', 'PLRA_SUPER_ADMIN')],
    loadChildren: () => import('./layouts/admin-layout/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'approve-rates',
    canActivate: [roleGuard('PLRA_SUPER_ADMIN')],
    loadChildren: () => import('./layouts/super-admin-layout/super-admin.routes').then(m => m.SUPER_ADMIN_ROUTES),
  },
  {
    path: 'no-access',
    loadComponent: () => import('./shared/components/no-access/no-access.component').then(m => m.NoAccessComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./shared/components/login/login.component').then(m => m.LoginComponent),
  },
  { path: '**', redirectTo: 'view-rates' },
];
