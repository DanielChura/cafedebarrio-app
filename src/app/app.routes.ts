import { Routes } from '@angular/router';

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
    path: 'my-orders',
    loadComponent: () => import('./features/shop/my-orders/my-orders').then((c) => c.MyOrders),
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
