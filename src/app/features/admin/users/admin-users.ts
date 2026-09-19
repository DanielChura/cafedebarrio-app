import { Component, inject, signal } from '@angular/core';
import { UserResponse } from '../../../core/models';
import { UserService } from '../../../core/services/user';
import { TrashIcon } from '../../../shared/icons/trash-icon';

@Component({
  selector: 'app-admin-users',
  imports: [TrashIcon],
  templateUrl: './admin-users.html',
})
export class AdminUsers {
  private readonly users = inject(UserService);

  readonly items = signal<UserResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.users.findAll({ size: 50 }).subscribe({
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

  remove(id: string): void {
    this.users.delete(id).subscribe({ next: () => this.load() });
  }
}
