import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';

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
    canActivate: [authGuard],
    loadComponent: () => import('./features/shop/my-orders/my-orders').then((c) => c.MyOrders),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin').then((c) => c.Admin),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'categorias' },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/admin/categories/admin-categories').then((c) => c.AdminCategories),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/admin/products/admin-products').then((c) => c.AdminProducts),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/admin/users/admin-users').then((c) => c.AdminUsers),
      },
      {
        path: 'ordenes',
        loadComponent: () =>
          import('./features/admin/orders/admin-orders').then((c) => c.AdminOrders),
      },
    ],
  },
  {
    path: 'admin/products',
    redirectTo: 'admin/productos',
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
