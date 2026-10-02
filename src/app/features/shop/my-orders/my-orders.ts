import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  OrderItemResponse,
  OrderResponse,
  ReturnCreateRequest,
  ReturnResponse,
  UpdateUserRequest,
  UserResponse,
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth';
import { OrderService } from '../../../core/services/order';
import { ReturnService } from '../../../core/services/return';
import { UserService } from '../../../core/services/user';
import { EditIcon } from '../../../shared/icons/edit-icon';

@Component({
  selector: 'app-my-orders',
  imports: [CurrencyPipe, DatePipe, RouterLink, ReactiveFormsModule, EditIcon],
  templateUrl: './my-orders.html',
})
export class MyOrders {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly returnService = inject(ReturnService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly openForm = signal(false);
  readonly me = signal<UserResponse | null>(null);
  readonly items = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly expandedOrderId = signal<string | null>(null);
  readonly selectedOrder = signal<OrderResponse | null>(null);
  readonly selectedItem = signal<OrderItemResponse | null>(null);
  readonly openReturn = signal(false);
  readonly returnLoading = signal(false);
  readonly returnError = signal<string | null>(null);
  readonly returnSuccess = signal(false);
  readonly returns = signal<ReturnResponse[]>([]);

  readonly userOrders = computed(() => {
    const user = this.me();
    if (!user) return [];
    return this.items().filter((order) => order.userId === user.id);
  });

  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
  });

  readonly returnForm = this.fb.group({
    reason: ['', [Validators.required, Validators.maxLength(500)]],
    comment: ['', Validators.maxLength(500)],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.authService.me().subscribe({
      next: (user) => {
        this.me.set(user);
        this.orderService.findAll({ size: 50 }).subscribe({
          next: (page) => {
            this.items.set(page.content);
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
            this.error.set(true);
          },
        });
        this.returnService.findMyReturns({ size: 50 }).subscribe({
          next: (page) => this.returns.set(page.content),
          error: () => {},
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  editProfile(): void {
    const user = this.me();
    if (user) {
      this.form.patchValue({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
      });
    }
    this.openForm.set(true);
  }

  cancel(): void {
    this.openForm.set(false);
  }

  submit(): void {
    if (this.form.invalid) return;
    const id = this.me()?.id;
    if (!id) return;
    const raw = this.form.getRawValue();
    const user: UpdateUserRequest = {
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      address: raw.address,
    };
    this.userService.update(id, user).subscribe({
      next: (updated) => {
        this.me.set(updated);
        this.openForm.set(false);
      },
      error: () => {
        this.openForm.set(false);
      },
    });
  }

  toggleOrder(id: string): void {
    this.expandedOrderId.set(this.expandedOrderId() === id ? null : id);
  }

  startReturn(order: OrderResponse, item: OrderItemResponse): void {
    this.selectedOrder.set(order);
    this.selectedItem.set(item);
    this.returnForm.reset({ reason: '', comment: '', quantity: 1 });
    this.returnError.set(null);
    this.returnSuccess.set(false);
    this.openReturn.set(true);
  }

  closeReturn(): void {
    this.openReturn.set(false);
    this.selectedOrder.set(null);
    this.selectedItem.set(null);
  }

  submitReturn(): void {
    const order = this.selectedOrder();
    const item = this.selectedItem();
    if (!order || !item) return;
    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }
    const raw = this.returnForm.getRawValue();
    const quantity = Math.min(raw.quantity, item.quantity);
    const request: ReturnCreateRequest = {
      orderId: order.id,
      reason: raw.reason.trim(),
      comment: raw.comment.trim(),
      items: [{ orderDetailId: item.id ?? item.productId, quantity }],
    };
    this.returnError.set(null);
    this.returnLoading.set(true);
    this.returnService.create(request).subscribe({
      next: (created) => {
        this.returnLoading.set(false);
        this.returnSuccess.set(true);
        this.returns.update((list) => [created, ...list]);
      },
      error: () => {
        this.returnLoading.set(false);
        this.returnError.set('No pudimos enviar tu devolución. Intenta de nuevo.');
      },
    });
  }
}
