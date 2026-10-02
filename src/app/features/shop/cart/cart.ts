import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartItemResponse } from '../../../core/models';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { TrashIcon } from '../../../shared/icons/trash-icon';

@Component({
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, TrashIcon],
  selector: 'app-cart',
  templateUrl: './cart.html',
})
export class Cart {
  readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly error = signal<string | null>(null);
  readonly loading = signal<boolean>(false);
  readonly confirmed = signal<boolean>(false);

  readonly form = this.formBuilder.group({
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      this.authService.me().subscribe({
        next: (user) => {
          this.form.patchValue({
            phone: user.phone || '',
            address: user.address || '',
          });
        },
        error: () => {},
      });
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  retry(): void {
    this.cartService.load();
  }

  increase(item: CartItemResponse): void {
    this.cartService.updateQuantity(item.productId, item.quantity + 1).subscribe();
  }

  decrease(item: CartItemResponse): void {
    if (item.quantity - 1 <= 0) this.remove(item.productId);
    else this.cartService.updateQuantity(item.productId, item.quantity - 1).subscribe();
  }

  remove(productId: string): void {
    this.cartService.removeProduct(productId).subscribe();
  }

  submit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return;
    }
    const { phone, address } = this.form.getRawValue();
    this.error.set('');
    this.loading.set(true);
    this.cartService.checkout({ phone: phone.trim(), address: address.trim() }).subscribe({
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
