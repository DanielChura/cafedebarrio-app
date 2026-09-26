import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductResponse, ReviewResponse } from '../../../core/models';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { SessionService } from '../../../core/utils/session.service';
import { ProductService } from '../../../core/services/product';
import { ReviewService } from '../../../core/services/review';
import { ArrowLeft } from '../../../shared/icons/arrow-left';
import { CartIcon } from '../../../shared/icons/cart-icon';
import { StartIcon } from '../../../shared/icons/star-icon';
import { TrashIcon } from '../../../shared/icons/trash-icon';

@Component({
  selector: 'app-product-detail',
  imports: [
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    StartIcon,
    ArrowLeft,
    CartIcon,
    TrashIcon,
  ],
  templateUrl: './product-detail.html',
})
export class ProductDetail {
  private readonly products = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly reviews = inject(ReviewService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly product = signal<ProductResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly quantity = signal(1);

  readonly items = signal<ReviewResponse[]>([]);
  readonly reviewsLoading = signal(true);
  readonly reviewError = signal('');
  readonly sending = signal(false);

  readonly stars = [1, 2, 3, 4, 5];
  readonly filledStars = computed(() =>
    Math.min(5, Math.max(0, Math.round(this.product()?.averageRating ?? 0))),
  );

  readonly reviewForm = this.formBuilder.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.maxLength(500)],
  });

  readonly subtotal = computed(() => (this.product()?.price ?? 0) * this.quantity());

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      this.loading.set(false);
      this.reviewsLoading.set(false);
      return;
    }
    this.products.findById(id).subscribe({
      next: (item) => {
        this.product.set(item);
        this.loading.set(false);
        this.loadReviews(item.id);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.reviewsLoading.set(false);
      },
    });
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.auth.getRole() === 'ADMIN';
  }

  increase(): void {
    const maxStock = this.product()?.stock ?? 1;
    this.quantity.update((current) => Math.min(maxStock, current + 1));
  }

  decrease(): void {
    this.quantity.update((current) => Math.max(1, current - 1));
  }

  add(): void {
    const item = this.product();
    if (!item || !this.session.requireLogin()) return;
    this.cart.addItem(item.id, this.quantity()).subscribe({
      next: () => this.router.navigateByUrl('/cart'),
    });
  }

  submitReview(): void {
    const item = this.product();
    if (!item || !this.session.requireLogin()) return;
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      this.reviewError.set('Elige una calificación entre 1 y 5.');
      return;
    }
    const { rating, comment } = this.reviewForm.getRawValue();
    this.reviewError.set('');
    this.sending.set(true);
    this.reviews
      .create({ productId: item.id, rating, comment: comment.trim() || undefined })
      .subscribe({
        next: () => {
          this.reviewForm.reset({ rating: 5, comment: '' });
          this.sending.set(false);
          this.loadReviews(item.id);
          this.products.findById(item.id).subscribe({
            next: (updated) => this.product.set(updated),
          });
        },
        error: () => {
          this.sending.set(false);
          this.reviewError.set('No pudimos enviar tu reseña. Intenta de nuevo.');
        },
      });
  }

  removeReview(id: string): void {
    const item = this.product();
    if (!item) return;
    this.reviews.delete(id).subscribe({
      next: () => {
        this.loadReviews(item.id);
        this.products.findById(item.id).subscribe({
          next: (updated) => this.product.set(updated),
        });
      },
    });
  }

  private loadReviews(productId: string): void {
    this.reviewsLoading.set(true);
    this.reviews.findByProduct({ productId, size: 20 }).subscribe({
      next: (page) => {
        this.items.set(page.content);
        this.reviewsLoading.set(false);
      },
      error: () => this.reviewsLoading.set(false),
    });
  }
}
