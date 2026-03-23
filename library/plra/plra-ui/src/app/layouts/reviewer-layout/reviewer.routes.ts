import { Routes } from '@angular/router';
import { ReviewerLayoutComponent } from './reviewer-layout.component';
export const REVIEWER_ROUTES: Routes = [{
  path: '', component: ReviewerLayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', loadComponent: () => import('./pages/reviewer-dashboard.component').then(m => m.ReviewerDashboardComponent) },
    { path: 'uloc', loadComponent: () => import('./pages/reviewer-uloc.component').then(m => m.ReviewerUlocComponent) },
    { path: 'iloc', loadComponent: () => import('./pages/reviewer-iloc.component').then(m => m.ReviewerIlocComponent) },
    { path: 'pending', loadComponent: () => import('./pages/reviewer-pending.component').then(m => m.ReviewerPendingComponent) },
  ]
}];
