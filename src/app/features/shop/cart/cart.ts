import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartItemResponse } from '../../../core/models';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';

@Component({
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  selector: 'app-cart',
  templateUrl: './cart.html',
})
export class Cart {
  readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly error = signal('');
  readonly loading = signal(false);
  readonly confirmed = signal(false);

  readonly form = this.formBuilder.group({
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  constructor() {
    if (this.auth.isLoggedIn()) this.cart.load();
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  increase(item: CartItemResponse): void {
    this.cart.updateQuantity(item.productId, item.quantity + 1).subscribe();
  }

  decrease(item: CartItemResponse): void {
    if (item.quantity - 1 <= 0) this.remove(item.productId);
    else this.cart.updateQuantity(item.productId, item.quantity - 1).subscribe();
  }

  remove(productId: string): void {
    this.cart.removeProduct(productId).subscribe();
  }

  submit(): void {
    if (this.cart.items().length === 0) {
      this.error.set('Tu carrito está vacío.');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Ingresa tu teléfono y dirección de entrega.');
      return;
    }
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    const { phone, address } = this.form.getRawValue();
    this.error.set('');
    this.loading.set(true);
    this.cart.checkout({ phone: phone.trim(), address: address.trim() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.confirmed.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No pudimos enviar tu pedido. Intenta de nuevo.');
      },
    });
  }

  closeConfirmation(): void {
    this.confirmed.set(false);
  }
}
