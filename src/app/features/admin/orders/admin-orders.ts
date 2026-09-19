import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderResponse, OrderState } from '../../../core/models';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-admin-orders',
  imports: [FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './admin-orders.html',
})
export class AdminOrders {
  private readonly orders = inject(OrderService);

  readonly items = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly states: OrderState[] = ['PENDING', 'PREPARING', 'DELIVERED'];

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
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
  }

  changeStatus(item: OrderResponse, status: OrderState): void {
    if (status === item.status) return;
    this.orders.updateStatus(item.id, { status }).subscribe({ next: () => this.load() });
  }
}
