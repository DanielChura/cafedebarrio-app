import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItemRequest, CartResponse, OrderRequest, OrderResponse } from '../models';
import { AuthService } from './auth';
import { OrderService } from './order';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  readonly cart = signal<CartResponse | null>(null);
  readonly loading = signal(false);
  readonly failed = signal(false);

  readonly items = computed(() => this.cart()?.items ?? []);
  readonly totalCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0),
  );
  readonly totalPrice = computed(() => this.cart()?.total ?? 0);

  constructor() {
    effect(() => {
      const user = this.auth.user();
      if (user) {
        this.load();
      } else {
        this.cart.set(null);
        this.loading.set(false);
        this.failed.set(false);
      }
    });
  }

  load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.getByUserId().subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.loading.set(false);
      },
      error: () => {
        this.cart.set(null);
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  getByUserId(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl);
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
