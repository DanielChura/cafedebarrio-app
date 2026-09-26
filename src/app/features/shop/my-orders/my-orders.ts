import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderResponse, UpdateUserRequest, UserResponse } from '../../../core/models';
import { AuthService } from '../../../core/services/auth';
import { OrderService } from '../../../core/services/order';
import { UserService } from '../../../core/services/user';
import { EditIcon } from '../../../shared/icons/edit-icon';

@Component({
  selector: 'app-my-orders',
  imports: [CurrencyPipe, DatePipe, RouterLink, ReactiveFormsModule, EditIcon],
  templateUrl: './my-orders.html',
})
export class MyOrders {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly openForm = signal(false);
  readonly me = signal<UserResponse | null>(null);
  readonly items = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly userOrders = computed(() => {
    const user = this.me();
    if (!user) return [];
    return this.items().filter((order) => order.userId === user.id);
  });

  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
  });

  constructor() {
    this.authService.me().subscribe({
      next: (user) => {
        this.me.set(user);
        this.orderService.findAll({ size: 50 }).subscribe({
          next: (page) => {
            this.items.set(page.content);
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
            this.error.set(true);
          },
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  editProfile(): void {
    const user = this.me();
    if (user) {
      this.form.patchValue({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
      });
    }
    this.openForm.set(true);
  }

  cancel(): void {
    this.openForm.set(false);
  }

  submit(): void {
    if (this.form.invalid) return;
    const id = this.me()?.id;
    if (!id) return;
    const raw = this.form.getRawValue();
    const user: UpdateUserRequest = {
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      address: raw.address,
    };
    this.userService.update(id, user).subscribe({
      next: (updated) => {
        this.me.set(updated);
        this.openForm.set(false);
      },
      error: () => {
        this.openForm.set(false);
      },
    });
  }
}
