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
  private readonly ordersService = inject(OrderService);

  readonly me = signal<UserResponse | null>(null);
  readonly orders = signal<OrderResponse[]>([]);
  readonly loadingMe = signal(true);
  readonly loadingOrders = signal(true);
  readonly meFailed = signal(false);
  readonly ordersFailed = signal(false);

  readonly userOrders = computed(() => {
    const user = this.me();
    if (!user) return [];
    return this.orders().filter((order) => order.userId === user.id);
  });

  constructor() {
    this.auth.me().subscribe({
      next: (user) => {
        this.me.set(user);
        this.loadingMe.set(false);
      },
      error: () => {
        this.meFailed.set(true);
        this.loadingMe.set(false);
      },
    });

    this.ordersService.findAll({ size: 50 }).subscribe({
      next: (page) => {
        this.orders.set(page.content ?? []);
        this.loadingOrders.set(false);
      },
      error: () => {
        this.ordersFailed.set(true);
        this.loadingOrders.set(false);
      },
    });
  }
}
