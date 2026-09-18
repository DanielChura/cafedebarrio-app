import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductResponse } from '../../../core/models';
import { CartService } from '../../../core/services/cart';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  private readonly products = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly product = signal<ProductResponse | null>(null);
  readonly loading = signal(true);
  readonly failed = signal(false);
  readonly quantity = signal(1);

  readonly subtotal = computed(() => (this.product()?.price ?? 0) * this.quantity());

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.failed.set(true);
      this.loading.set(false);
      return;
    }
    this.products.findById(id).subscribe({
      next: (item) => {
        this.product.set(item);
        this.loading.set(false);
      },
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  increase(): void {
    this.quantity.update((current) => current + 1);
  }

  decrease(): void {
    this.quantity.update((current) => Math.max(1, current - 1));
  }

  add(): void {
    const item = this.product();
    if (!item) return;
    this.cart.addProduct(item, this.quantity());
    this.router.navigateByUrl('/cart');
  }
}
