import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryResponse } from '../../../core/models';
import { CategoryService } from '../../../core/services/category';

@Component({
  selector: 'app-admin-categories',
  imports: [FormsModule],
  templateUrl: './admin-categories.html',
})
export class AdminCategories {
  private readonly api = inject(CategoryService);

  readonly items = signal<CategoryResponse[]>([]);
  readonly loading = signal(true);
  readonly showModal = signal(false);
  readonly name = signal('');
  readonly editingId = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.api.findAll({ size: 50 }).subscribe({
      next: (page) => {
        this.items.set(page.content ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  save(): void {
    const name = this.name().trim();
    if (!name) return;
    const id = this.editingId();
    const done = () => {
      this.close();
      this.load();
    };
    if (id) this.api.update(id, { name }).subscribe({ next: done });
    else this.api.create({ name }).subscribe({ next: done });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.name.set('');
    this.showModal.set(true);
  }

  edit(item: CategoryResponse): void {
    this.editingId.set(item.id);
    this.name.set(item.name);
    this.showModal.set(true);
  }

  close(): void {
    this.showModal.set(false);
    this.editingId.set(null);
    this.name.set('');
  }

  remove(id: string): void {
    this.api.delete(id).subscribe({ next: () => this.load() });
  }
}
