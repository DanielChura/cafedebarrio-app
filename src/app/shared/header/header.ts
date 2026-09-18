import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';
import { AccountMenu } from '../account-menu/account-menu';
import { CartIcon } from '../icons/cart-icon';
import { SearchIcon } from '../icons/search-icon';
import { UserIcon } from '../icons/user-icon';

@Component({
  imports: [RouterLink, AccountMenu, CartIcon, SearchIcon, UserIcon],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly cart = inject(CartService);

  readonly menuOpen = signal(false);

  search(term: string): void {
    this.router.navigate(['/catalog'], { queryParams: term ? { q: term } : {} });
  }

  onAccountClick(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
