import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CategoryResponse, ProductRequest, ProductResponse } from '../../../core/models';
import { CategoryService } from '../../../core/services/category';
import { ProductService } from '../../../core/services/product';
import { AddIcon } from '../../../shared/icons/add-icon';
import { EditIcon } from '../../../shared/icons/edit-icon';
import { TrashIcon } from '../../../shared/icons/trash-icon';
import { ProductForm } from './product-form/product-form';

@Component({
  selector: 'app-admin-products',
  imports: [CurrencyPipe, ProductForm, AddIcon, EditIcon, TrashIcon],
  templateUrl: './admin-products.html',
})
export class AdminProducts {
  private readonly productService = inject(ProductService);
  private readonly categories = inject(CategoryService);

  readonly items = signal<ProductResponse[]>([]);
  readonly allCategories = signal<CategoryResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly showModal = signal(false);
  readonly editingItem = signal<ProductResponse | null>(null);
  readonly saving = signal(false);

  constructor() {
    this.load();
    this.categories.findAll({ size: 50 }).subscribe({
      next: (page) => this.allCategories.set(page.content),
      error: () => this.error.set(true),
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.productService.findAll({ size: 50 }).subscribe({
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

  save(body: ProductRequest): void {
    this.saving.set(true);
    const done = () => {
      this.saving.set(false);
      this.close();
      this.load();
    };
    const id = this.editingItem()?.id;
    if (id)
      this.productService
        .update(id, body)
        .subscribe({ next: done, error: () => this.saving.set(false) });
    else
      this.productService
        .create(body)
        .subscribe({ next: done, error: () => this.saving.set(false) });
  }

  openCreate(): void {
    this.editingItem.set(null);
    this.showModal.set(true);
  }

  edit(item: ProductResponse): void {
    this.editingItem.set(item);
    this.showModal.set(true);
  }

  close(): void {
    this.showModal.set(false);
    this.editingItem.set(null);
  }

  remove(id: string): void {
    this.productService.delete(id).subscribe({ next: () => this.load() });
  }
}
