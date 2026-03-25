import { Routes } from '@angular/router';
import { ReviewerLayoutComponent } from './reviewer-layout';
export const REVIEWER_ROUTES: Routes = [{
  path: '', component: ReviewerLayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    { path: 'dashboard', loadComponent: () => import('./pages/reviewer-dashboard').then(m => m.ReviewerDashboardComponent) },
    { path: 'uloc', loadComponent: () => import('./pages/reviewer-uloc').then(m => m.ReviewerUlocComponent) },
    { path: 'iloc', loadComponent: () => import('./pages/reviewer-iloc').then(m => m.ReviewerIlocComponent) },
  ]
}];
