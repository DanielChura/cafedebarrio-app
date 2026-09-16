import { Component, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CategoryResponse } from '../../../../core/models/category';
import { ProductService } from '../../../../core/services/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-category-row',
  imports: [ProductCard, RouterLink],
  templateUrl: './category-row.html',
})
export class CategoryRow {
  readonly category = input.required<CategoryResponse>();

  private readonly products = inject(ProductService);

  readonly items = resource({
    params: () => ({ categoryId: this.category().id }),
    loader: ({ params }) =>
      firstValueFrom(
        this.products.findAll({ categoryId: params.categoryId, onlyActive: true, size: 5 }),
      ),
  });
}
