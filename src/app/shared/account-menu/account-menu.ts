import { Component, inject, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  imports: [RouterLink],
  selector: 'app-account-menu',
  templateUrl: './account-menu.html',
})
export class AccountMenu {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly closed = output<void>();

  readonly isAdmin = this.auth.getRole() === 'ADMIN';

  logout(): void {
    this.auth.logout();
    this.closed.emit();
    this.router.navigateByUrl('/login');
  }
}
