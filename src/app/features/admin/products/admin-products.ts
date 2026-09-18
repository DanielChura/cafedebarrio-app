import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryResponse, ProductResponse } from '../../../core/models';
import { CategoryService } from '../../../core/services/category';
import { ProductService } from '../../../core/services/product';

@Component({
  selector: 'app-admin-products',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './admin-products.html',
})
export class AdminProducts {
  private readonly products = inject(ProductService);
  private readonly categories = inject(CategoryService);

  readonly items = signal<ProductResponse[]>([]);
  readonly allCategories = signal<CategoryResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showModal = signal(false);
  readonly editingId = signal<string | null>(null);

  readonly name = signal('');
  readonly price = signal<number | null>(null);
  readonly stock = signal<number | null>(null);
  readonly categoryId = signal('');
  readonly description = signal('');
  readonly imageUrl = signal('');

  constructor() {
    this.load();
    this.categories.findAll({ size: 50 }).subscribe({
      next: (page) => {
        this.allCategories.set(page.content);
        if (!this.categoryId() && page.content.length) this.categoryId.set(page.content[0].id);
      },
      error: () => this.error.set(true),
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.products.findAll({ size: 50 }).subscribe({
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

  save(): void {
    if (!this.name().trim() || this.price() === null || this.stock() === null || !this.categoryId())
      return;
    const body = {
      name: this.name().trim(),
      price: Number(this.price()),
      stock: Number(this.stock()),
      categoryId: this.categoryId(),
      description: this.description().trim() || undefined,
      imageUrl: this.imageUrl().trim() || undefined,
    };
    const done = () => {
      this.close();
      this.load();
    };
    const id = this.editingId();
    if (id) this.products.update(id, body).subscribe({ next: done });
    else this.products.create(body).subscribe({ next: done });
  }

  openCreate(): void {
    this.cancel();
    this.showModal.set(true);
  }

  edit(item: ProductResponse): void {
    this.editingId.set(item.id);
    this.name.set(item.name);
    this.price.set(item.price);
    this.stock.set(item.stock);
    this.categoryId.set(item.categoryId);
    this.description.set(item.description ?? '');
    this.imageUrl.set(item.imageUrl ?? '');
    this.showModal.set(true);
  }

  close(): void {
    this.showModal.set(false);
    this.cancel();
  }

  cancel(): void {
    this.editingId.set(null);
    this.name.set('');
    this.price.set(null);
    this.stock.set(null);
    this.description.set('');
    this.imageUrl.set('');
  }

  remove(id: string): void {
    this.products.delete(id).subscribe({ next: () => this.load() });
  }
}
