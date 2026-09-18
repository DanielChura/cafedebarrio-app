import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryResponse, ProductResponse } from '../../../core/models';
import { CategoryService } from '../../../core/services/category';
import { ProductService } from '../../../core/services/product';
import { ProductCard } from '../components/product-card/product-card';

@Component({
  selector: 'app-catalog',
  imports: [ProductCard],
  templateUrl: './catalog.html',
})
export class Catalog {
  private readonly products = inject(ProductService);
  private readonly categories = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly items = signal<ProductResponse[]>([]);
  readonly allCategories = signal<CategoryResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly categoryId = signal<string | undefined>(undefined);

  constructor() {
    this.categories.findAll({ size: 50 }).subscribe({
      next: (page) => this.allCategories.set(page.content),
      error: () => this.error.set(true),
    });

    this.route.queryParamMap.subscribe((params) => {
      const category = params.get('category') ?? undefined;
      const search = params.get('q') ?? '';
      this.categoryId.set(category);
      this.loadProducts(search, category);
    });
  }

  selectCategory(categoryId: string | undefined): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId ?? null },
      queryParamsHandling: 'merge',
    });
  }

  private loadProducts(search: string, categoryId?: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.products.findAll({ name: search, categoryId, onlyActive: true, size: 50 }).subscribe({
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
