import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryResponse } from '../../../core/models/category';
import { CategoryService } from '../../../core/services/category';
import { CategoryRow } from '../components/category-row/category-row';
import { PromoBanner } from '../components/promo-banner/promo-banner';

@Component({
  selector: 'app-home',
  imports: [CategoryRow, PromoBanner, RouterLink],
  templateUrl: './home.html',
})
export class Home {
  private readonly categories = inject(CategoryService);

  readonly allCategories = signal<CategoryResponse[]>([]);

  constructor() {
    this.categories.findAll({ size: 50 }).subscribe({
      next: (page) => this.allCategories.set(page.content),
    });
  }
}
