import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AUTH_TOKEN_KEY } from '../../../core/services/auth';
import { AccountMenu } from '../account-menu/account-menu';

@Component({
  imports: [RouterLink, AccountMenu],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  private readonly router = inject(Router);

  readonly menuOpen = signal(false);

  search(term: string): void {
    this.router.navigate(['/catalog'], { queryParams: term ? { q: term } : {} });
  }

  onAccountClick(): void {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
