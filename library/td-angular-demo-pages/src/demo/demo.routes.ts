import { Routes } from '@angular/router';
import { TdDemoShellComponent } from './shell/td-demo-shell';

export const TD_DEMO_ROUTES: Routes = [
  { path: 'demo', component: TdDemoShellComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'cell/td-button' },
    { path: 'cell/td-button', loadComponent: () => import('./pages/cell/td-button-demo/td-button-demo').then(m => m.TdButtonDemoComponent) },
    { path: 'cell/td-button-icon', loadComponent: () => import('./pages/cell/td-button-icon-demo/td-button-icon-demo').then(m => m.TdButtonIconDemoComponent) },
    { path: 'cell/td-button-submit', loadComponent: () => import('./pages/cell/td-button-submit-demo/td-button-submit-demo').then(m => m.TdButtonSubmitDemoComponent) },
    { path: 'cell/td-button-dropdown', loadComponent: () => import('./pages/cell/td-button-dropdown-demo/td-button-dropdown-demo').then(m => m.TdButtonDropdownDemoComponent) },
    { path: 'cell/td-icon', loadComponent: () => import('./pages/cell/td-icon-demo/td-icon-demo').then(m => m.TdIconDemoComponent) },
    { path: 'cell/td-input', loadComponent: () => import('./pages/cell/td-input-demo/td-input-demo').then(m => m.TdInputDemoComponent) },
    { path: 'cell/td-loading', loadComponent: () => import('./pages/cell/td-loading-demo/td-loading-demo').then(m => m.TdLoadingDemoComponent) },
    { path: 'cell/td-link', loadComponent: () => import('./pages/cell/td-link-demo/td-link-demo').then(m => m.TdLinkDemoComponent) },
    { path: 'cell/td-link-icon', loadComponent: () => import('./pages/cell/td-link-icon-demo/td-link-icon-demo').then(m => m.TdLinkIconDemoComponent) },
    { path: 'cell/td-link-logo', loadComponent: () => import('./pages/cell/td-link-logo-demo/td-link-logo-demo').then(m => m.TdLinkLogoDemoComponent) },
    { path: 'cell/td-media', loadComponent: () => import('./pages/cell/td-media-demo/td-media-demo').then(m => m.TdMediaDemoComponent) },
    { path: 'cell/td-quantity', loadComponent: () => import('./pages/cell/td-quantity-demo/td-quantity-demo').then(m => m.TdQuantityDemoComponent) },
    { path: 'cell/td-search', loadComponent: () => import('./pages/cell/td-search-demo/td-search-demo').then(m => m.TdSearchDemoComponent) },
    { path: 'tissue/td-button-bar', loadComponent: () => import('./pages/tissue/td-button-bar-demo/td-button-bar-demo').then(m => m.TdButtonBarDemoComponent) },
    { path: 'tissue/td-link-bar', loadComponent: () => import('./pages/tissue/td-link-bar-demo/td-link-bar-demo').then(m => m.TdLinkBarDemoComponent) },
    { path: 'tissue/td-navbar', loadComponent: () => import('./pages/tissue/td-navbar-demo/td-navbar-demo').then(m => m.TdNavbarDemoComponent) },
    { path: 'tissue/td-form', loadComponent: () => import('./pages/tissue/td-form-demo/td-form-demo').then(m => m.TdFormDemoComponent) },
    { path: 'tissue/td-card', loadComponent: () => import('./pages/tissue/td-card-demo/td-card-demo').then(m => m.TdCardDemoComponent) },
    { path: 'tissue/td-card-action', loadComponent: () => import('./pages/tissue/td-card-action-demo/td-card-action-demo').then(m => m.TdCardActionDemoComponent) },
    { path: 'tissue/td-carousel', loadComponent: () => import('./pages/tissue/td-carousel-demo/td-carousel-demo').then(m => m.TdCarouselDemoComponent) },
    { path: 'tissue/td-image', loadComponent: () => import('./pages/tissue/td-image-demo/td-image-demo').then(m => m.TdImageDemoComponent) },
    { path: 'tissue/td-video', loadComponent: () => import('./pages/tissue/td-video-demo/td-video-demo').then(m => m.TdVideoDemoComponent) },
    { path: 'tissue/td-table', loadComponent: () => import('./pages/tissue/td-table-demo/td-table-demo').then(m => m.TdTableDemoComponent) },
    { path: 'tissue/td-pagination', loadComponent: () => import('./pages/tissue/td-pagination-demo/td-pagination-demo').then(m => m.TdPaginationDemoComponent) },
    { path: 'tissue/td-modal', loadComponent: () => import('./pages/tissue/td-modal-demo/td-modal-demo').then(m => m.TdModalDemoComponent) },
    { path: 'tissue/td-modal-toast', loadComponent: () => import('./pages/tissue/td-modal-toast-demo/td-modal-toast-demo').then(m => m.TdModalToastDemoComponent) },
  ]},
];
