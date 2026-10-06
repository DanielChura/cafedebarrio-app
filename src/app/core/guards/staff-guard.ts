import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const staffGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();
  if (role !== 'ADMIN' && role !== 'OPERATOR') {
    return router.createUrlTree([auth.isLoggedIn() ? '/' : '/login']);
  }
  return true;
};
