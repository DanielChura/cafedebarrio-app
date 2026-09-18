import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getRole() !== 'ADMIN') {
    return router.createUrlTree([auth.isLoggedIn() ? '/' : '/login']);
  }
  return true;
};
