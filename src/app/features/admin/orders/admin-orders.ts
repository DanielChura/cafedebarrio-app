import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderResponse, OrderState } from '../../../core/models';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-admin-orders',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './admin-orders.html',
})
export class AdminOrders {
  private readonly api = inject(OrderService);

  readonly items = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly states: OrderState[] = ['PENDING', 'PREPARING', 'DELIVERED'];

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

  changeStatus(item: OrderResponse, status: OrderState): void {
    if (status === item.status) return;
    this.api.updateStatus(item.id, { status }).subscribe({ next: () => this.load() });
  }
}
