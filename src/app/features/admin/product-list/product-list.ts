import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ProductResponse } from '../../../core/models';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  templateUrl: './product-list.html',
})
export class ProductList {
  private readonly products = inject(ProductService);

  readonly items = signal<ProductResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    this.products.findAll({ size: 50 }).subscribe({
      next: (page) => {
        this.items.set(page.content);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
