import { Service, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CartItem, OrderItemRequest, OrderRequest, OrderResponse, ProductResponse } from '../models';
import { OrderService } from './order';

const STORAGE_KEY = 'cafe_cart';

@Service()
export class CartService {
  private readonly orderService = inject(OrderService);

  readonly items = signal<CartItem[]>(this.loadFromStorage());

  readonly totalCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );

  readonly totalPrice = computed(() =>
    this.items().reduce((total, item) => total + item.product.price * item.quantity, 0),
  );

  addProduct(product: ProductResponse, quantity = 1): void {
    if (quantity <= 0) return;

    this.items.update((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      let updated: CartItem[];

      if (existing) {
        updated = current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        updated = [...current, { product, quantity }];
      }

      this.saveToStorage(updated);
      return updated;
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }

    this.items.update((current) => {
      const updated = current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      );
      this.saveToStorage(updated);
      return updated;
    });
  }

  removeProduct(productId: string): void {
    this.items.update((current) => {
      const updated = current.filter((item) => item.product.id !== productId);
      this.saveToStorage(updated);
      return updated;
    });
  }

  clear(): void {
    this.items.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  toOrderItems(): OrderItemRequest[] {
    return this.items().map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
  }

  checkout(data: { userId: string; phone: string; address: string }): Observable<OrderResponse> {
    const request: OrderRequest = {
      userId: data.userId,
      phone: data.phone,
      address: data.address,
      items: this.toOrderItems(),
    };

    return this.orderService.create(request).pipe(
      tap(() => this.clear()),
    );
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? (JSON.parse(data) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar errores de almacenamiento local
    }
  }
}
