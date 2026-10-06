import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CartService } from '../../core/services/cart';
import { SessionService } from '../../core/utils/session.service';
import { CartIcon } from '../icons/cart-icon';
import { CategoryIcon } from '../icons/category-icon';
import { LogoIcon } from '../icons/logo-icon';
import { SearchIcon } from '../icons/search-icon';
import { UserIcon } from '../icons/user-icon';

@Component({
  imports: [RouterLink, CartIcon, CategoryIcon, LogoIcon, SearchIcon, UserIcon],
  selector: 'app-header',
  templateUrl: './header.html',
})
export class Header implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  readonly cart = inject(CartService);

  ngOnInit(): void {
    this.cart.load();
  }

  search(term: string): void {
    this.router.navigate(['/catalog'], { queryParams: term ? { q: term } : {} });
  }

  onAccountClick(): void {
    if (!this.session.requireLogin()) return;
    this.router.navigateByUrl('/me/orders');
  }
}
