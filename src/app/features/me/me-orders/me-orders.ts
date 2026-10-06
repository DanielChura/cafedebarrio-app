import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  OrderItemResponse,
  OrderResponse,
  RETURN_REASONS,
  ReturnCreateRequest,
  UserResponse,
} from '../../../core/models';
import { AuthService } from '../../../core/services/auth';
import { OrderService } from '../../../core/services/order';
import { ReturnService } from '../../../core/services/return';
import { ToastService } from '../../../core/services/toast';
import { getOrderStatusClass, getOrderStatusLabel } from '../../../core/utils/status';
import { CalendarIcon } from '../../../shared/icons/calendar-icon';
import { MapPinIcon } from '../../../shared/icons/map-pin-icon';
import { PhoneIcon } from '../../../shared/icons/phone-icon';
import { ProductIcon } from '../../../shared/icons/product-icon';
import { ReturnIcon } from '../../../shared/icons/return-icon';

@Component({
  selector: 'app-me-orders',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    ProductIcon,
    MapPinIcon,
    PhoneIcon,
    CalendarIcon,
    ReturnIcon,
  ],
  templateUrl: './me-orders.html',
})
export class MeOrders {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly returnService = inject(ReturnService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly getStatusLabel = getOrderStatusLabel;
  readonly getStatusClass = getOrderStatusClass;
  readonly reasons = RETURN_REASONS;

  readonly me = signal<UserResponse | null>(null);
  readonly allOrders = signal<OrderResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly selectedOrder = signal<OrderResponse | null>(null);
  readonly selectedItem = signal<OrderItemResponse | null>(null);
  readonly openReturn = signal(false);
  readonly returnLoading = signal(false);

  readonly userOrders = computed(() => {
    const user = this.me();
    if (!user) return [];
    return this.allOrders().filter((order) => order.userId === user.id);
  });

  readonly returnForm = this.fb.group({
    reason: ['', [Validators.required, Validators.maxLength(500)]],
    comment: ['', Validators.maxLength(500)],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.authService.me().subscribe({
      next: (user) => {
        this.me.set(user);
        this.orderService.findAll({ size: 100 }).subscribe({
          next: (page) => {
            this.allOrders.set(page.content);
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
            this.error.set(true);
          },
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  startReturn(order: OrderResponse, item: OrderItemResponse): void {
    this.selectedOrder.set(order);
    this.selectedItem.set(item);
    this.returnForm.reset({ reason: '', comment: '', quantity: 1 });
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
      items: [{ orderDetailId: item.id, quantity }],
    };

    this.returnLoading.set(true);
    this.returnService.create(request).subscribe({
      next: () => {
        this.returnLoading.set(false);
        this.closeReturn();
        this.toast.show('Tu solicitud de devolución fue enviada con éxito.', 'success');
      },
      error: () => {
        this.returnLoading.set(false);
        this.toast.show('No pudimos enviar tu solicitud de devolución. Intenta de nuevo.', 'error');
      },
    });
  }
}
