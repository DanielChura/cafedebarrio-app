import { HttpClient } from '@angular/common/http';
import { Service, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItemRequest, CartResponse, OrderRequest, OrderResponse } from '../models';
import { OrderService } from './order';

@Service()
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly orderService = inject(OrderService);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  readonly cart = signal<CartResponse | null>(null);

  readonly items = computed(() => this.cart()?.items ?? []);
  readonly totalCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );
  readonly totalPrice = computed(() => this.cart()?.total ?? 0);

  load(): void {
    this.http.get<CartResponse>(this.apiUrl).subscribe({
      next: (cart) => this.cart.set(cart),
      error: () => this.cart.set(null),
    });
  }

  addItem(productId: string, quantity = 1): Observable<CartResponse> {
    const request: CartItemRequest = { productId, quantity };
    return this.http
      .post<CartResponse>(`${this.apiUrl}/items`, request)
      .pipe(tap((cart) => this.cart.set(cart)));
  }

  updateQuantity(productId: string, quantity: number): Observable<CartResponse> {
    const request: CartItemRequest = { productId, quantity };
    return this.http
      .put<CartResponse>(`${this.apiUrl}/items`, request)
      .pipe(tap((cart) => this.cart.set(cart)));
  }

  removeProduct(productId: string): Observable<CartResponse> {
    return this.http
      .delete<CartResponse>(`${this.apiUrl}/items/${productId}`)
      .pipe(tap((cart) => this.cart.set(cart)));
  }

  checkout(request: OrderRequest): Observable<OrderResponse> {
    return this.orderService.create(request).pipe(tap(() => this.load()));
  }
}
