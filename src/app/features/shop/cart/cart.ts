import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartItemResponse } from '../../../core/models';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { ProductService } from '../../../core/services/product';
import { TrashIcon } from '../../../shared/icons/trash-icon';

@Component({
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink, TrashIcon],
  selector: 'app-cart',
  templateUrl: './cart.html',
})
export class Cart implements OnInit {
  readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly products = inject(ProductService);
  private readonly attempted = new Set<string>();

  readonly images = signal<Record<string, string>>({});
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly error = signal('');
  readonly loading = signal(false);
  readonly confirmed = signal(false);

  readonly form = this.formBuilder.group({
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      for (const item of this.cart.items()) {
        if (item.imageUrl || this.images()[item.productId] || this.attempted.has(item.productId))
          continue;
        this.attempted.add(item.productId);
        this.products.findById(item.productId).subscribe({
          next: (product) => {
            if (product.imageUrl)
              this.images.update((images) => ({ ...images, [item.productId]: product.imageUrl! }));
          },
          error: () => {},
        });
      }
      this.auth.me().subscribe({
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

  ngOnInit(): void {
    this.cart.load();
  }

  imageFor(item: CartItemResponse): string | undefined {
    return item.imageUrl ?? this.images()[item.productId];
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  retry(): void {
    this.cart.load();
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
