import { Component, ElementRef, OnInit, inject, input, signal, viewChild } from '@angular/core';
import { CategoryResponse } from '../../../../core/models/category';
import { ProductResponse } from '../../../../core/models/product';
import { ProductService } from '../../../../core/services/product';
import { ArrowLeft } from '../../../../shared/icons/arrow-left';
import { ArrowRight } from '../../../../shared/icons/arrow-right';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-category-row',
  imports: [ProductCard, ArrowLeft, ArrowRight],
  templateUrl: './category-row.html',
})
export class CategoryRow implements OnInit {
  readonly category = input.required<CategoryResponse>();

  private readonly products = inject(ProductService);

  readonly items = signal<ProductResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly track = viewChild<ElementRef<HTMLElement>>('track');

  scroll(direction: 1 | -1): void {
    const el = this.track()?.nativeElement;
    el?.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' });
  }

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
