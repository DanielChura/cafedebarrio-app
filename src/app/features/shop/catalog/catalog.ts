import { Component, inject, resource, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Page, ProductResponse } from '../../../core/models';
import { CategoryService } from '../../../core/services/category';
import { ProductService } from '../../../core/services/product';
import { ProductCard } from '../components/product-card/product-card';

@Component({
  selector: 'app-catalog',
  imports: [FormsModule, ProductCard],
  templateUrl: './catalog.html',
})
export class Catalog {
  private readonly products = inject(ProductService);
  private readonly categories = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);

  readonly search = signal('');
  readonly categoryId = signal<string | undefined>(undefined);

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.search.set(params.get('q') ?? '');
    });
  }

  readonly items = resource<
    Page<ProductResponse>,
    { name: string; categoryId: string | undefined }
  >({
    params: () => ({ name: this.search(), categoryId: this.categoryId() }),
    loader: ({ params }) =>
      firstValueFrom(this.products.findAll({ ...params, onlyActive: true, size: 24 })),
  });

  readonly allCategories = resource({
    loader: () => firstValueFrom(this.categories.findAll({ size: 50 })),
  });
}
