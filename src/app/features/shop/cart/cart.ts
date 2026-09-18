import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../../core/models';
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
  readonly sending = signal(false);
  readonly confirmed = signal(false);

  readonly form = this.formBuilder.group({
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  increase(item: CartItem): void {
    this.cart.updateQuantity(item.product.id, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    this.cart.updateQuantity(item.product.id, item.quantity - 1);
  }

  remove(productId: string): void {
    this.cart.removeProduct(productId);
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
    const userId = this.auth.getUserId();
    if (userId === null) {
      this.router.navigateByUrl('/login');
      return;
    }
    const { phone, address } = this.form.getRawValue();
    this.error.set('');
    this.sending.set(true);
    this.cart
      .checkout({ userId, phone: phone.trim(), address: address.trim() })
      .subscribe({
        next: () => {
          this.sending.set(false);
          this.confirmed.set(true);
        },
        error: () => {
          this.sending.set(false);
          this.error.set('No pudimos enviar tu pedido. Intenta de nuevo.');
        },
      });
  }

  closeConfirmation(): void {
    this.confirmed.set(false);
  }
}
