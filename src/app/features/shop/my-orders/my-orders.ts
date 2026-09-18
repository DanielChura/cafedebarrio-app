import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderResponse, UserResponse } from '../../../core/models';
import { AuthService } from '../../../core/services/auth';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-my-orders',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './my-orders.html',
})
export class MyOrders {
  private readonly auth = inject(AuthService);
  private readonly orders = inject(OrderService);

  readonly me = signal<UserResponse | null>(null);
  readonly items = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly userOrders = computed(() => {
    const user = this.me();
    if (!user) return [];
    return this.items().filter((order) => order.userId === user.id);
  });

  constructor() {
    this.loading.set(true);
    this.error.set(false);
    this.auth.me().subscribe({
      next: (user) => {
        this.me.set(user);
        this.orders.findAll({ size: 50 }).subscribe({
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
}
