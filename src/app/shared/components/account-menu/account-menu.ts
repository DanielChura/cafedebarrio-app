import { Component, inject, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AUTH_TOKEN_KEY } from '../../../core/services/auth';

@Component({
  imports: [RouterLink],
  selector: 'app-account-menu',
  templateUrl: './account-menu.html',
})
export class AccountMenu {
  private readonly router = inject(Router);

  readonly closed = output<void>();

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.closed.emit();
    this.router.navigateByUrl('/login');
  }
}
