import { Component, inject, signal } from '@angular/core';
import { UserResponse } from '../../../core/models';
import { UserService } from '../../../core/services/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.html',
})
export class AdminUsers {
  private readonly api = inject(UserService);

  readonly items = signal<UserResponse[]>([]);
  readonly loading = signal(true);

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

  remove(id: string): void {
    this.api.delete(id).subscribe({ next: () => this.load() });
  }
}
