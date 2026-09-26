import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  requireLogin(): boolean {
    if (this.auth.isLoggedIn()) return true;
    this.router.navigateByUrl('/login');
    return false;
  }
}
