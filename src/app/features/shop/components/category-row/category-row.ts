import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryResponse } from '../../../../core/models/category';
import { ProductResponse } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-category-row',
  imports: [ProductCard, RouterLink],
  templateUrl: './category-row.html',
})
export class CategoryRow implements OnInit {
  readonly category = input.required<CategoryResponse>();

  private readonly products = inject(ProductService);

  readonly items = signal<ProductResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(false);
    this.products
      .findAll({ categoryId: this.category().id, onlyActive: true, size: 5 })
      .subscribe({
        next: (page) => {
          this.items.set(page.content);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }
}
