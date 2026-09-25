import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductResponse } from '../../../../core/models';
import { AuthService } from '../../../../core/services/auth';
import { CartService } from '../../../../core/services/cart';
import { AddIcon } from '../../../../shared/icons/add-icon';
import { StartIcon } from '../../../../shared/icons/star-icon';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, AddIcon, StartIcon],
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<ProductResponse>();
  readonly stars = [1, 2, 3, 4, 5];
  readonly filledStars = computed(() =>
    Math.min(5, Math.max(0, Math.round(this.product().averageRating ?? 0))),
  );

  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  add(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.cart.addItem(this.product().id).subscribe();
  }
}
