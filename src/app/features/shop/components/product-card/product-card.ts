import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductResponse } from '../../../../core/models';
import { CartService } from '../../../../core/services/cart';
import { AddIcon } from '../../../../shared/icons/add-icon';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink, AddIcon],
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<ProductResponse>();
  private readonly cart = inject(CartService);

  add(): void {
    this.cart.addProduct(this.product());
  }
}
