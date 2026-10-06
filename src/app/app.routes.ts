import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';
import { staffGuard } from './core/guards/staff-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/shop/home/home').then((c) => c.Home),
  },
  {
    path: 'catalog',
    loadComponent: () => import('./features/shop/catalog/catalog').then((c) => c.Catalog),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/shop/product-detail/product-detail').then((c) => c.ProductDetail),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/shop/cart/cart').then((c) => c.Cart),
  },
  {
    path: 'my-orders',
    redirectTo: 'me/orders',
  },
  {
    path: 'me',
    canActivate: [authGuard],
    loadComponent: () => import('./features/me/me').then((c) => c.Me),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'orders' },
      {
        path: 'orders',
        loadComponent: () => import('./features/me/me-orders/me-orders').then((c) => c.MeOrders),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/me/me-profile/me-profile').then((c) => c.MeProfile),
      },
      {
        path: 'returns',
        loadComponent: () => import('./features/me/me-returns/me-returns').then((c) => c.MeReturns),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [staffGuard],
    loadComponent: () => import('./features/admin/admin').then((c) => c.Admin),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'ordenes' },
      {
        path: 'categorias',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/categories/admin-categories').then((c) => c.AdminCategories),
      },
      {
        path: 'productos',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/products/admin-products').then((c) => c.AdminProducts),
      },
      {
        path: 'usuarios',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin/users/admin-users').then((c) => c.AdminUsers),
      },
      {
        path: 'ordenes',
        canActivate: [staffGuard],
        loadComponent: () =>
          import('./features/admin/orders/admin-orders').then((c) => c.AdminOrders),
      },
      {
        path: 'devoluciones',
        canActivate: [staffGuard],
        loadComponent: () =>
          import('./features/admin/returns/admin-returns').then((c) => c.AdminReturns),
      },
    ],
  },
  {
    path: 'oauth/callback',
    loadComponent() {
      return import('./core/callback/callback').then((c) => c.Callback);
    },
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((c) => c.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((c) => c.Register),
  },
];
